const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, password) {
    if (!API_URL) throw new Error("VITE_API_URL nie jest ustawione!");

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
        console.error("Backend zwrócił niepoprawny JSON:", text);
        throw new Error("Błąd backendu: niepoprawny JSON");
    }

    if (!res.ok) throw new Error(data.message || "Login failed");

    return data;
}

