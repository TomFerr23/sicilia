import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF5E6",
        paper: "#FFFDF6",
        ink: "#2B2218",
        sub: "#7A6A52",
        sea: "#1E4E8C",
        seaDeep: "#16365F",
        terra: "#C5552E",
        gold: "#C79A3A",
        olive: "#6E7A4A",
        line: "#E4D8BE",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-spline)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "760px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(43,34,24,0.04), 0 8px 24px -12px rgba(43,34,24,0.18)",
        pill: "0 6px 18px -8px rgba(43,34,24,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
