import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "var(--font-devanagari)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        serif: [
          "var(--font-playfair)",
          "var(--font-devanagari)",
          "Georgia",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
