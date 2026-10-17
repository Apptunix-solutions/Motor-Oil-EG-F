/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0D10',
        panel: '#14171C',
        elevated: '#1B1F26',
        /* ذهبي ZaytStore */
        orange: '#E8A020',
        /* أخضر ZaytStore العميق */
        green: '#0F3D20',
      },
      fontFamily: {
        /* خط القاهرة يدعم العربية بالكامل — نفس خط الموقع الحي */
        sans: ['Cairo', 'Segoe UI', 'Tahoma', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(232, 160, 32, 0.18)',
      },
    },
  },
  plugins: [],
}
