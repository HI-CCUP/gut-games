// react-app/src/api/auth.js

const API_URL = process.env.REACT_APP_API_URL;

export async function login(email, password) {
    if (!API_URL) throw new Error("REACT_APP_API_URL nie jest ustawione!");

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const text = await res.text(); // najpierw pobieramy jako tekst
    let data;
    try {
        data = JSON.parse(text); // dopiero teraz parsujemy
    } catch {
        console.error("Backend zwrócił niepoprawny JSON:", text);
        throw new Error("Błąd backendu: niepoprawny JSON");
    }

    if (!res.ok) throw new Error(data.message || "Login failed");

    return data; // { token, user, message }
}

