/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        skywash: {
          50: "#f5f9ff",
          100: "#e8f1ff",
          200: "#cfe2ff",
          300: "#a9cbff",
          400: "#79adff",
          500: "#4f8bff",
          600: "#2d65f5",
          700: "#214fd1",
          800: "#1f42a8",
          900: "#1f3b82"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
