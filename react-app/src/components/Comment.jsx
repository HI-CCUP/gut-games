import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 

export default function Comments({ gameId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Pobieramy info o zalogowanym użytkowniku

    // Pobieranie komentarzy
    useEffect(() => {
        fetch(`/api/games/${gameId}/comments`)
            .then((res) => res.json())
            .then((data) => {
                setComments(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd pobierania komentarzy:", err);
                setLoading(false);
            });
    }, [gameId]);

    // Obsługa wysyłania nowego komentarza
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Musisz być zalogowany, aby dodać komentarz.");
            return;
        }

        try {
            const response = await fetch(`/api/games/${gameId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Wysyła token 
                },
                body: JSON.stringify({ text: newComment }),
            });

            const data = await response.json();

            if (response.ok) {
                // Dodajemy nowy komentarz na początek listy
                setComments([data.comment, ...comments]);
                setNewComment("");//czyszczenie pola tekstowego
            } else {
                alert(data.message || "Błąd podczas dodawania komentarza.");
            }
        } catch (err) {
            console.error("Błąd sieci:", err);
            alert("Nie udało się połączyć z serwerem.");
        }
    };

    if (loading) return <p>Ładowanie komentarzy...</p>;

    return (
        <div className="comments-container">
            {/* Formularz dodawania komentarza */}
            {user ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
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
                            marginBottom: "10px"
                        }}
                        required
                    />
                    {/*dodawanie komentarza*/}
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
                        Dodaj komentarz
                    </button>
                </form>
            ) : (
                <p style={{ color: "#aaa", fontStyle: "italic" }}>
                    Zaloguj się, aby dodać komentarz.
                </p>
            )}

            {/* Lista komentarzy */}
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p>Brak komentarzy. Bądź pierwszy!</p>
                ) : (
                    comments.map((comment) => (
                        <div 
                            key={comment._id} 
                            style={{
                                padding: "10px",
                                borderBottom: "1px solid #333",
                                marginBottom: "10px"
                            }}
                        >
                            <div style={{ fontWeight: "bold", color: "#0ff", marginBottom: "5px" }}>
                                {comment.author?.username || "Nieznany użytkownik"}
                                <span style={{ color: "#666", fontSize: "0.8em", marginLeft: "10px" }}>
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div>{comment.text}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}