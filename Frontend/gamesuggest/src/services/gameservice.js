import axios from 'axios'

const API_URL = 'http://localhost:5000/api';

// Function to fetch games list from backend
export const getGames = async () => {
    try {
        const data = await axios.get(API_URL + '/games')
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);

    }
};

// Function to fetch genres list from backend
export const getGenres = async () => {
    try {
        const data = await axios.get(API_URL + '/genres')
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);

    }
};

// Function to fetch similar games list from backend
export const getSimilarGames = async (searchQuery, startDate, endDate, genre) => {
    try {
        const response = await axios.get(API_URL + '/similar-games', {
            params: {
                query: searchQuery,
                startDate: startDate,
                endDate: endDate,
                genre: genre
            },
        });
        return response;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}