import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import "../styles/Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [passwordType, setPasswordType] = useState("password");
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Błąd rejestracji");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      login(data.user);
      navigate("/");
    } catch {
      alert("Błąd połączenia z serwerem");
    }
  };

  const handleTogglePassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="form-container">
      <h1>Rejestracja</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label>Nazwa użytkownika:</label>
          <input
            type="text"
            name="username"
            placeholder="Nick"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Twój email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <label>Hasło:</label>
          <div className="password-input-container" style={{ position: 'relative' }}>
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
              <FontAwesomeIcon
                icon={passwordType === "password" ? faEyeSlash : faEye}
                className="password-eye"
              />
            </button>
          </div>
        </div>

        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
}

