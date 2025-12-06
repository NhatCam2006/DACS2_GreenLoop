/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        // Dark mode specific colors
        dark: {
          bg: "#0f172a",
          card: "#1e293b",
          border: "#334155",
          text: {
            primary: "#f8fafc",
            secondary: "#94a3b8",
            muted: "#64748b",
          },
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundColor: {
        "dark-primary": "#0f172a",
        "dark-secondary": "#1e293b",
        "dark-tertiary": "#334155",
      },
    },
  },
  plugins: [],
};
