import React, { createContext, useContext, useState } from "react";
import { colors as lightColors } from "./index";

// Define the type for your theme context
type ThemeContextType = {
  theme: "light" | "dark";
  colors: typeof lightColors & {
    textSecondary: string;
    border: string;
    cardBackground: string;
    shadow:string; // 👈 add this
  };
  toggleTheme: () => void;
};

// Set the context type, and initialize with undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const colors =
    theme === "light"
      ? {
          ...lightColors,
          textSecondary: "#555555",
          cardBackground: "#ffffff",
          border: "#413a3aff",
          success: "#28a745",
          warning: "#ffc107",
          error: "#dc3545",
          muted: "#888888",
        }
      : {
          ...lightColors,
          background: "#000000",
          text: "#FFFFFF",
          textSecondary: "#aaaaaa",
          cardBackground: "#1a1a1a",
          border: "#333333",
          success: "#28a745",
          warning: "#ffc107",
          error: "#dc3545",
          muted: "#999999",
        };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}