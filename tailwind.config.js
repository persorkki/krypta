/** @type {import('tailwindcss').Config} */
import { colors, transparent } from "tailwindcss/colors";

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    /*
    colors:{
      transparent: 'transparent',
      current: 'currentColor',
      primary: colors.emerald,
      secondary: colors.rose,
      monochrome: colors.neutral,
    },
    */
    extend: {
      fontFamily: {
        nunito: ['Nunito Sans'],
      }
    },
  },
  plugins: [],
}

