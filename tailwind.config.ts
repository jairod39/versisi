import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#221830",
        surface: "#2D2140",
        ink: "#FBF7FF",
        muted: "#B3A6D9",
        line: "#493768",
        coral: "#FF6B6B",
        sun: "#FFB84D",
        sea: "#2DD4BF",
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
