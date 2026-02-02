/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "rgb(var(--brand-light) / <alpha-value>)",
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          deep: "rgb(var(--brand-deep) / <alpha-value>)"
        },
        neutral: {
          white: "rgb(var(--neutral-white) / <alpha-value>)",
          offwhite: "rgb(var(--neutral-offwhite) / <alpha-value>)",
          slate: "rgb(var(--neutral-slate) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)",
        layered:
          "0 12px 30px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        "ui-default": "1.25rem"
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(circle at top, rgba(77, 141, 255, 0.12), transparent 55%)",
        "soft-linear":
          "linear-gradient(120deg, rgba(233, 242, 255, 0.9), rgba(255, 255, 255, 0.7))"
      }
    }
  },
  plugins: []
};
