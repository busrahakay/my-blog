//kimlik doğrulama durumu kontrol edilir. (admin panelinde)
import { useState, useEffect } from "react";
//bileşen değeri tutulur.
//HOOK
// Bu hook, kullanıcının kimlik doğrulama durumunu kontrol eder ve buna göre bir değer döndürür.

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Buraya kimlik doğrulama mantığı eklenebilir
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
    }, []);

    return isAuthenticated;
}
