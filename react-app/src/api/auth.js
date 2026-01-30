const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function login(email, password) {
    try {
        const res = await fetch(`${API_URL}/login`, {
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
            return {
                error: true,
                message: "Błąd backendu",
            };
        }

        if (!res.ok) {
            return {
                error: true,
                message: data.message || "Błąd logowania",
            };
        }

        return data;
    } catch (err) {
        console.error("Błąd sieci:", err);
        return {
            error: true,
            message: "Błąd połączenia z serwerem",
        };
    }
}

export async function register(username, email, password) {
    try {
        const res = await fetch("/api/register", {
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
    } catch {
        return { error: true, message: "Błąd połączenia z serwerem" };
    }
}

