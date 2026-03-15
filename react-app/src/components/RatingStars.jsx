import React, { useState } from "react";

export default function RatingStars({ gameId, initialRating }) {
    const [rating, setRating] = useState(0);

    // Dynamiczny adres API
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const handleRate = async (value) => {
        setRating(value);
        
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Musisz być zalogowany, aby oceniać gry.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/ratings/${gameId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ rating: value }),
            });

            if (res.ok) {
                alert(`Oceniono na ${value} gwiazdek!`);
            } else {
                const errorData = await res.json();
                alert(errorData.message || "Błąd podczas oceniania");
            }
        } catch (err) {
            console.error("Błąd sieci:", err);
            alert("Nie udało się połączyć z serwerem.");
        }
    };

    return (
        <div style={{ fontSize: "24px", color: "#ffd700", cursor: "pointer", margin: "10px 0" }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onClick={() => handleRate(star)}>
                    {star <= (rating || initialRating) ? "★" : "☆"}
                </span>
            ))}
            <span style={{ marginLeft: "10px", color: "#fff", fontSize: "16px" }}>
                ({initialRating ? Number(initialRating).toFixed(1) : "Brak ocen"})
            </span>
        </div>
    );
}