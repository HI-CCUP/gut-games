import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlitchText from "./GlitchText";

const Navbar = () => {
    const auth = useAuth();

    if (!auth) return null;

    const { user, logout } = auth;

    return (
        <nav className="navbar">
            <GlitchText tag="div" className="logo">Odyssey of Your Games</GlitchText>

            <div className="links">
                <Link to="/">Strona główna</Link>
                <Link to="/rankings">Rankingi</Link>

                {!user ? (
                    <>
                        <Link to="/login">Logowanie</Link>
                        <Link to="/register">Rejestracja</Link>
                    </>
                ) : (
                    <>
                        <Link to={`/profile/${user.id}`}>Profil</Link>
                        <button onClick={logout} className="logout-btn">
                            Wyloguj
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
