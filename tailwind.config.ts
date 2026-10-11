import type { Config } from "tailwindcss";

/**
 * VibeJudge design tokens.
 * Warm paper neutrals, one accent (ember), two semantic support colors (moss = fixed, amber = caution).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16130f",
          2: "#3d3730",
          3: "#6f675c"
        },
        paper: {
          DEFAULT: "#f7f4ee",
          2: "#efeae1"
        },
        line: {
          DEFAULT: "#e5dfd4",
          strong: "#cfc6b6"
        },
        ember: {
          DEFAULT: "#e2492f",
          dark: "#c23a22",
          soft: "#fcebe6"
        },
        moss: {
          DEFAULT: "#2f6b57",
          soft: "#e7f1ec"
        },
        amber: {
          DEFAULT: "#a8701c",
          soft: "#fbf1dd"
        },
        steel: "#4b5563"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"]
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 5.6vw, 4.25rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.5rem, 2.6vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }]
      },
      borderRadius: {
        control: "10px",
        card: "16px"
      },
      boxShadow: {
        xs: "0 1px 2px rgba(22, 19, 15, 0.06)",
        card: "0 1px 2px rgba(22, 19, 15, 0.04), 0 8px 24px -16px rgba(22, 19, 15, 0.12)",
        lift: "0 1px 2px rgba(22, 19, 15, 0.04), 0 20px 44px -24px rgba(22, 19, 15, 0.22)",
        soft: "0 1px 2px rgba(22, 19, 15, 0.04), 0 10px 28px -14px rgba(22, 19, 15, 0.16)"
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      transitionDuration: {
        fast: "150ms",
        base: "220ms"
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        dial: {
          from: { strokeDashoffset: "var(--dial-length)" }
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" }
        }
      },
      animation: {
        "fade-up": "fade-up 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        dial: "dial 1100ms cubic-bezier(0.16, 1, 0.3, 1) 150ms both",
        shimmer: "shimmer 1.6s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
