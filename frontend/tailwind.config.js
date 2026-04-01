/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pi: {
          gold:    '#f0c040',
          purple:  '#7c3aed',
          teal:    '#06b6d4',
          dark:    '#08080f',
        },
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        glass:  '0 8px 32px rgba(0,0,0,0.35)',
        'gold-glow': '0 0 20px rgba(240,192,64,0.4)',
        'purple-glow': '0 0 20px rgba(124,58,237,0.4)',
      },
      animation: {
        'mesh-drift': 'meshDrift 18s ease infinite',
        'badge-pulse': 'badgePulse 1.8s ease-in-out infinite',
        'badge-glow': 'badgeGlow 2.4s ease-in-out infinite',
        'ticker-scroll': 'tickerScroll 24s linear infinite',
        'confetti-fall': 'confettiFall linear forwards',
        'hero-sweep': 'heroSweep 4s ease-in-out infinite',
      },
    },
  },
  safelist: [
    'badge-ending', 'badge-funded', 'badge-new',
    'btn-glow', 'btn-gold', 'card-glow',
    'progress-glow', 'hero-shimmer',
    'bg-cyan-500', 'bg-violet-500', 'bg-amber-500',
    'bg-rose-500', 'bg-emerald-500', 'bg-blue-500',
    'bg-pink-500', 'bg-indigo-500',
  ],
  plugins: [],
}
