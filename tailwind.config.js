/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1A5480',
          50: '#E6F0F7',
          100: '#CCE1EF',
          200: '#99C3DF',
          300: '#66A5CF',
          400: '#3387BF',
          500: '#1A5480',
          600: '#154366',
          700: '#10324D',
          800: '#0A2133',
          900: '#05101A',
        },
        pastel: {
          blue: '#E3F2FD',
          green: '#E8F5E9',
          peach: '#FFF3E0',
          pink: '#FCE4EC',
          yellow: '#FFF9C4',
          purple: '#F3E5F5',
        },
        deepBlue: '#004573',
        backGround: '#EFF8FF',
        textGray:  '#313e44',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      backgroundImage: {
        'light-blue-gradient': 'linear-gradient(180deg, rgba(221,241,255,0.4) 0%, rgba(255,255,255,0.4) 24.11%)',
      },
    },
  },
  plugins: [],
}
