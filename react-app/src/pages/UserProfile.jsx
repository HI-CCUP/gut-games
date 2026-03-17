import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function UserProfile() {
    const { user: authUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Musisz być zalogowany");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/users/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Nie udało się pobrać danych profilu");

                const data = await res.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [API_URL]);

    // --- NOWA FUNKCJA USUWANIA ---
    const handleDeleteGame = async (e, gameId) => {
        e.preventDefault(); // Blokuje przejście do linku z gry
        e.stopPropagation(); // Zatrzymuje "bąbelkowanie" zdarzenia

        if (!confirm("Czy na pewno chcesz usunąć tę grę? Tej operacji nie można cofnąć.")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/games/${gameId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Błąd podczas usuwania gry");
            }

            // Aktualizujemy stan lokalny (usuwamy grę z widoku bez odświeżania strony)
            setProfileData(prev => ({
                ...prev,
                games: prev.games.filter(g => g._id !== gameId)
            }));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="container">Ładowanie profilu...</div>;
    if (error) return <div className="container" style={{ color: "red" }}>{error}</div>;

    const { user, games } = profileData;

    return (
        <div className="container" style={{ color: "#fff", marginTop: "40px" }}>
            <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
                <h1>Mój Profil</h1>
                <hr style={{ borderColor: "#333", margin: "20px 0" }} />
                
                <div style={{ display: "grid", gap: "10px", fontSize: "1.1em" }}>
                    <p><strong>Nazwa użytkownika:</strong> <span style={{ color: "#0ff" }}>{user.username}</span></p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Konto założone:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <h2 style={{ marginTop: "40px" }}>Moje Gry ({games.length})</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
                {games.length > 0 ? (
                    games.map(game => (
                        <Link to={`/game/${game._id}`} key={game._id} style={{ textDecoration: "none", color: "inherit" }}>
                            <div style={{ 
                                backgroundColor: "#222", 
                                padding: "15px", 
                                borderRadius: "8px", 
                                border: "1px solid #444",
                                transition: "transform 0.2s",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div>
                                    <h3 style={{ marginTop: 0 }}>{game.title}</h3>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9em", color: "#ccc", marginBottom: "15px" }}>
                                        <span>★ {game.ratingAvg?.toFixed(1) || "0.0"}</span>
                                        <span>👁 {game.views || 0}</span>
                                    </div>
                                </div>
                                
                                {/* Przycisk usuwania na dole karty */}
                                <button 
                                    onClick={(e) => handleDeleteGame(e, game._id)}
                                    style={{
                                        backgroundColor: "#ff4444",
                                        color: "white",
                                        border: "none",
                                        padding: "8px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        width: "100%"
                                    }}
                                >
                                    Usuń grę
                                </button>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p style={{ color: "#666" }}>Nie dodałeś jeszcze żadnej gry.</p>
                )}
            </div>
        </div>
    );
}