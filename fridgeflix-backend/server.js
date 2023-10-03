import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import OpenAI from "openai";
import Metaphor from "metaphor-node";

const metaphor = new Metaphor(process.env.METAPHOR_API_KEY);

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 9000;

initializeMiddlewares();
initializeServer();

app.post("/search", handleSearchRequest);

function initializeMiddlewares() {
  app.use(cors());
  app.use(bodyParser.json());
}

function initializeServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

async function handleSearchRequest(req, res) {
  console.log("Search request received");

  const searchTerm = req.body.searchTerm;
  try {
    const dishNames = await fetchDishNamesFromOpenAI(searchTerm);
    const recipeLinks = await fetchRecipeLinksForDishes(dishNames);

    res.json({ metaphorResults: recipeLinks });
  } catch (error) {
    console.error("Error processing the search request:", error.message);
    res.status(500).json({ error: "Error processing the request." });
  }
}

async function fetchDishNamesFromOpenAI(searchTerm) {
  const prompt = `What made with ${searchTerm} and other spices found commonly in US kitchens, give list of 6 top dishes sorted by popularity`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content;
  return [...content.matchAll(/\d+\.\s(.*?):/g)].map((match) => match[1]);
}

async function fetchRecipeLinksForDishes(dishNames) {
  const recipeLinks = [];

  for (const dish of dishNames) {
    const query = `Here is the best recipe for ${dish}:`;
    const response = await metaphor.search(query, {
      numResults: 5,
      useAutoprompt: true,
      type: "neural",
    });

    const links = response.data.results.map((result) => result.url);
    recipeLinks.push({ [dish]: links });
  }

  return recipeLinks;
}

export default app;
