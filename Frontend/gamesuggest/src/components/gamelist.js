import React, { useState, useEffect } from 'react';
import { getGames, getSimilarGames } from '../services/gameservice.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [similarGames, setSimilarGames] = useState([]);
    const [isSearchComplete, setIsSearchComplete] = useState(false);

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
        setIsSearchComplete(false);
        try {
            const response = await getSimilarGames({
                params: { query: searchQuery },
            });
            setSimilarGames(response.data);
            setIsSearchComplete(true);
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
        <div class='container'>
            <h1>Game Suggest</h1>
            <form onSubmit={handleSearchForSimilarGames}>
                <input
                    type="text"
                    value={searchQuery}
                    class="form__field"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find your next adventure"
                />
                <button type="submit" class='btn btn--primary btn--inside uppercase'>Search</button>
            </form>
            {isSearchComplete && similarGames.length > 0 && (
                <>
                    <h2>Similar Games</h2>
                    <div className="row">
                        {similarGames.map((game) => (
                            <div key={game.id} className="col-md-4">
                                <Card style={{ margin: '10px' }}>
                                    <Card.Img variant="top" class="game-image" src={game.background_image} alt={game.name} />
                                    <Card.Body>
                                        <Card.Title>{game.name}</Card.Title>
                                        <Card.Text>{game.description}</Card.Text>
                                        <Button variant="primary">View Details</Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameList;
