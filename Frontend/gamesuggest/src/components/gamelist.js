import React, { useState, useEffect } from 'react';
import { getGames, getSearchGames, getSimilarGames } from '../services/gameservice.js';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [similarGames, setSimilarGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await getGames()
                setGames(response.data.results);
                setLoading(false);
            } catch (error) {
                setError('Error fetching games');
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    //For searching games
    // const handleSearch = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const response = await getSearchGames({
    //             params: { query: searchQuery },
    //         })
    //         setGames(response.data.results);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error('Error searching for games:', error);
    //         setError('Error searching for games');
    //         setLoading(false);
    //     }
    // };

    const handleSearchForSimilarGames = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await getSimilarGames({
                params: { query: searchQuery },
            });
            setSimilarGames(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error searching for games:', error);
            setError('Error searching for games');
            setLoading(false);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Game List</h1>
            <form onSubmit={handleSearchForSimilarGames}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a game"
                />
                <button type="submit">Search</button>
            </form>
            <h2>Similar Games</h2>
            <ul>
                {similarGames.map((game) => (
                    <li key={game.id}>{game.name}</li>
                ))}
            </ul>
            {/* <ul>
                {games.map((game) => (
                    <li key={game.id}>{game.name}</li>
                ))}
            </ul> */}
        </div>
    );
};

export default GameList;
