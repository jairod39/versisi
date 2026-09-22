import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#EFEBFF",
        surface: "#FFFFFF",
        ink: "#1B1740",
        muted: "#5B5680",
        line: "#D6CFF5",
        coral: "#FF5D73",
        sun: "#FFC94A",
        sea: "#1FA39A",
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
