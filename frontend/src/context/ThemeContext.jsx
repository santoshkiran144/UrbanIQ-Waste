import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  const stored = localStorage.getItem("urbaniq_theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return "dark";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("urbaniq_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
