import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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

    //Najpierw filtrujemy gry po tytule, a potem sortujemy po wyświetleniach
    const filteredAndSortedGames = games
        .filter(game => 
            game.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => (b.views || 0) - (a.views || 0));

    if (loading) return <div className="container"><p>Ładowanie gier...</p></div>;

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>
                <h1>Najpopularniejsze gry</h1>
                
                {/* 3. Pole wyszukiwania */}
                <input 
                    type="text" 
                    placeholder="Wyszukaj tytuł gry..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: "10px 15px",
                        border: "1px solid #ff2d78",
                        backgroundColor: "#1a1a1a",
                        color: "white",
                        width: "100%",
                        maxWidth: "300px",
                        outline: "none"
                    }}
                />
            </div>

            <div className="game-list">
                {filteredAndSortedGames.length > 0 ? (
                    filteredAndSortedGames.map(game => (
                        <GameCard key={game._id} game={game} />
                    ))
                ) : (
                    <p style={{ color: "#888" }}>
                        {searchQuery ? `Nie znaleziono gry pasującej do "${searchQuery}"` : "Obecnie nie mamy żadnych gier."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;