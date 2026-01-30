import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GamePage from "./pages/GamePage";
import Profile from "./pages/Profile";
import Rankings from "./pages/Rankings";
import "./styles/style.css";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/rankings" element={<Rankings />} />
      </Routes>
    </>
  );
}

