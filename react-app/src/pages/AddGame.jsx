import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addGame as addGameRequest } from "../api/auth";
import "../styles/Form.css";

export default function AddGame() {
    // 1. Dodajemy 'thumbnail' do stanu początkowego
    const [form, setForm] = useState({ title: "", description: "", thumbnail: "", file: null });
    const [dragOver, setDragOver] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // upewnij się czy to na pewno tu potrzebne, jeśli nie używasz w tym pliku

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

        // 2. Przekazujemy thumbnail do API
        const result = await addGameRequest(form.file, form.title, form.description, form.thumbnail);

        if (result.error) return alert(result.message);

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

                {/* 3. NOWE POLE - Link do miniatury */}
                <div className="input-wrapper">
                    <label>Link do zdjęcia (URL):</label>
                    <input
                        type="url"
                        name="thumbnail"
                        placeholder="np. https://imgur.com/zdjecie.png"
                        value={form.thumbnail}
                        onChange={handleChange}
                    />
                    {/* Podgląd miniatury na żywo, jeśli wklejono link */}
                    {form.thumbnail && (
                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                            <img 
                                src={form.thumbnail} 
                                alt="Podgląd" 
                                style={{ maxHeight: "150px", borderRadius: "8px", border: "1px solid #0ff" }} 
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                    )}
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