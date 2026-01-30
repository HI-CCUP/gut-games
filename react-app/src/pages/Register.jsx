import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register as registerRequest } from "../api/auth";
import "../styles/Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [passwordType, setPasswordType] = useState("password");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await registerRequest(
      form.username,
      form.email,
      form.password
    );

    if (result.error) {
      alert(result.message);
      return;
    }

    localStorage.setItem("token", result.token);
    login(result.user);
    navigate("/");
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
          <div
            className="password-input-container"
            style={{ position: "relative" }}
          >
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
              className="showPassword_register"
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
