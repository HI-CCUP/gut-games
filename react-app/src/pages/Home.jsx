import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dynamiczny adres API: 
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        fetch(`${API_URL}/games`) 
            .then(res => {
                if (!res.ok) throw new Error("Błąd pobierania danych");
                return res.json();
            })
            .then(data => {
                setGames(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd:", err);
                setLoading(false);
            });
    }, [API_URL]);

    // Sortowanie
    const sortedGames = [...games].sort((a, b) => (b.views || 0) - (a.views || 0));

    if (loading) return <div className="container"><p>Ładowanie gier...</p></div>;

    return (
        <div className="container">
            <h1>Najpopularniejsze gry</h1>
            <div className="game-list">
                {sortedGames.length > 0 ? (
                    sortedGames.map(game => (
                        <GameCard key={game._id} game={game} />
                    ))
                ) : (
                    <p>Obecnie nie mamy żadnych gier. Dodaj coś!</p>
                )}
            </div>
        </div>
    );
};

export default Home;