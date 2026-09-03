import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf9f7",
          100: "#f5f3ef",
          200: "#e8e4dc",
          300: "#d4cdc0",
          400: "#b8ad9a",
          500: "#9c8f7a",
          600: "#857663",
          700: "#6d6152",
          800: "#5a5045",
          900: "#4a433b",
          950: "#28241f",
        },
        accent: {
          DEFAULT: "#9B1B30",
          light: "#B83248",
          dark: "#7A1525",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1A1A18",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        ui: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      animation: {
        "fade-in": "fadeIn var(--duration-medium) var(--ease-couture) forwards",
        "slide-up": "slideUp var(--duration-medium) var(--ease-couture) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      letterSpacing: {
        widest: "0.2em",
        ultra: "0.3em",
      },
    },
  },
  plugins: [],
};

export default config;
