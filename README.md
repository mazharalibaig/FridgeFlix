# FridgeFlix 🍅🍚

Link: https://fridgeflix.web.app/

**Ever found yourself gazing into your fridge, unsure of what dishes you could create from the ingredients inside?** Look no further! **FridgeFlix** is here to inspire your culinary adventures. FridgeFlix recommends you dishes from your choice of ingredients!

Utilizing the power of OpenAI and Metaphor APIs, FridgeFlix provides you with suggestions based on your ingredients and points you towards the best recipes from renowned culinary websites. Dive into your next cooking session with confidence and zest!

## 🌟 Features

- **Ingredient Word Cloud**: A visually appealing list of common ingredients for easy selection.
- **Dish Suggestions**: Get dish ideas based on your ingredient choices.
- **Top Recipes**: For each suggested dish, gain access to tried-and-true recipes from the web's top culinary sources.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- Package manager: [npm](https://www.npmjs.com/) (comes with Node.js)

## 🛠 Setup and Installation

1. **Install dependencies**:
    ```bash
    cd fridgeflix-frontend
    npm install
    ```

    ```bash
    cd fridgeflix-backend
    npm install
    ```

2. **Setup environment variables**: If the project requires API keys or other environment-specific settings, make sure to set them up. Create a `.env` file in the backend folder root and populate it with required variables:
    ```env
    OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
    METAPHOR_API_KEY=YOUR_METAPHOR_KEY_HERE
    ```

   > Note: Ensure that you have the required API keys and credentials for OpenAI and Metaphor APIs.

3. **Change ngrok endpoint to localhost**:
   In the app.js file, change the endpoint that axios makes a call to `http://localhost:9000/` to interact with your locally hosted node.js server. 

3. **Start the development server**:

    ```bash
    cd fridgeflix-frontend
    npm start
    ```

    ```bash
    cd fridgeflix-backend
    npm start
    ```

    This will start the local development server, and the app should be accessible at `http://localhost:3000/` and `http://localhost:9000/`.

5. **Building for production**:
   If you wish to build the project for production deployment:
   ```bash
   cd fridgeflix-frontend
   npm run build
   ```
