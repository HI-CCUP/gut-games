const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function login(email, password) {
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            console.error("Niepoprawny JSON z backendu:", text);
            return { error: true, message: "Błąd backendu (niepoprawny format)" };
        }

        if (!res.ok) {
            return { error: true, message: data.message || "Błąd logowania" };
        }

        return data;
    } catch (err) {
        console.error("Błąd sieci:", err);
        return { error: true, message: "Błąd połączenia z serwerem" };
    }
}

export async function register(username, email, password) {
    try {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const text = await res.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return { error: true, message: "Błąd backendu" };
        }

        if (!res.ok) {
            return { error: true, message: data.message || "Błąd rejestracji" };
        }

        return data;
    } catch (err) {
        console.error("Błąd sieci:", err);
        return { error: true, message: "Błąd połączenia z serwerem" };
    }
}

export async function addGame(file, title, description) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);

        const res = await fetch(`${API_URL}/api/auth/add`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });

        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return { error: true, message: "Niepoprawna odpowiedź backendu" };
        }

        if (!res.ok) {
            return { error: true, message: data.message || "Błąd dodawania gry" };
        }

        return { error: false, game: data.game, message: data.message };
    } catch (err) {
        console.error("Błąd sieci:", err);
        return { error: true, message: "Błąd połączenia z serwerem" };
    }
}