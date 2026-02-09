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
        accent: {
          olive: "rgb(var(--accent-olive) / <alpha-value>)",
          caramel: "rgb(var(--accent-caramel) / <alpha-value>)",
          sand: "rgb(var(--accent-sand) / <alpha-value>)"
        },
        neutral: {
          white: "rgb(var(--neutral-white) / <alpha-value>)",
          offwhite: "rgb(var(--neutral-offwhite) / <alpha-value>)",
          slate: "rgb(var(--neutral-slate) / <alpha-value>)"
        }
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["Open Sans", "Segoe UI", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 8px 32px rgba(45, 35, 28, 0.06)",
        hover: "0 12px 40px rgba(45, 35, 28, 0.1)",
        layered:
          "0 4px 20px rgba(45, 35, 28, 0.08), 0 1px 4px rgba(45, 35, 28, 0.04)"
      },
      borderRadius: {
        "ui-default": "0.875rem"
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(circle at top, rgba(194, 139, 87, 0.08), transparent 55%)",
        "soft-linear":
          "linear-gradient(180deg, rgba(250, 247, 242, 0.95), rgba(245, 241, 235, 0.9))"
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms"
      }
    }
  },
  plugins: []
};
