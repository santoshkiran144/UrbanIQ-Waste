import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("urbaniq_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistSession = (token, nextUser) => {
    localStorage.setItem("urbaniq_token", token);
    localStorage.setItem("urbaniq_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem("urbaniq_token");
    localStorage.removeItem("urbaniq_user");
    setUser(null);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      persistSession(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", payload);
      persistSession(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => clearSession();

  useEffect(() => {
    const syncUser = async () => {
      if (!localStorage.getItem("urbaniq_token")) {
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem("urbaniq_user", JSON.stringify(data.user));
        setUser(data.user);
      } catch (_error) {
        clearSession();
      }
    };

    syncUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
