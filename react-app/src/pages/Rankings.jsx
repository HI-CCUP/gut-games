import { useState, useEffect } from "react";

const Rankings = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        fetch(`${API_URL}/users/rankings`)
            .then(res => res.json())
            .then(data => {
                setRankings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Błąd pobierania rankingu:", err);
                setLoading(false);
            });
    }, [API_URL]);

    if (loading) return <div className="container">Ładowanie tabeli liderów...</div>;

    return (
        <div className="container" style={{ color: "#fff", marginTop: "40px" }}>
            <h1>
                🏆 Najbardziej Aktywni Użytkownicy
            </h1>
            <p style={{ textAlign: "center", color: "#888", marginBottom: "30px" }}>
                Legendarne postacie, które wzbogaciły naszą bazę o najwięcej tytułów.
            </p>

            <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#1a1a1a", borderRadius: "12px", border: "1px solid #333", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#222", color: "#ccc" }}>
                            <th style={{ padding: "15px", textAlign: "left" }}>Miejsce</th>
                            <th style={{ padding: "15px", textAlign: "left" }}>Użytkownik</th>
                            <th style={{ padding: "15px", textAlign: "right" }}>Dodane gry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map((user, index) => (
                            <tr key={user._id} style={{ borderBottom: "1px solid #333", transition: "0.3s" }} className="ranking-row">
                                <td style={{ padding: "15px", fontWeight: "bold" }}>
                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                                </td>
                                <td style={{ padding: "15px", color: index < 3 ? "rgb(255, 30, 0)" : "#fff" }}>
                                    {user.username}
                                </td>
                                <td style={{ padding: "15px", textAlign: "right", fontWeight: "bold" }}>
                                    {user.gamesAdded}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {rankings.length === 0 && (
                <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
                    Brak danych do wyświetlenia. Bądź pierwszy i dodaj grę!
                </p>
            )}
        </div>
    );
};

export default Rankings;