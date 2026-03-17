import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import Comments from "../components/Comment";

export default function GamePage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const countedRef = useRef(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        if (!countedRef.current) {
            fetch(`${API_URL}/games/${id}/view`, { method: "POST" })
                .catch(err => console.error("Błąd licznika wyświetleń:", err));
            countedRef.current = true;
        }

        fetch(`${API_URL}/games/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Nie udało się pobrać gry");
                return res.json();
            })
            .then(data => {
                setGame(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Błąd pobierania gry:", err);
                setLoading(false);
            });
    }, [id, API_URL]);

    if (loading) return <div className="container">Ładowanie gry...</div>;
    if (!game) return <div className="container">Nie znaleziono gry.</div>;

    const isWebGame = game.gameUrl.endsWith(".html") || game.gameUrl.endsWith(".js");

    

    return (
        <div className="container game-page">
            <h1>{game.title}</h1>
            <p>{game.description}</p>

            <div className="game-display-area" style={{ 
                width: "100%", 
                minHeight: "500px", 
                backgroundColor: "#111", 
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid #333"
            }}>
                {isWebGame ? (
                    //jesli w hml/js
                    <iframe
                        src={game.gameUrl}
                        title={game.title}
                        style={{ width: "100%", height: "600px", border: "none" }}
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : (
                    //inny format - plik do pobrania
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <div style={{ fontSize: "50px", marginBottom: "20px" }}><p>Pobierz</p></div>
                        <h3>Ta gra wymaga pobrania</h3>
                        <p>Format pliku nie jest obsługiwany bezpośrednio w przeglądarce.</p>
                        <a 
                            href={game.gameUrl} 
                            download 
                            className="download-button"
                            style={{
                                display: "inline-block",
                                padding: "12px 24px",
                                backgroundColor: "#0ff",
                                color: "#000",
                                textDecoration: "none",
                                fontWeight: "bold",
                                borderRadius: "4px",
                                marginTop: "20px"
                            }}
                        >
                            POBIERZ GRĘ
                        </a>
                    </div>
                )}
            </div>

            <hr style={{ margin: "40px 0", borderColor: "#333" }} />


            <section className="comments-section">
                <div className="game-stats">
                    <h2>Średnia ocena: {game.ratingAvg ? game.ratingAvg : "0.0"}/5.0</h2>
                </div>
                <Comments gameId={id} />
            </section>
        </div>
    );
}