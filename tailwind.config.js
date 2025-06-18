/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'bg-primary': '#f8fafc',
        'bg-secondary': '#ffffff',
        'bg-tertiary': '#f1f5f9',
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        'text-muted': '#94a3b8',
        'border-color': '#e2e8f0',
        'border-light': '#f1f5f9',
        'accent-primary': '#3b82f6',
        'accent-secondary': '#1d4ed8',
        'success': '#10b981',
        'danger': '#ef4444',
        'warning': '#f59e0b',
        'info': '#06b6d4',
        
        // Dark theme colors
        'dark-bg-primary': '#1a1a2e',
        'dark-bg-secondary': '#16213e',
        'dark-bg-tertiary': '#0f3460',
        'dark-text-primary': '#e6e6e6',
        'dark-text-secondary': '#b0b0b0',
        'dark-text-muted': '#808080',
        'dark-border-color': '#2d3748',
        'dark-border-light': '#4a5568',
        'dark-accent-primary': '#86a8e7',
        'dark-accent-secondary': '#7f7fd5',
        'dark-success': '#48bb78',
        'dark-danger': '#f56565',
        'dark-warning': '#ed8936',
        'dark-info': '#4299e1',
      },
      animation: {
        'typing': 'typing 1.4s infinite ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        typing: {
          '0%, 80%, 100%': {
            transform: 'scale(0.8)',
            opacity: '0.5',
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 