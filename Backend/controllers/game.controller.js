require('dotenv').config()
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const axios = require('axios')

const getGames = async (req, res) => {
    const { query } = req.query
    try {
        const response = await axios.get('https://api.rawg.io/api/games', {
            params: {
                key: RAWG_API_KEY,
                search: query
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Error fetching games' });
    }
}

const getGameGenres = async (req, res) => {
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
}

const getSimilarGames = async (req, res) => {
    const { query, startDate, endDate, genre } = req.query;
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

        const tags = gameDetails.tags.map(tag => tag.slug).sort().join(',');

        if (response.data.results.length > 0) {
            const selectedGenre = genre || response.data.results[0].genres[0].slug;
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
}

module.exports = { getGames, getGameGenres, getSimilarGames }