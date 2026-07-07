import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — driven by CSS variables so they flip with the theme.
        ink: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        base: "var(--bg)",
        surface: "var(--surface)",
        card: "var(--card)",
        hair: "var(--hair)",
        raise: {
          DEFAULT: "var(--raise)",
          hover: "var(--raise-hover)",
        },
        // Brand palette — fixed in BOTH themes: red (dominant) + violet (minor).
        brand: {
          red: "#e11d48",
          "red-bright": "#f43f5e",
          "red-deep": "#9f1239",
          violet: "#7c3aed",
          "violet-bright": "#8b5cf6",
        },
      },
      boxShadow: {
        border: "0 0 0 1px var(--border-shadow)",
        "border-hover": "0 0 0 1px var(--border-shadow-hover)",
        "brand-glow":
          "0 0 0 1px var(--border-shadow), 0 8px 30px -8px rgba(225,29,72,0.55)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;