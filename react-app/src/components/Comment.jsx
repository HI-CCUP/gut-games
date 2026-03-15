import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Comments({ gameId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5); // Nowy stan dla oceny w formularzu
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    // 1. Pobieranie komentarzy
    useEffect(() => {
        fetch(`${API_URL}/games/${gameId}/comments`)
            .then((res) => {
                if (!res.ok) throw new Error("Błąd sieci");
                return res.json();
            })
            .then((data) => {
                setComments(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd pobierania komentarzy:", err);
                setLoading(false);
            });
    }, [gameId, API_URL]);

    // 2. Obsługa wysyłania nowego komentarza
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Musisz być zalogowany, aby dodać komentarz.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/games/${gameId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                // Wysyłamy treść ORAZ ocenę wybraną w formularzu
                body: JSON.stringify({ content: newComment, rating: rating }),
            });

            const data = await response.json();

            if (response.ok) {
                // Dodajemy nowy komentarz na górę listy
                const savedComment = data.comment || data;
                setComments([savedComment, ...comments]);
                setNewComment(""); 
                setRating(5); // Reset gwiazdek do domyślnych
            } else {
                alert(data.message || "Błąd podczas dodawania komentarza.");
            }
        } catch (err) {
            console.error("Błąd sieci:", err);
            alert("Nie udało się połączyć z serwerem.");
        }
    };

    if (loading) return <p style={{ color: "#fff" }}>Ładowanie komentarzy...</p>;

    return (
        <div className="comments-container" style={{ marginTop: "30px", color: "#fff" }}>
            <h3>Komentarze ({comments.length})</h3>

            {user ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: "20px", backgroundColor: "#1a1a1a", padding: "15px", borderRadius: "8px" }}>
                    
                    {/* SEKCJA WYBORU GWIAZDEK W FORMULARZU */}
                    <div style={{ marginBottom: "10px" }}>
                        <span style={{ marginRight: "10px" }}>Twoja ocena:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                                key={star} 
                                onClick={() => setRating(star)} 
                                style={{ 
                                    cursor: "pointer", 
                                    fontSize: "20px", 
                                    color: star <= rating ? "#ffd700" : "#444" 
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Napisz, co sądzisz o tej grze..."
                        rows="3"
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#222",
                            color: "#fff",
                            border: "1px solid #444",
                            borderRadius: "4px",
                            marginBottom: "10px",
                            resize: "vertical"
                        }}
                        required
                    />
                    <button 
                        type="submit"
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#0ff",
                            color: "#000",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Dodaj opinię
                    </button>
                </form>
            ) : (
                <p style={{ color: "#aaa", fontStyle: "italic", marginBottom: "20px" }}>
                    Zaloguj się, aby dodać komentarz.
                </p>
            )}

            {/* LISTA KOMENTARZY */}
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p style={{ color: "#666" }}>Brak komentarzy. Bądź pierwszy!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment-card" style={{ 
                            padding: "15px", 
                            borderBottom: "1px solid #333",
                            backgroundColor: "rgba(255,255,255,0.02)",
                            marginBottom: "10px",
                            borderRadius: "4px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <strong style={{ color: "#0ff" }}>{comment.user?.username || "Anonim"}</strong>
                                <span style={{ color: "#666", fontSize: "0.8em" }}>
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* GWIAZDKI POBRANE DLA KONKRETNEGO KOMENTARZA */}
                            <div style={{ color: "#ffd700", margin: "5px 0" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>
                                        {star <= (comment.rating || 0) ? "★" : "☆"}
                                    </span>
                                ))}
                                <span style={{ marginLeft: "8px", fontSize: "0.8em", color: "#666" }}>
                                    ({comment.rating || 0}/5)
                                </span>
                            </div>

                            <p style={{ margin: "10px 0 0 0", lineHeight: "1.4" }}>{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}