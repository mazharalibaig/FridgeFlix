import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import OpenAI from "openai";
import axios from "axios";
import rateLimit from "express-rate-limit";

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 9000;

const resultCache = {}; // Cache to store results of previous queries

// Initialize rate limiting middleware
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 10,
});

function generateCacheKey(ingredients, mealType) {
  return ingredients.sort().join("|") + "_" + mealType;
}

function initializeMiddlewares() {
  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          "http://localhost:3000",
          "https://fridgeflix.web.app",
        ];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );
  app.use(bodyParser.json());
}

function initializeServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

async function handleSearchRequest(req, res) {
  console.log("Search request received");

  const { searchTerm, mealType } = req.body;
  const cacheKey = generateCacheKey(searchTerm.split(" "), mealType);

  if (resultCache[cacheKey]) {
    console.log("Returning cached result");
    return res.json({ metaphorResults: resultCache[cacheKey] });
  }

  try {
    const dishNames = await fetchDishNamesFromOpenAI(searchTerm, mealType);
    const recipeLinks = await fetchRecipeLinksForDishes(dishNames);

    resultCache[cacheKey] = recipeLinks; // Store results in cache
    res.json({ metaphorResults: recipeLinks });
  } catch (error) {
    console.error("Error processing the search request:", error.message);
    res.status(500).json({ error: "Error processing the request." });
  }
}

async function fetchDishNamesFromOpenAI(searchTerm, mealType) {
  const prompt = `What can be made with mainly ${searchTerm} for ${mealType}, give list of 6 top dishes sorted by popularity`;
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

    console.log(response.data.results);

    const links = response.data.results.map((result) => result.url);
    recipeLinks.push({ [dish]: links });
  }

  return recipeLinks;
}

initializeMiddlewares();
initializeServer();
app.post("/search", limiter, handleSearchRequest);

export default app;
