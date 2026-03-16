import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GamePage from "./pages/GamePage";
import Rankings from "./pages/Rankings";
import AddGame from "./pages/AddGame";
import UserProfile from "./pages/UserProfile";
import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./pages/AdminPanel";
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
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route 
    path="/admin" 
    element={
        <AdminRoute>
            <AdminPanel />
        </AdminRoute>
    } />
        
        <Route path="/add" element={<AddGame />} />
        
      </Routes>
    </>
  );
}

