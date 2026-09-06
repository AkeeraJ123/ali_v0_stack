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
        "black-cherry": {
          DEFAULT: "#511827",
          50: "#f7ecee",
          100: "#ecd2d7",
          200: "#d6a3ad",
          300: "#bd7482",
          400: "#8f4353",
          500: "#511827",
          600: "#44141f",
          700: "#361019",
          800: "#280c13",
          900: "#1a080c",
          950: "#0f0407",
        },
        "nude-blush": {
          DEFAULT: "#D8B2A6",
          50: "#faf4f2",
          100: "#f3e5e0",
          200: "#eaccc3",
          300: "#D8B2A6",
          400: "#c4907f",
          500: "#ab6d58",
          600: "#8c5344",
          700: "#6d3f34",
          800: "#4e2e27",
          900: "#331f1a",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-display)",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "var(--font-body)",
          "-apple-system",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(216, 178, 166, 0.45)",
        card: "0 10px 40px -12px rgba(15, 4, 7, 0.55)",
      },
      backgroundImage: {
        "cherry-radial":
          "radial-gradient(120% 120% at 50% 0%, #6b2033 0%, #511827 45%, #2c0d15 100%)",
        "blush-sheen":
          "linear-gradient(135deg, #D8B2A6 0%, #eaccc3 50%, #D8B2A6 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease",
      },
    },
  },
  plugins: [],
};

export default config;
