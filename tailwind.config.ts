import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sand: "#f0ece3",
        ink: "#0d0d14",
        ember: "#1c1814",
        gold: "#d4a84b",
        moss: "#3a6e00"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(0,0,0,.16)"
      }
    }
  },
  plugins: []
};

export default config;
