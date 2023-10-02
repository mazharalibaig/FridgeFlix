import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Chip, Button, CircularProgress } from "@mui/material";
import "./FridgeFlix.css";
import { VEGETABLES, PROTEINS, SPICES } from "./Constants";
import Banner from "./Banner";
import WordCloud from "./WordCloud";
import RecipeResults from "./RecipeResults";
import Footer from "./Footer";
import { distributeWordsToRows } from "./utilities";

const SearchComponent = () => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [customIngredients, setCustomIngredients] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleWordClick = useCallback(
    (word) => {
      if (selectedWords.includes(word)) {
        setSelectedWords((prevWords) => prevWords.filter((w) => w !== word));
      } else {
        setSelectedWords((prevWords) => [...prevWords, word]);
      }
    },
    [selectedWords]
  );

  const handleSearch = useCallback(async () => {
    setIsLoading(true);

    let mealType = selectedWords.filter((word) =>
      ["breakfast", "lunch", "dinner"].includes(word)
    )[0];
    let ingredients = selectedWords.filter(
      (word) => !["breakfast", "lunch", "dinner"].includes(word)
    );

    // Add custom ingredients to the list
    Object.values(customIngredients).forEach((ing) => {
      if (ing) {
        ingredients.push(...ing.split(" "));
      }
    });

    try {
      const response = await axios.post(
        "https://cba5-2601-282-4100-9f10-68d5-7d8f-1bf5-2e12.ngrok-free.app/search",
        {
          searchTerm: ingredients.join(" "),
          mealType: mealType,
        }
      );
      setRecipes(response.data.metaphorResults);
    } catch (error) {
      console.error("Error making API call:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWords, customIngredients]);

  const handleReset = () => {
    setSelectedWords([]);
    setCustomIngredients({});
  };

  useEffect(() => {
    if (recipes.length > 0) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [recipes]);

  return (
    <div className="container">
      <Banner />
      <WordCloud
        category="Meal Type"
        words={[["breakfast", "lunch", "dinner"]]}
        selectedWords={selectedWords}
        onClick={handleWordClick}
        onCustomInputChange={(value) =>
          setCustomIngredients((prev) => ({ ...prev, MealType: value }))
        }
        header="Meal Type"
        chipClass="meal-type-chip"
        selectedChipClass="meal-type-chip-selected"
        headerClass="meal-type-header"
      />
      <WordCloud
        category="Vegetables"
        words={distributeWordsToRows(VEGETABLES)}
        selectedWords={selectedWords}
        onClick={handleWordClick}
        onCustomInputChange={(value) =>
          setCustomIngredients((prev) => ({ ...prev, Vegetables: value }))
        }
        header="Vegetables"
        chipClass="word-chip"
        selectedChipClass="word-chip-selected"
        headerClass="word-cloud-header"
      />
      <WordCloud
        category="Proteins"
        words={distributeWordsToRows(PROTEINS)}
        selectedWords={selectedWords}
        onClick={handleWordClick}
        onCustomInputChange={(value) =>
          setCustomIngredients((prev) => ({ ...prev, Proteins: value }))
        }
        header="Proteins"
        chipClass="word-chip"
        selectedChipClass="word-chip-selected"
        headerClass="word-cloud-header"
      />
      <WordCloud
        category="Spices"
        words={distributeWordsToRows(SPICES)}
        selectedWords={selectedWords}
        customInputValue={customIngredients.Spices}
        onClick={handleWordClick}
        onCustomInputChange={(value) =>
          setCustomIngredients((prev) => ({ ...prev, Spices: value }))
        }
        header="Spices"
        chipClass="word-chip"
        selectedChipClass="word-chip-selected"
        headerClass="word-cloud-header"
      />
      <div style={{ marginTop: "20px" }}></div>
      <Button
        className="generate-recipes-button"
        onClick={handleSearch}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={24} /> : null}
      >
        {isLoading ? "Generating" : "Generate!"}
      </Button>
      <div className="reset-link" onClick={handleReset}>
        Reset Selection
      </div>
      <RecipeResults recipes={recipes} />
      <Footer />
    </div>
  );
};

export default SearchComponent;
