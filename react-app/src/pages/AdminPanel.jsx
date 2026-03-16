import { useState, useEffect } from "react";

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${API_URL}/admin/users`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Błąd autoryzacji");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [API_URL]);

    if (loading) return <div className="container">Ładowanie panelu władzy...</div>;

    return (
        <div className="container" style={{ marginTop: "40px", color: "#fff" }}>
            <h1 style={{ color: "#ff4444", textShadow: "0 0 10px #ff4444" }}>🛠️ Panel Administratora</h1>
            <p style={{ color: "#aaa" }}>Z wielką mocą wiąże się wielka odpowiedzialność.</p>

            <div style={{ backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "8px", marginTop: "30px" }}>
                <h2>Zarządzanie Użytkownikami ({users.length})</h2>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#222", color: "#ccc", textAlign: "left" }}>
                            <th style={{ padding: "10px" }}>ID</th>
                            <th style={{ padding: "10px" }}>Nazwa</th>
                            <th style={{ padding: "10px" }}>Email</th>
                            <th style={{ padding: "10px" }}>Rola</th>
                            <th style={{ padding: "10px" }}>Dołączył</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} style={{ borderBottom: "1px solid #333" }}>
                                <td style={{ padding: "10px", fontSize: "0.8em", color: "#666" }}>{u._id}</td>
                                <td style={{ padding: "10px", color: "#0ff" }}>{u.username}</td>
                                <td style={{ padding: "10px" }}>{u.email}</td>
                                <td style={{ padding: "10px", color: u.isAdmin ? "#ff4444" : "#fff" }}>
                                    {u.isAdmin ? "Admin" : "User"}
                                </td>
                                <td style={{ padding: "10px" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}