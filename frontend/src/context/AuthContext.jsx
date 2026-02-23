import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, login as loginApi, signup as signupApi, logout as logoutApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const res = await loginApi(credentials);
        setUser(res.data);
        return res.data;
    };

    const signup = async (userData) => {
        const res = await signupApi(userData);
        // setUser(res.data); // Removed automatic login after signup
        return res.data;
    };

    const logout = async () => {
        await logoutApi();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
