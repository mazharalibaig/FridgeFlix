import React, { useState, useCallback } from "react";
import axios from "axios";
import { InputAdornment, TextField, IconButton, Chip, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./FridgeFlix.css";

const WORD_CLOUD = [
  "chicken",
  "rice",
  "potatoes",
  "onions",
  "bell peppers",
  "beef",
  "broccoli",
  "bread",
  "milk",
  "eggs",
  "cheese",
  "lettuce",
  "tomatoes",
  "butter",
  "garlic",
];

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWords, setSelectedWords] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleWordClick = useCallback((word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords((prevWords) => prevWords.filter((w) => w !== word));
    } else {
      setSelectedWords((prevWords) => [...prevWords, word]);
    }
    setSearchTerm((prevTerm) => `${prevTerm} ${word} `);
  }, [selectedWords]);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:9000/search", { searchTerm });
      setRecipes(response.data.metaphorResults);
    } catch (error) {
      console.error("Error making API call:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const wordRows = distributeWordsToRows(WORD_CLOUD);

  return (
    <div className="container">
      <Banner />
      <SearchInput
        value={searchTerm}
        onSearch={handleSearch}
        onChange={setSearchTerm}
        loading={loading}
      />
      <WordCloud
        words={wordRows}
        selectedWords={selectedWords}
        onClick={handleWordClick}
      />
      <RecipeResults recipes={recipes} />
    </div>
  );
};

const Banner = () => (
  <div className="banner">
    FridgeFlix<span className="trademark-symbol">®</span>
  </div>
);

const SearchInput = ({ value, onSearch, onChange, loading }) => (
  <div style={{ position: 'relative' }}>
    <TextField
      className="search-bar"
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onSearch} disabled={loading}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    {loading && <CircularProgress size={24} style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
  </div>
);

const WordCloud = ({ words, selectedWords, onClick }) => (
  <div className="word-cloud">
    {words.map((row, rowIndex) => (
      <div key={rowIndex} className="word-row">
        {row.map((word) => (
          <Chip
            key={word}
            label={word}
            onClick={() => onClick(word)}
            variant="outlined"
            className={selectedWords.includes(word) ? "word-chip-selected" : "word-chip"}
          />
        ))}
      </div>
    ))}
  </div>
);

const RecipeResults = ({ recipes }) => {
  const [selectedDish, setSelectedDish] = useState(null);

  return (
    <div className="recipe-results">
      {recipes.map((recipe, index) => {
        const dishName = Object.keys(recipe)[0];
        const links = recipe[dishName];
        return (
          <div key={index} className="recipe-item">
            <h3 className="recipe-title" onClick={() => setSelectedDish(dishName === selectedDish ? null : dishName)}>
              {dishName}
            </h3>
            {selectedDish === dishName && (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {new URL(link).hostname}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

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
