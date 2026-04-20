/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0d0f1a',
          50: '#1a1d2e',
          100: '#141625',
        },
        surface: {
          DEFAULT: '#161827',
          50: '#1e2135',
          100: '#252840',
          200: '#2e3148',
        },
        accent: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        node: {
          start: '#22c55e',
          task: '#6366f1',
          approval: '#f59e0b',
          automated: '#06b6d4',
          end: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
