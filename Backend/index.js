const express = require('express');
const app = express()
const cors = require('cors') 
const axios = require('axios')

// Define CORS options
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  };

// Middleware
app.use(cors(corsOptions));
app.use(express.json())

const BASE_URL = "https://www.freetogame.com/api"

//Helper function for the api
const fetchFromAPI = async (endpoint) => {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error.message);
        throw error;
    }
}

// Route to fetch all games
app.get('/games', async (req, res) => {
    try {
        const games = await fetchFromAPI('/games');
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving games' });
    }
});

// Route to fetch a single game
app.get('/game', async (req, res) => {
    const { id } = req.query
    try {
        const game = await fetchFromAPI(`/game?id=${id}`)
        res.status(200).json(game)
    } catch (error) {
        res.status(500).json({error: 'Error retrieving game'})
    }
})

// Get games as per the category
app.get('/games/category', async (req, res) => {
    const { category } = req.query;
    try {
        const games = await fetchFromAPI(`/games?category=${category}`);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving games by category' });
    }
});

app.listen(5000, () => {
    console.log("Server is running!")
})