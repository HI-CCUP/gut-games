import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { togglePasswordType } from "../utils/password";
import "../styles/Login.css";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [passwordType, setPasswordType] = useState("password");
    const { login } = useAuth();
    const navigate = useNavigate();

    // 🔹 Twój backend URL z Vite env
    const API_URL = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("API URL:", API_URL);

        if (!API_URL) {
            alert("Backend URL nie jest ustawiony. Sprawdź VITE_API_URL.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            // Bezpieczne parsowanie odpowiedzi
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error("Odpowiedź backendu nie jest JSON-em:", text);
                alert("Błąd serwera: odpowiedź nie jest JSON");
                return;
            }

            if (!res.ok) {
                alert(data.message || "Błąd logowania");
                return;
            }

            // Zapis tokena + logowanie użytkownika
            localStorage.setItem("token", data.token);
            login(data.user);
            navigate("/");

        } catch (err) {
            console.error("Błąd połączenia z backendem:", err);
            alert("Błąd połączenia z serwerem");
        }
    };

    const handleTogglePassword = () => {
        setPasswordType((prev) => togglePasswordType(prev));
    };

    return (
        <div className="form-container">
            <h1>Logowanie</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Twój email"
                        required
                    />
                </div>

                <div className="input-wrapper">
                    <label>Hasło:</label>
                    <input
                        type={passwordType}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Hasło"
                        required
                    />
                    <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="showPassword"
                    >
                        {passwordType === "password" ? "👁️" : "🙈"}
                    </button>
                </div>

                <button type="submit">Zaloguj się</button>
            </form>
        </div>
    );
}

