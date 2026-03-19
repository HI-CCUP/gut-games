import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import Comments from "../components/Comment";

export default function GamePage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const countedRef = useRef(false);

    // Referencja do kontenera, który ma zostać powiększony
    const gameContainerRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        // Licznik wyświetleń - wywoływany tylko raz przy wejściu
        if (!countedRef.current) {
            fetch(`${API_URL}/games/${id}/view`, { method: "POST" })
                .catch(err => console.error("Błąd licznika wyświetleń:", err));
            countedRef.current = true;
        }

        // Pobieranie danych gry
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

    // Funkcja obsługująca przełączanie na pełny ekran
    const handleFullscreen = () => {
        const element = gameContainerRef.current;
        if (!element) return;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari/Chrome */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        }
    };

    if (loading) return <div className="container" style={{color: "white", padding: "20px"}}>Ładowanie gry...</div>;
    if (!game) return <div className="container" style={{color: "white", padding: "20px"}}>Nie znaleziono gry.</div>;

    const isWebGame = game.gameUrl?.endsWith(".html") || game.gameUrl?.endsWith(".js");

    return (
        <div className="container game-page" style={{ color: "white", padding: "20px" }}>
            <h1>{game.title}</h1>
            
            <p style={{ color: "#888", marginBottom: "20px", fontSize: "1.1rem" }}>
                Autor: <span style={{ fontWeight: "bold", color: "#0ff" }}>
                    {game.author?.username || "Anonimowy twórca"}
                </span>
            </p>

            <p style={{ lineHeight: "1.6", marginBottom: "30px" }}>{game.description}</p>

            {/* Przycisk Fullscreen - widoczny tylko dla gier przeglądarkowych */}
            {isWebGame && (
                <div style={{ marginBottom: "15px", display: "flex", justifyContent: "flex-end" }}>
                    <button 
                        onClick={handleFullscreen}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "transparent",
                            color: "rgba(255, 45, 120, 0.7)",
                            border: "2px solid rgba(255, 45, 120, 0.7)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "rgba(255, 45, 120, 0.7)";
                            e.target.style.color = "#000";
                            e.target.style.boxShadow = "0 0 15px rgba(255, 45, 120, 0.7)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "rgba(255, 45, 120, 0.7)";
                            e.target.style.boxShadow = "none";
                        }}
                    >
                        <span>⛶</span> Pełny ekran
                    </button>
                </div>
            )}

            {/* Główny obszar wyświetlania gry */}
            <div 
                ref={gameContainerRef} 
                className="game-display-area" 
                style={{ 
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
                    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                    position: "relative"
                }}
            >
                {isWebGame ? (
                    <iframe
                        src={game.gameUrl}
                        title={game.title}
                        style={{ width: "100%", height: "650px", border: "none" }}
                        allowFullScreen
                        sandbox="allow-scripts allow-same-origin"
                    />
                ) : (
                    <div style={{ textAlign: "center", padding: "60px" }}>
                        <div style={{ fontSize: "60px", marginBottom: "20px" }}>💾</div>
                        <h3>Ta gra wymaga pobrania</h3>
                        <p style={{ color: "#aaa", marginBottom: "30px" }}>
                            Format pliku nie jest obsługiwany bezpośrednio w przeglądarce.
                        </p>
                        <a 
                            href={game.gameUrl} 
                            download 
                            className="download-button"
                            style={{
                                display: "inline-block",
                                padding: "16px 32px",
                                backgroundColor: "#0ff",
                                color: "#000",
                                textDecoration: "none",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                transition: "0.3s",
                                boxShadow: "0 4px 15px rgba(0, 255, 255, 0.3)"
                            }}
                        >
                            POBIERZ PLIK GRY
                        </a>
                    </div>
                )}
            </div>

            <hr style={{ margin: "50px 0", borderColor: "#222" }} />

            <section className="comments-section">
                <div className="game-stats" style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "1.8rem" }}>
                        Średnia ocena: <span style={{ color: "#ffd700" }}>
                            {game.ratingAvg ? game.ratingAvg.toFixed(1) : "0.0"}
                        </span> / 5.0
                    </h2>
                </div>
                
                {/* Przekazujemy ID gry do komponentu komentarzy */}
                <Comments gameId={id} />
            </section>
        </div>
    );
}