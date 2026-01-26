console.log("API URL:", process.env.REACT_APP_API_URL);

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { togglePasswordType } from "../utils/password";
import "../styles/Login.css"; 
import { login } from "../api/auth";


export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [passwordType, setPasswordType] = useState("password");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Błąd logowania");
        return;
    }

    localStorage.setItem("token", data.token);
    login(data.user);
    navigate("/");
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
