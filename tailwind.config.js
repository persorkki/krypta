/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors:{
      'primary':  '#737373',      // neutral-500
      'bg': '#fafafa',            // neutral-50
      'border': '#e5e5e5',        // neutral-200
      'secondary': '#ea580c',

      'primary-dark': '#f5f5f5',  // neutral-100
      'bg-dark': '#171717',       // neutral-900
      'border-dark': '#262626',   // neutral-800
      'secondary-dark' : '#fb923c'
    },
    extend: {
      transitionDuration: {
        '2000': '2000ms',
      },
      fontFamily: {
        nunito: ['Nunito Sans'],
      },
      height: {
        'icons-normal': '36px'
      }
    },
  },
  plugins: [],
}

