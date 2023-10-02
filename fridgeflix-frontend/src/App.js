import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  Chip,
  Button,
  CircularProgress
} from "@mui/material";
import "./FridgeFlix.css";

const VEGETABLES = [
  "avocado", "bell peppers", "broccoli", "cabbage", "carrots", "cauliflower", "celery", "cucumber", "garlic", "lettuce", "mushrooms", "olives", "onions", "peppers", "potatoes", "spinach", "tomatoes"
]

const PROTEINS = [
  "anchovies", "beef", "bread", "butter", "cheese", "chicken", "clams", "crab", "duck", "eggs", "fish", "lamb", "lobster", "salmon", "sardines", "shrimp", "tofu", "trout", "turkey", "tuna"
]

const SPICES = [
  "basil", "black pepper", "cardamom", "chili powder", "chives", "cilantro", "cinnamon", "cloves", "coriander", "cumin", "fennel", "ginger", "mint", "nutmeg", "oregano", "paprika", "parsley", "rosemary", "saffron", "salt", "thyme", "turmeric"
]

const SearchComponent = () => {
  const [selectedWords, setSelectedWords] = useState([]);
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
  
    let mealType = selectedWords.filter(word => ["breakfast", "lunch", "dinner"].includes(word))[0];
    let ingredients = selectedWords.filter(word => !["breakfast", "lunch", "dinner"].includes(word));
  
    try {
      const response = await axios.post("http://localhost:9000/search", {
        searchTerm: ingredients.join(' '),
        mealType: mealType
      });
      setRecipes(response.data.metaphorResults);
    } catch (error) {
      console.error("Error making API call:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWords]);

  useEffect(() => {
    if (recipes.length > 0) {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }
  }, [recipes]);

  return (
    <div className="container">
      <Banner />
      <WordCloud 
        words={[["breakfast", "lunch", "dinner"]]}
        selectedWords={selectedWords}
        onClick={handleWordClick}
        header="Meal Type"
        chipClass="meal-type-chip"
        headerClass="meal-type-header"
      />
      <WordCloud
        words={distributeWordsToRows(VEGETABLES)}
        selectedWords={selectedWords}
        onClick={handleWordClick}
        header="Vegetables"
        chipClass="word-chip"
        headerClass="word-cloud-header"
      />
      <WordCloud
        words={distributeWordsToRows(PROTEINS)}
        selectedWords={selectedWords}
        onClick={handleWordClick}
        header="Proteins"
        chipClass="word-chip"
        headerClass="word-cloud-header"
      />
      <WordCloud
        words={distributeWordsToRows(SPICES)}
        selectedWords={selectedWords}
        onClick={handleWordClick}
        header="Spices"
        chipClass="word-chip"
        headerClass="word-cloud-header"
      />
      <Button
    className="generate-recipes-button"
    onClick={handleSearch}
    disabled={isLoading}
    startIcon={isLoading ? <CircularProgress size={24} /> : null}
>
    {isLoading ? "Generating" : "Generate!"}
</Button>
      <RecipeResults recipes={recipes} />
    </div>
  );
};

const Banner = () => (
  <div className="banner">
    FridgeFlix<span className="trademark-symbol">®</span>
  </div>
);

const WordCloud = ({ words, selectedWords, onClick, header, chipClass, headerClass }) => (
  <div className="word-cloud">
    {header && <div className={headerClass}>{header}</div>}
    {words.map((row, rowIndex) => (
      <div key={rowIndex} className="word-row">
        {row.map((word) => (
          <Chip
            key={word}
            label={word}
            onClick={() => onClick(word)}
            variant="outlined"
            className={
              selectedWords.includes(word) ? "word-chip-selected" : chipClass
            }
          />
        ))}
      </div>
    ))}
  </div>
);

const RecipeResults = ({ recipes }) => (
  <div className="recipe-results">
    {recipes.map((recipe, index) => {
      const dishName = Object.keys(recipe)[0];
      const links = recipe[dishName];
      return (
        <div key={index} className="recipe-item">
          <h3 className="recipe-title">{dishName}</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {new URL(link).hostname}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    })}
  </div>
);

function distributeWordsToRows(words) {
  let rows = [];
  let remainingWords = [...words];
  while (remainingWords.length) {
    let rowCount = Math.ceil(remainingWords.length * 0.4);
    let row = remainingWords.splice(0, rowCount);
    rows.push(row);
  }
  return rows;
}

export default SearchComponent;