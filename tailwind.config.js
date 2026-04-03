/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* Semantic Color Tokens */
      colors: {
        /* Base colors */
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        /* Card colors */
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        
        /* Popover colors */
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        
        /* Primary - Vibrant Purple */
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
          foreground: 'var(--primary-foreground)',
        },
        
        /* Secondary */
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        
        /* Muted */
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        
        /* Accent */
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        
        /* Destructive */
        destructive: {
          DEFAULT: 'var(--destructive)',
          light: 'var(--destructive-light)',
          foreground: 'var(--destructive-foreground)',
        },
        
        /* Border & Input */
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        
        /* Surface hierarchy */
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          4: 'var(--surface-4)',
          5: 'var(--surface-5)',
        },
        
        /* Type colors for badges */
        type: {
          text: 'var(--type-text)',
          'text-bg': 'var(--type-text-bg)',
          image: 'var(--type-image)',
          'image-bg': 'var(--type-image-bg)',
          link: 'var(--type-link)',
          'link-bg': 'var(--type-link-bg)',
          note: 'var(--type-note)',
          'note-bg': 'var(--type-note-bg)',
        },
      },
      
      /* Border Radius */
      borderRadius: {
        'sm': '0.5rem',
        'DEFAULT': '0.75rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        'full': '9999px',
      },
      
      /* Shadows - Soft & Layered */
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
        'DEFAULT': '0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4)',
        'xl': '0 12px 48px rgba(0, 0, 0, 0.6), 0 6px 16px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-sm': '0 0 12px rgba(139, 92, 246, 0.2)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      
      /* Font Family */
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      
      /* Font Weight */
      fontWeight: {
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      
      /* Animation */
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse': 'pulse 2s ease-in-out infinite',
        'bounce': 'bounce 1.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      
      /* Keyframes */
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.95)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      
      /* Transition timing */
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      
      /* Transition timing function */
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      /* Spacing */
      spacing: {
        '4.5': '1.125rem',
        '8.5': '2.125rem',
      },
      
      /* Backdrop blur */
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
