import { useEffect, useState } from "react";
import { getAdminDashboard, deleteGameAsAdmin, getAdminUsers, deleteUserAsAdmin } from "../api/auth.js"; 

export default function AdminPanel() {
    const [data, setData] = useState({ games: [], userCount: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- NOWE STANY DO WYSZUKIWANIA ---
    const [searchGame, setSearchGame] = useState("");
    const [searchUser, setSearchUser] = useState("");

    const loadDashboardData = async () => {
        setLoading(true);
        const [dashResult, usersResult] = await Promise.all([
            getAdminDashboard(),
            getAdminUsers()
        ]);
        
        if (!dashResult.error) {
            setData({ games: dashResult.games || [], userCount: dashResult.userCount || 0 });
        }
        if (!usersResult.error) {
            setUsers(usersResult.users || []);
        } else {
            alert("Błąd: " + (dashResult.message || usersResult.message));
        }
        setLoading(false);
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const handleDeleteGame = async (id) => {
        if (!confirm("Czy na pewno chcesz trwale usunąć tę grę?")) return;
        const result = await deleteGameAsAdmin(id);
        if (!result.error) {
            setData(prev => ({ ...prev, games: prev.games.filter(g => g._id !== id) }));
        } else {
            alert(result.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm("CZY NA PEWNO chcesz usunąć to konto użytkownika?")) return;
        const result = await deleteUserAsAdmin(id);
        if (!result.error) {
            setUsers(prev => prev.filter(u => u._id !== id));
            setData(prev => ({ ...prev, userCount: prev.userCount - 1 }));
        } else {
            alert(result.message);
        }
    };

    // --- LOGIKA FILTROWANIA DANYCH ---
    const filteredGames = data.games.filter(game => {
        const query = searchGame.toLowerCase();
        const titleMatch = game.title?.toLowerCase().includes(query);
        const authorMatch = game.author?.username?.toLowerCase().includes(query);
        return titleMatch || authorMatch;
    });

    const filteredUsers = users.filter(user => {
        const query = searchUser.toLowerCase();
        const usernameMatch = user.username?.toLowerCase().includes(query);
        const emailMatch = user.email?.toLowerCase().includes(query);
        return usernameMatch || emailMatch;
    });

    if (loading) return <div className="container" style={{color: "white"}}>Pobieranie danych panelu...</div>;

    return (
        <div className="container admin-panel" style={{ padding: "20px", color: "white" }}>
            <h1>🛡️ Panel Administratora</h1>
            
            <div style={{ backgroundColor: "#222", padding: "15px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #444" }}>
                <p style={{ fontSize: "1.2rem", margin: 0 }}>
                    👤 Zarejestrowanych użytkowników: <strong>{data.userCount}</strong>
                </p>
            </div>
            
            {/* SEKCJA GIER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h2 style={{ color: "#0ff", margin: 0 }}>🎮 Zarządzanie Grami</h2>
                <input 
                    type="text" 
                    placeholder="Szukaj gry lub autora..." 
                    value={searchGame}
                    onChange={(e) => setSearchGame(e.target.value)}
                    style={searchInputStyle}
                />
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#111", marginBottom: "40px" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #444", color: "#0ff" }}>
                        <th style={{ padding: "12px" }}>Tytuł</th>
                        <th>Autor</th>
                        <th>Wyświetlenia</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredGames.length > 0 ? (
                        filteredGames.map(game => (
                            <tr key={game._id} style={{ borderBottom: "1px solid #333" }}>
                                <td style={{ padding: "12px" }}>{game.title}</td>
                                <td>{game.author?.username || "Nieznany"}</td>
                                <td>{game.views}</td>
                                <td>
                                    <button onClick={() => handleDeleteGame(game._id)} style={btnStyle}>USUŃ</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>Brak wyników wyszukiwania.</td></tr>
                    )}
                </tbody>
            </table>

            {/* SEKCJA UŻYTKOWNIKÓW */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h2 style={{ color: "#f0f", margin: 0 }}>👥 Zarządzanie Użytkownikami</h2>
                <input 
                    type="text" 
                    placeholder="Szukaj nazwy lub emaila..." 
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    style={searchInputStyle}
                />
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#111" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #444", color: "#f0f" }}>
                        <th style={{ padding: "12px" }}>Nazwa użytkownika</th>
                        <th>Email</th>
                        <th>Rola</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <tr key={user._id} style={{ borderBottom: "1px solid #333" }}>
                                <td style={{ padding: "12px" }}>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? "⭐ Admin" : "▶️ Gracz"}</td>
                                <td>
                                    {!user.isAdmin ? (
                                        <button onClick={() => handleDeleteUser(user._id)} style={{ ...btnStyle }}>USUŃ</button>
                                    ) : (
                                        <span style={{ fontSize: "0.8rem", color: "#666" }}>Brak akcji</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>Brak wyników wyszukiwania.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// Stajle
const btnStyle = {
    backgroundColor: "#ff4444", color: "white", border: "none",
    padding: "8px 12px", borderRadius: "4px", cursor: "pointer",
    fontWeight: "bold", fontSize: "0.8rem"
};

const searchInputStyle = {
    padding: "10px",
    border: "1px solid #ff2d78",
    backgroundColor: "#222",
    color: "white",
    width: "250px",
    outline: "none"
};