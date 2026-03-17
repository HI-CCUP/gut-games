const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function login(email, password) {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
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
        const res = await fetch(`${API_URL}/auth/register`, {
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

        const res = await fetch(`${API_URL}/auth/add`, {
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



// Pobieranie danych do dashboardu (statystyki + lista gier)
export async function getAdminDashboard() {
    try {
        const res = await fetch(`${API_URL}/admin/dashboard`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        });

        const data = await res.json();
        if (!res.ok) return { error: true, message: data.message || "Błąd pobierania danych admina" };
        return { error: false, ...data };
    } catch (err) {
        return { error: true, message: "Błąd połączenia z serwerem" };
    }
}

// Usuwanie gry przez admina
export async function deleteGameAsAdmin(gameId) {
    try {
        const res = await fetch(`${API_URL}/admin/game/${gameId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        });

        const data = await res.json();
        if (!res.ok) return { error: true, message: data.message || "Nie udało się usunąć gry" };
        return { error: false, message: data.message };
    } catch (err) {
        return { error: true, message: "Błąd połączenia" };
    }
}

// Pobieranie listy użytkowników
export async function getAdminUsers() {
    try {
        const res = await fetch(`${API_URL}/admin/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();
        return res.ok ? { error: false, users: data } : { error: true, message: data.message };
    } catch (err) {
        return { error: true, message: "Błąd sieci" };
    }
}


//usuwanie użytkowników przez admina
export async function deleteUserAsAdmin(userId) {
    try {
        const res = await fetch(`${API_URL}/admin/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        });
        const data = await res.json();
        return res.ok ? { error: false } : { error: true, message: data.message };
    } catch (err) {
        return { error: true, message: "Błąd sieci" };
    }
}