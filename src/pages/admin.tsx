import { useState } from "react";
import { useRouter } from "next/router";

//admin paneline geçiş için gerekir. (admin girişi ile yapılması gerekir.)
export default function Admin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = () => {
        if (username === "admin" && password === "admin123") {
            // Admin doğrulaması başarılıysa
            sessionStorage.setItem("isAdmin", "true");
            router.push("/admin/panel"); // Burada admin paneline yönlendiriliyor
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
            <div className="w-full max-w-sm mx-auto">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full p-2 border rounded mb-4"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 border rounded mb-4"
                />
                {error && <p className="text-red-500">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full p-2 bg-blue-500 text-white rounded"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
