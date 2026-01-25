import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { togglePasswordType } from "../utils/password";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [passwordType, setPasswordType] = useState("password");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Błąd rejestracji");
            return;
        }

        login(data.user);
        navigate("/");
    };

    const handleTogglePassword = () => {
        setPasswordType((prev) => togglePasswordType(prev));
    };

    return (
        <div className="container">
            <h1>Rejestracja</h1>
            <form onSubmit={handleSubmit}>
                <label>Nazwa użytkownika:</label>
                <input
                    type="text"
                    name="username"
                    placeholder="Nick"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Twój email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

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
                    <button type="button" onClick={handleTogglePassword} className="showPassword">
                        {passwordType === "password" ? "👁️" : "🙈"}
                    </button>
                </div>

                <button type="submit">Zarejestruj się</button>
            </form>
        </div>
    );
}
