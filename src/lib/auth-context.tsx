"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthState {
    isLoggedIn: boolean;
    branchName: string | null;
    login: (branchName: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    branchName: null,
    login: () => { },
    logout: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

function setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [branchName, setBranchName] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("isLoggedIn");
        const storedBranch = localStorage.getItem("branchName");
        if (stored === "true" && storedBranch) {
            setIsLoggedIn(true);
            setBranchName(storedBranch);
        }
        setIsHydrated(true);
    }, []);

    const login = (branch: string) => {
        setIsLoggedIn(true);
        setBranchName(branch);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("branchName", branch);
        // Middleware用Cookie (auth_token に拠点名を保持)
        setCookie("auth_token", branch, 7);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setBranchName(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("branchName");
        deleteCookie("auth_token");
    };

    if (!isHydrated) return null;

    return (
        <AuthContext.Provider value={{ isLoggedIn, branchName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
