"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 🎯 কুকি অথবা লোকালস্টোরেজ যেকোনো একটি থেকে টোকেন রিটার্ন করবে
    const savedToken = Cookies.get("token") || localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = (newToken: string) => {
    // 🎯 LocalStorage এবং Cookies দুটোতেই ৭ দিনের মেয়াদ সহ টোকেন সেট করো
    localStorage.setItem("token", newToken);
    Cookies.set("token", newToken, { expires: 7, path: "/" });
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token", { path: "/" });
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);