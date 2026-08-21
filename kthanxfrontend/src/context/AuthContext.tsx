"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [ loading , setLoading] = useState<boolean>(true)

  useEffect(() => {
   
    const savedToken = Cookies.get("token") || localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }else{
      setToken(null)
    }
    setLoading(false)
  }, []);

  const login = (newToken: string) => {

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
    <AuthContext.Provider value={{ token,loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);