/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* Coastal Café Brand Colors */
        brand: {
          light: "rgb(var(--brand-light) / <alpha-value>)",
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          deep: "rgb(var(--brand-deep) / <alpha-value>)"
        },
        /* Accent Colors */
        coffee: {
          DEFAULT: "rgb(var(--color-coffee) / <alpha-value>)",
          light: "rgb(var(--color-coffee-light) / <alpha-value>)",
          dark: "rgb(var(--color-coffee-dark) / <alpha-value>)"
        },
        olive: {
          DEFAULT: "rgb(var(--color-olive) / <alpha-value>)",
          light: "rgb(var(--color-olive-light) / <alpha-value>)"
        },
        caramel: {
          DEFAULT: "rgb(var(--color-caramel) / <alpha-value>)",
          light: "rgb(var(--color-caramel-light) / <alpha-value>)"
        },
        /* Neutral Colors */
        neutral: {
          white: "rgb(var(--neutral-white) / <alpha-value>)",
          offwhite: "rgb(var(--neutral-offwhite) / <alpha-value>)",
          slate: "rgb(var(--neutral-slate) / <alpha-value>)"
        },
        /* Background Colors */
        surface: {
          primary: "rgb(var(--color-bg-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-bg-muted) / <alpha-value>)"
        },
        /* Text Colors */
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      fontSize: {
        xs: ["var(--font-size-xs)", { lineHeight: "var(--line-height-normal)" }],
        sm: ["var(--font-size-sm)", { lineHeight: "var(--line-height-normal)" }],
        base: ["var(--font-size-base)", { lineHeight: "var(--line-height-normal)" }],
        lg: ["var(--font-size-lg)", { lineHeight: "var(--line-height-normal)" }],
        xl: ["var(--font-size-xl)", { lineHeight: "var(--line-height-tight)" }],
        "2xl": ["var(--font-size-2xl)", { lineHeight: "var(--line-height-tight)" }],
        "3xl": ["var(--font-size-3xl)", { lineHeight: "var(--line-height-tight)" }],
        "4xl": ["var(--font-size-4xl)", { lineHeight: "var(--line-height-tight)" }],
        "5xl": ["var(--font-size-5xl)", { lineHeight: "var(--line-height-tight)" }]
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        soft: "var(--shadow-soft)",
        layered: "var(--shadow-layered)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "ui-default": "var(--radius-xl)"
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)"
      },
      maxWidth: {
        container: "var(--container-max-width)"
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms"
      },
      transitionTimingFunction: {
        subtle: "ease-out"
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(circle at top, rgba(128, 143, 104, 0.08), transparent 55%)",
        "soft-linear":
          "linear-gradient(120deg, rgba(250, 247, 242, 0.9), rgba(255, 253, 250, 0.8))"
      },
      borderColor: {
        subtle: "var(--border-color)",
        "subtle-light": "var(--border-color-light)"
      }
    }
  },
  plugins: []
};
