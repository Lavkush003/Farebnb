import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
    getCurrentUser,
    login as loginApi,
    signup as signupApi,
    demoLogin as demoLoginApi,
    logout as logoutApi,
    toggleWishlist as toggleWishlistApi
} from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const res = await getCurrentUser();
            if (res.data) {
                setUser(res.data);
                const savedIds = (res.data.wishlist || []).map(item =>
                    typeof item === "string" ? item : item._id || item
                );
                setWishlist(savedIds);
            } else {
                setUser(null);
                setWishlist([]);
            }
        } catch {
            setUser(null);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials) => {
        const res = await loginApi(credentials);
        setUser(res.data);
        const savedIds = (res.data.wishlist || []).map(item =>
            typeof item === "string" ? item : item._id || item
        );
        setWishlist(savedIds);
        return res.data;
    };

    const signup = async (userData) => {
        const res = await signupApi(userData);
        setUser(res.data);
        setWishlist(res.data.wishlist || []);
        return res.data;
    };

    const demoLogin = async (role = "guest") => {
        const res = await demoLoginApi(role);
        setUser(res.data);
        const savedIds = (res.data.wishlist || []).map(item =>
            typeof item === "string" ? item : item._id || item
        );
        setWishlist(savedIds);
        return res.data;
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (e) {
            console.error(e);
        }
        setUser(null);
        setWishlist([]);
    };

    const toggleWishlist = async (listingId) => {
        if (!user) return false;
        const idStr = listingId.toString();
        const isCurrentlySaved = wishlist.includes(idStr);

        // Optimistic UI update
        if (isCurrentlySaved) {
            setWishlist(prev => prev.filter(id => id !== idStr));
        } else {
            setWishlist(prev => [...prev, idStr]);
        }

        try {
            const res = await toggleWishlistApi(listingId);
            return res.data.isSaved;
        } catch (err) {
            // Revert on error
            if (isCurrentlySaved) {
                setWishlist(prev => [...prev, idStr]);
            } else {
                setWishlist(prev => prev.filter(id => id !== idStr));
            }
            throw err;
        }
    };

    const isWishlisted = (listingId) => {
        if (!listingId) return false;
        return wishlist.includes(listingId.toString());
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                wishlist,
                loading,
                login,
                signup,
                demoLogin,
                logout,
                toggleWishlist,
                isWishlisted,
                refreshUser: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
