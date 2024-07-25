import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
        },
        green: {
          500: '#22c55e',
          600: '#16a34a',
        },
        purple: {
          500: '#a855f7',
        },
        'dashboard-bg': '#f0f4f8',
        'dashboard-heading': '#1a202c',
        'dashboard-error': '#e53e3e',
        'dashboard-error-bg': '#fef2f2',
        'dashboard-success': '#38a169',
        'dashboard-success-bg': '#f0fff4',
        'dashboard-label': '#4a5568',
        'dashboard-border': '#cbd5e0',
        'dashboard-focus': '#3182ce',
        'dashboard-button': '#2b6cb0',
        'dashboard-button-hover': '#2c5282',
        'dashboard-button-disabled': '#a0aec0',
      },
    },
  },
  plugins: [],
};
export default config;
