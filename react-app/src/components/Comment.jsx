import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// 1. IMPORTUJEMY FUNKCJĘ Z TWOJEGO PLIKU API
import { deleteCommentAsAdmin } from "../api/auth"; 

export default function Comments({ gameId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); 

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        fetch(`${API_URL}/games/${gameId}/comments`)
            .then((res) => res.json())
            .then((data) => {
                setComments(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd pobierania komentarzy:", err);
                setLoading(false);
            });
    }, [gameId, API_URL]);

    // --- POPRAWIONA FUNKCJA USUWANIA ---
    const handleDeleteComment = async (commentId) => {
        if (!confirm("Czy na pewno chcesz usunąć ten komentarz jako administrator?")) return;

        // 2. KORZYSTAMY Z FUNKCJI Z API
        const result = await deleteCommentAsAdmin(commentId);

        if (!result.error) {
            // Sukces: usuwamy z widoku
            setComments(prev => prev.filter(c => c._id !== commentId));
        } else {
            // Błąd: wyświetlamy komunikat
            alert(result.message || "Błąd podczas usuwania.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${API_URL}/games/${gameId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ content: newComment, rating: rating }),
            });

            const data = await response.json();
            if (response.ok) {
                const savedComment = data.comment || data;
                setComments([savedComment, ...comments]);
                setNewComment(""); 
                setRating(5);
            }
        } catch (err) {
            console.error("Błąd:", err);
        }
    };

    if (loading) return <p style={{ color: "#fff" }}>Ładowanie komentarzy...</p>;

    return (
        <div className="comments-container" style={{ marginTop: "30px", color: "#fff" }}>
            <h3>Komentarze ({comments.length})</h3>

            {user && (
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={{ marginBottom: "10px" }}>
                        <span style={{ marginRight: "10px" }}>Twoja ocena:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                                key={star} 
                                onClick={() => setRating(star)} 
                                style={{ cursor: "pointer", fontSize: "20px", color: star <= rating ? "#ffd700" : "#444" }}
                            >★</span>
                        ))}
                    </div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Napisz opinię..."
                        rows="3"
                        style={textareaStyle}
                        required
                    />
                    <button type="submit" style={submitBtnStyle}>Dodaj opinię</button>
                </form>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p style={{ color: "#666" }}>Brak komentarzy. Bądź pierwszy!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment-card" style={commentCardStyle}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <strong style={{ color: "#0ff" }}>{comment.user?.username || "Anonim"}</strong>
                                    <div style={{ color: "#ffd700", fontSize: "0.9em" }}>
                                        {"★".repeat(comment.rating || 0)}{"☆".repeat(5 - (comment.rating || 0))}
                                    </div>
                                </div>
                                
                                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "5px" }}>
                                    <span style={{ color: "#666", fontSize: "0.8em" }}>
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                    
                                    {/* PRZYCISK USUWANIA - TYLKO DLA ADMINA */}
                                    {user?.isAdmin && (
                                        <button 
                                            onClick={() => handleDeleteComment(comment._id)}
                                            style={deleteBtnStyle}
                                        >
                                            USUŃ
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p style={{ margin: "10px 0 0 0", lineHeight: "1.4" }}>{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Style pomocnicze
const formStyle = { marginBottom: "20px", backgroundColor: "#1a1a1a", padding: "15px", borderRadius: "8px" };
const textareaStyle = { width: "100%", padding: "10px", backgroundColor: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", marginBottom: "10px" };
const submitBtnStyle = { padding: "8px 16px", backgroundColor: "#0ff", color: "#000", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" };
const commentCardStyle = { padding: "15px", borderBottom: "1px solid #333", backgroundColor: "rgba(255,255,255,0.02)", marginBottom: "10px", borderRadius: "4px" };
const deleteBtnStyle = { backgroundColor: "transparent", color: "#ff4444", border: "1px solid #ff4444", borderRadius: "3px", padding: "2px 6px", fontSize: "0.7rem", cursor: "pointer", fontWeight: "bold" };