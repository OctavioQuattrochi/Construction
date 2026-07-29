import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Brand: deep architectural charcoal + warm construction amber
        ink: {
          DEFAULT: "#0c0f14",
          50: "#f4f5f7",
          100: "#e3e5ea",
          200: "#c4c8d2",
          300: "#9ba1b1",
          400: "#6f7688",
          500: "#4f5566",
          600: "#3a3f4d",
          700: "#2b2f3a",
          800: "#1a1d25",
          900: "#0c0f14",
          950: "#06080b",
        },
        amber: {
          DEFAULT: "#f0a500",
          50: "#fff9eb",
          100: "#ffefc6",
          200: "#ffdc88",
          300: "#ffc44a",
          400: "#ffab20",
          500: "#f0a500",
          600: "#d47e00",
          700: "#b05902",
          800: "#8f4508",
          900: "#763a0b",
          950: "#451d00",
        },
        concrete: {
          DEFAULT: "#e8e6e1",
          50: "#faf9f7",
          100: "#f2f0eb",
          200: "#e8e6e1",
          300: "#d6d2ca",
          400: "#b8b2a6",
          500: "#9a9284",
          600: "#7d7568",
          700: "#655e54",
          800: "#4f4a43",
          900: "#3d3a38",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgb(12 15 20 / 0.08), 0 4px 24px -6px rgb(12 15 20 / 0.10)",
        elevated:
          "0 8px 30px -6px rgb(12 15 20 / 0.14), 0 20px 60px -20px rgb(12 15 20 / 0.20)",
        glow: "0 0 0 1px rgb(240 165 0 / 0.20), 0 8px 40px -8px rgb(240 165 0 / 0.35)",
        inset: "inset 0 1px 0 0 rgb(255 255 255 / 0.06)",
      },
      backgroundImage: {
        "grid-ink":
          "linear-gradient(to right, rgb(12 15 20 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(12 15 20 / 0.04) 1px, transparent 1px)",
        "grid-light":
          "linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
        "radial-amber":
          "radial-gradient(60% 60% at 50% 0%, rgb(240 165 0 / 0.16) 0%, transparent 70%)",
        "hero-fade":
          "linear-gradient(180deg, rgb(6 8 11 / 0.10) 0%, rgb(6 8 11 / 0.55) 55%, rgb(6 8 11 / 0.92) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1.8s infinite",
        marquee: "marquee 32s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
