import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          cyan: "#00f3ff",
          purple: "#bc13fe",
          pink: "#ff00e5",
          lime: "#39ff14",
        },
        game: {
          dark: "#0a0b1e",
          card: "#161b33",
          accent: "#2f357d",
        }
      },
    },
  },
  plugins: [],
};
export default config;
