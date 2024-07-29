import React, { useState, useEffect } from 'react';
import { getGames, getSimilarGames,getGenres } from '../services/gameservice.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfAlt, } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons'


const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [similarGames, setSimilarGames] = useState([]);
    const [isSearchComplete, setIsSearchComplete] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [genres, setGenres] = useState('')
    const [selectGenre, setSelectGenre] = useState('')

    useEffect(() => {
        // To fetch the list of games
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

        const fetchGenres = async () => {
            try {
                const response = await getGenres()
                setGenres(response.data.results);
            } catch (error) {
                console.error('Error fetching genres:', error);
                setError('Error fetching genres');
            }
        };

        fetchGenres()
        fetchGames();
    }, []);

   
    // To get similar games as per search term or genre
    const handleSearchForSimilarGames = async (e) => {
        e.preventDefault();
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const end = endDate || today;
        const start = startDate || '2001-01-01'
        setIsSearchComplete(false);
        try {
            const response = await getSimilarGames(searchQuery, start, end, selectGenre);
            const filteredSimilarGames = response.data.filter(game => !game.genres.some(genre => genre.name.toLowerCase() === 'adult'));
            setSimilarGames(filteredSimilarGames);
            setIsSearchComplete(true);
            setLoading(false);
        } catch (error) {
            console.error('Error searching for games:', error);
            setError('Error searching for games');
            setLoading(false);
        }
    };

    // To generate stars as per the game rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {Array(fullStars).fill(<FontAwesomeIcon icon={faStar} className="star-icon" />)}
                {hasHalfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="star-icon" />}
                {Array(emptyStars).fill(<FontAwesomeIcon icon={faStarEmpty} className="star-icon" />)}
            </>
        );
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div class='container'>
            <h1>Game Finder</h1>
            <form onSubmit={handleSearchForSimilarGames}>
                <input
                    type="text"
                    value={searchQuery}
                    class="form__field"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find your next adventure"
                />
                <button type="submit" class='btn btn--primary btn--inside uppercase'>Search</button>
                <div>
                    <input
                        type="date"
                        value={startDate}
                        class="form__field date"
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        value={endDate}
                        class="form__field date"
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                    />
                    <select
                        value={selectGenre}
                        onChange={(e) => setSelectGenre(e.target.value)}
                        className="form__field"
                    >
                        <option value="">Select Genre</option>
                        {genres && genres.map((genre) => (
                            <option key={genre.id} value={genre.slug}>{genre.name}</option>
                        ))}
                    </select>
                </div>

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
                                        <Card.Text>{renderStars(game.rating)}</Card.Text>
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
