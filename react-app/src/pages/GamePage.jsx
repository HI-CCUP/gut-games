import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function GamePage() {
    const { id } = useParams();
    const countedRef = useRef(false);

    useEffect(() => {
        if (countedRef.current) return;

        countedRef.current = true;

        const key = `views_${id}`;
        const currentViews = parseInt(localStorage.getItem(key) || "0");
        localStorage.setItem(key, currentViews + 1);
    }, [id]);

    return (
        <div className="container">
            <h1>Gra {id}</h1>
            <p>Tutaj będzie iframe lub embed gry.</p>
            <div
                style={{
                    width: "100%",
                    height: "500px",
                    backgroundColor: "#222",
                    color: "#0ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                Miejsce na grę
            </div>
        </div>
    );
}