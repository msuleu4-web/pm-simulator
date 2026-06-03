import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d8eafc',
          200: '#b6d4f8',
          300: '#8ab7f0',
          400: '#5f96e6',
          500: '#3d7acc',
          600: '#2f5eb0',
          700: '#2c4c90',
          800: '#243d70',
          900: '#1e335a'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
};

export default config;
