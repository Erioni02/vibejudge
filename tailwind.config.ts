import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101010",
        paper: "#fbfaf7",
        ember: "#e8502f",
        moss: "#2e6f5e",
        steel: "#4b5563"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 16, 16, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
