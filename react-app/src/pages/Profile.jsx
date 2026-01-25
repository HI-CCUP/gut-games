import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container">
            <h1>Profil użytkownika {user.username}</h1>
        </div>
    );
}
