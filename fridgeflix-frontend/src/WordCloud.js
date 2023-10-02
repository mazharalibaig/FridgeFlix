import React from 'react';
import { Chip } from "@mui/material";

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
            className={
              selectedWords.includes(word) ? "word-chip-selected" : "word-chip"
            }
          />
        ))}
      </div>
    ))}
  </div>
);

export { distributeWordsToRows, WordCloud };
