import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function UserProfile() {
    const { user: authUser } = useAuth(); // Dane z kontekstu (opcjonalne)
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
                        <Link to={`/game/${game._id}`} key={game._id} style={{ textDecoration: "none" }}>
                            <div style={{ 
                                backgroundColor: "#222", 
                                padding: "15px", 
                                borderRadius: "8px", 
                                border: "1px solid #444",
                                transition: "transform 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <h3>{game.title}</h3>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9em", color: "#ccc" }}>
                                    <span>★ {game.ratingAvg?.toFixed(1) || "0.0"}</span>
                                    <span>👁 {game.views || 0}</span>
                                </div>
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