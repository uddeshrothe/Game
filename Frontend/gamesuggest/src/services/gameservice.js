import axios from 'axios'

const API_URL = 'http://localhost:5000';

export const getGames = async () => {
    try {
        const data = await axios.get(API_URL + '/games')
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);

    }
};

export const getGenres = async () => {
    try {
        const data = await axios.get(API_URL + '/genres')
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);

    }
};

export const getSimilarGames = async (searchQuery, startDate, endDate, genres) => {
    try {
        const response = await axios.get(API_URL + '/similar-games', {
            params: {
                query: searchQuery,
                startDate: startDate,
                endDate: endDate,
                genres: genres
            },
        });
        return response;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}