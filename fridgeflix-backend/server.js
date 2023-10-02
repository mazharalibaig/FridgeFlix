import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import OpenAI from "openai";
import axios from "axios";
import rateLimit from "express-rate-limit"; // Import the rate-limiting middleware

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 9000;

// Initialize rate limiting middleware
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
});

initializeMiddlewares();
initializeServer();

// Apply rate limiting middleware to the /search endpoint
app.post("/search", limiter, handleSearchRequest);

function initializeMiddlewares() {
  app.use(cors());
  app.use(bodyParser.json());
}

function initializeServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Handle the search request with rate limiting
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

// Fetch dish names from OpenAI
async function fetchDishNamesFromOpenAI(searchTerm) {
  const prompt = `What made with ${searchTerm} and other spices found commonly in US kitchens, give list of 6 top dishes sorted by popularity`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0].message.content;
  return [...content.matchAll(/\d+\.\s(.*?):/g)].map((match) => match[1]);
}

// Fetch recipe links for dish names
async function fetchRecipeLinksForDishes(dishNames) {
  const recipeLinks = [];

  for (const dish of dishNames) {
    const query = `Here is the best recipe for ${dish}:`;
    const response = await axios.post(
      "https://api.metaphor.systems/search",
      {
        query,
        numResults: 5,
        useAutoprompt: true,
        type: "neural",
      },
      {
        headers: {
          "x-api-key": process.env.METAPHOR_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const links = response.data.results.map((result) => result.url);
    recipeLinks.push({ [dish]: links });
  }

  return recipeLinks;
}

export default app;