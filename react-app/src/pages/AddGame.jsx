import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addGame as addGameRequest } from "../api/auth";
import "../styles/Form.css";

export default function AddGame() {
    const [form, setForm] = useState({ title: "", description: "", file: null });
    const [dragOver, setDragOver] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        setForm({ ...form, file: e.dataTransfer.files[0] });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleFileSelect = (e) => {
        if (e.target.files[0]) setForm({ ...form, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.file) return alert("Dodaj plik gry!");

        const result = await addGameRequest(form.file, form.title, form.description);

        if (result.error) return alert(result.message);

        if (result.token && result.user) {
            localStorage.setItem("token", result.token);
            login(result.user);
        }

        alert(result.message || "Gra dodana pomyślnie");
        navigate("/");
    };

    return (
        <div className="form-container">
            <h1>Dodawanie gry</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <label>Tytuł gry:</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Nazwa gry"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div
                    className={`input-wrapper drag-drop ${dragOver ? "drag-over" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    style={{
                        border: "2px dashed #888",
                        padding: "20px",
                        textAlign: "center",
                        marginBottom: "1rem",
                        position: "relative",
                    }}
                >
                    {form.file ? (
                        <p>Plik: {form.file.name}</p>
                    ) : (
                        <p>Przeciągnij i upuść plik gry tutaj lub wybierz plik</p>
                    )}
                    <input
                        type="file"
                        onChange={handleFileSelect}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer",
                        }}
                    />
                </div>

                <div className="input-wrapper">
                    <label>Opis gry:</label>
                    <textarea
                        name="description"
                        placeholder="Opis, fabuła, jak grać..."
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Wyślij grę</button>
            </form>
        </div>
    );
}
