import React, { useState, useCallback } from "react";
import axios from "axios";

import Banner from './Banner';
import SearchInput from './SearchInput';
import { distributeWordsToRows, WordCloud } from './WordCloud';
import RecipeResults from './RecipeResults';
import { WORD_CLOUD } from './wordList'; // Importing the WORD_CLOUD

import "./FridgeFlix.css";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWords, setSelectedWords] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const handleWordClick = useCallback(
    (word) => {
      if (selectedWords.includes(word)) {
        setSelectedWords((prevWords) => prevWords.filter((w) => w !== word));
      } else {
        setSelectedWords((prevWords) => [...prevWords, word]);
      }
      setSearchTerm((prevTerm) => `${prevTerm} ${word} `);
    },
    [selectedWords]
  );

  const handleSearch = useCallback(async () => {
    try {
      const response = await axios.post("http://localhost:9000/search", { searchTerm });
      setRecipes(response.data.metaphorResults);
    } catch (error) {
      console.error("Error making API call:", error);
    }
  }, [searchTerm]);

  const wordRows = distributeWordsToRows(WORD_CLOUD);

  return (
    <div className="container">
      <Banner />
      <SearchInput value={searchTerm} onSearch={handleSearch} onChange={setSearchTerm} />
      <WordCloud words={wordRows} selectedWords={selectedWords} onClick={handleWordClick} />
      <RecipeResults recipes={recipes} />
    </div>
  );
};

export default SearchComponent;
