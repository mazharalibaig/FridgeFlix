import React, { useState } from 'react';

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
              <ul>
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

export default RecipeResults;
