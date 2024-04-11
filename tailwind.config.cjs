/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,ts,md}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          hover: "hsl(var(--card-hover))",
        },
        check: {
          start: "hsl(192, 100%, 67%)",
          end: "hsl(280, 87%, 65%)"
        },
      },
    },
  },
  plugins: [],
};
