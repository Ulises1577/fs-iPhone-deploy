/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cupertino: {
          blue: '#0071E3',
          'blue-hover': '#0077ED',
          dark: '#1D1D1F',
          slate: '#86868B',
          canvas: '#F5F5F7',
          'canvas-pure': '#F9F9FB',
          border: 'rgba(0, 0, 0, 0.08)',
          'border-light': 'rgba(0, 0, 0, 0.05)',
          destructive: '#FF3B30',
          'destructive-soft': 'rgba(255, 59, 48, 0.08)',
          glass: 'rgba(255, 255, 255, 0.72)',
          'glass-elevated': 'rgba(255, 255, 255, 0.85)',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ]
      },
      letterSpacing: {
        'display': '-0.03em',
        'headline': '-0.025em',
        'subheadline': '-0.015em',
        'label-tight': '-0.005em',
        'label-wide': '0.02em',
        'label-wider': '0.04em'
      },
      boxShadow: {
        'rim': 'inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'apple-lg': '0 12px 32px rgba(0, 0, 0, 0.06)',
        'apple-xl': '0 24px 60px rgba(0, 0, 0, 0.12)',
        'glow-blue': '0 0 0 3px rgba(0, 113, 227, 0.15)',
      },
      borderRadius: {
        'squircle': '16px',
        'squircle-lg': '20px',
        'squircle-xl': '24px'
      }
    },
  },
  plugins: [],
}
