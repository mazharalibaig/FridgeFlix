import React from "react";
import { Chip } from "@mui/material";

const WordCloud = ({
  words,
  selectedWords,
  onClick,
  header,
  chipClass,
  selectedChipClass,
  headerClass,
  onCustomInputChange,
  customInputValue,
}) => (
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
              selectedWords.includes(word) ? selectedChipClass : chipClass
            }
          />
        ))}
      </div>
    ))}
    {header === "Spices" && (
      <input
        className="custom-ingredient-input"
        value={customInputValue || ""}
        placeholder={`Enter Items not found above as "Squash Venison Fenugreek"`}
        onChange={(e) => onCustomInputChange(e.target.value)}
      />
    )}
  </div>
);

export default WordCloud;