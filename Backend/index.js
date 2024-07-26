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

// Endpoint to get a list of game genres
app.get('/genres', async (req, res) => {
  try {
    const response = await axios.get('https://api.rawg.io/api/genres', {
      params: {
        key: RAWG_API_KEY
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

app.get('/similar-games', async (req, res) => {
  const { query, startDate, endDate, genres } = req.query;
  try {
    const response = await axios.get(`https://api.rawg.io/api/games`, {
      params: {
        key: RAWG_API_KEY,
        search: query,
      },
    });

    const gameDetails = response.data.results[0]

    if (!gameDetails) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Extract relevant genres and tags
    const genres = gameDetails.genres.map(genre => genre.slug).join(',');
    const tags = gameDetails.tags.map(tag => tag.slug).sort().join(',');

    console.log(genres)
    console.log(tags)

    if (response.data.results.length > 0) {
      const selectedGenre = genres || response.data.results[0].genres[0].slug;
      console.log(genres)
      console.log(selectedGenre)
      const similarGamesResponse = await axios.get(`https://api.rawg.io/api/games`, {
        params: {
          key: RAWG_API_KEY,
          tags,
          genres: selectedGenre,
          ordering: '-rating',
          dates: `${startDate},${endDate}`
        },
      });
      const results = similarGamesResponse.data.results;
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