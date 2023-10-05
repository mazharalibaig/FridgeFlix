import React from 'react';

const RecipeResults = ({ recipes }) => {
  return (
    <div className="recipe-results">
      {recipes.map((recipe, index) => {
        const dishName = Object.keys(recipe)[0];
        const links = recipe[dishName];
        return (
          <div key={index} className="recipe-item">
            <h3 className="recipe-title">{dishName}</h3>
            <ul>
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
};

export default RecipeResults;