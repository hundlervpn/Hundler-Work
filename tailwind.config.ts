import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — ONLY these: black / white / red / violet.
        // Red is the dominant accent; violet is secondary/minor.
        ink: {
          DEFAULT: "#ffffff",
          muted: "#a1a1aa",
        },
        base: {
          DEFAULT: "#0a0a0b",
          raised: "#141416",
          card: "#161618",
        },
        brand: {
          red: "#e11d48",
          "red-bright": "#f43f5e",
          "red-deep": "#9f1239",
          violet: "#7c3aed",
          "violet-bright": "#8b5cf6",
        },
      },
      boxShadow: {
        border: "0 0 0 1px rgba(255,255,255,0.08)",
        "border-hover": "0 0 0 1px rgba(255,255,255,0.14)",
        "brand-glow":
          "0 0 0 1px rgba(255,255,255,0.06), 0 8px 30px -8px rgba(225,29,72,0.55)",
        "brand-ring": "0 0 0 1px rgba(225,29,72,0.35)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 420ms cubic-bezier(0.2,0,0,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;