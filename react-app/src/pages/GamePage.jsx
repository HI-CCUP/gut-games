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
        // Licznik wyświetleń - wywoływany tylko raz przy wejściu
        if (!countedRef.current) {
            fetch(`${API_URL}/games/${id}/view`, { method: "POST" })
                .catch(err => console.error("Błąd licznika wyświetleń:", err));
            countedRef.current = true;
        }

        // Pobieranie danych gry (pamiętaj o .populate('author') na backendzie!)
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

    if (loading) return <div className="container" style={{color: "white"}}>Ładowanie gry...</div>;
    if (!game) return <div className="container" style={{color: "white"}}>Nie znaleziono gry.</div>;

    const isWebGame = game.gameUrl?.endsWith(".html") || game.gameUrl?.endsWith(".js");

    return (
        <div className="container game-page" style={{ color: "white" }}>
            <h1>{game.title}</h1>
            
            {/* Wyświetlanie Autora - dodano kolor neon-cyan (#0ff) */}
            <p style={{ color: "#888", marginBottom: "20px", fontSize: "1.1rem" }}>
                Autor: <span style={{ fontWeight: "bold", color: "#0ff" }}>
                    {game.author?.username || "Anonimowy twórca"}
                </span>
            </p>

            <p style={{ lineHeight: "1.6", marginBottom: "30px" }}>{game.description}</p>

            <div className="game-display-area" style={{ 
                width: "100%", 
                minHeight: "500px", 
                backgroundColor: "#111", 
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid #333",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)"
            }}>
                {isWebGame ? (
                    <iframe
                        src={game.gameUrl}
                        title={game.title}
                        style={{ width: "100%", height: "600px", border: "none" }}
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <div style={{ fontSize: "50px", marginBottom: "10px" }}>💾</div>
                        <h3>Ta gra wymaga pobrania</h3>
                        <p style={{ color: "#aaa" }}>Format pliku nie jest obsługiwany bezpośrednio w przeglądarce.</p>
                        <a 
                            href={game.gameUrl} 
                            download 
                            className="download-button"
                            style={{
                                display: "inline-block",
                                padding: "14px 28px",
                                backgroundColor: "#0ff",
                                color: "#000",
                                textDecoration: "none",
                                fontWeight: "bold",
                                borderRadius: "6px",
                                marginTop: "20px",
                                transition: "0.3s"
                            }}
                        >
                            POBIERZ GRĘ
                        </a>
                    </div>
                )}
            </div>

            <hr style={{ margin: "50px 0", borderColor: "#222" }} />

            <section className="comments-section">
                <div className="game-stats" style={{ marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "1.5rem" }}>
                        Średnia ocena: {game.ratingAvg ? game.ratingAvg.toFixed(1) : "0.0"}/5.0
                    </h2>
                </div>
                
                {/* Przekazujemy ID gry do komponentu komentarzy */}
                <Comments gameId={id} />
            </section>
        </div>
    );
}