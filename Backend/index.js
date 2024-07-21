const express = require('express');
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

// Define CORS options
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json())

const RAWG_API_KEY = process.env.RAWG_API_KEY;

// Endpoint to get a list of games
app.get('/games', async (req, res) => {
    try {
        const response = await axios.get('https://api.rawg.io/api/games', {
            params: {
                key: RAWG_API_KEY,
            },
        });
        // Extract names from the response
        //const gameNames = response.data.results.map(game => game.name);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Error fetching games' });
    }
});

// Endpoint to get a list of games
app.get('/search', async (req, res) => {
    const { query } = req.query
    try {
        const response = await axios.get('https://api.rawg.io/api/games', {
            params: {
                key: RAWG_API_KEY,
                search: query
            },
        });
        // Extract names from the response
        //const gameNames = response.data.results.map(game => game.name);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Error fetching games' });
    }
});

app.get('/similar-games', async (req, res) => {
    const { query } = req.query;
    try {
      const response = await axios.get(`https://api.rawg.io/api/games`, {
        params: {
          key: RAWG_API_KEY,
          search: query,
        },
      });
      
      if (response.data.results.length > 0) {
        const genre = response.data.results[0].genres[0].slug;
        const similarGamesResponse = await axios.get(`https://api.rawg.io/api/games`, {
          params: {
            key: RAWG_API_KEY,
            genres: genre,
          },
        });
          const results = similarGamesResponse.data.results;
          //  const games = results.forEach((game, index) => {
          //   console.log(`Game ${index + 1} - ${game.name} Ratings:`);
          //   console.log(game.rating > 4 ? game.rating : "");
          //  });
          // console.log(res.json(games))
        res.json(results);
      } else {
        res.status(404).json({ error: 'Game not found' });
      }
    } catch (error) {
      console.error('Error fetching similar games:', error);
      res.status(500).json({ error: 'Error fetching similar games' });
    }
  });

app.listen(5000, () => {
    console.log("Server is running!")
})