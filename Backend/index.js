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

app.get('/genres', async (req, res) => {
    try {
        const response = await axios.get('https://api.rawg.io/api/genres', {
            params: {
                key: RAWG_API_KEY,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ error: 'Error fetching genres' });
    }
});


app.listen(5000, () => {
    console.log("Server is running!")
})