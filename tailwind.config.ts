import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F0B1F",
        surface: "#1B1533",
        ink: "#FFFFFF",
        muted: "#A79FD1",
        line: "#3A3062",
        coral: "#FF3B5C",
        sun: "#FFB800",
        sea: "#00D9B5",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        body: ["Figtree", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "22px" },
    },
  },
  plugins: [],
};
export default config;
