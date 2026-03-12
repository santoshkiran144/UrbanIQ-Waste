/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#071411",
        brand: {
          100: "#c9ffe7",
          400: "#35d5a0",
          500: "#14b87e",
          700: "#0a6849"
        },
        accent: {
          400: "#ff9a62",
          500: "#ff7d4d"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(20, 184, 126, 0.2)",
        glass: "0 20px 40px rgba(2, 6, 23, 0.35)"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
