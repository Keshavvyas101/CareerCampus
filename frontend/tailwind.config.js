/** @type {import('tailwindcss').Config} */
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  content: [
    resolve(__dirname, "./index.html"),
    resolve(__dirname, "./src/**/*.{js,jsx,ts,tsx}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
