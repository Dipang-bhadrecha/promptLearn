// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [require('@tailwindcss/typography')],

// };


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'system': [
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Helvetica Neue', 
          'Arial', 
          'sans-serif'
        ],
        'mono': [
          'Victor Mono', 
          'Consolas', 
          'Monaco', 
          'Courier New', 
          'monospace'
        ],
      },
      fontSize: {
        // ChatGPT-optimized desktop font sizes
        'chat-sm': ['14px', { lineHeight: '1.43' }],
        'chat-base': ['16px', { lineHeight: '1.6' }],
        'chat-lg': ['18px', { lineHeight: '1.56' }],
        'chat-xl': ['20px', { lineHeight: '1.5' }],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch', // Optimal reading width for desktop
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            // Remove default code styling to use custom components
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            // Ensure proper spacing
            'p': {
              marginBottom: '1rem',
            },
            'ul': {
              marginBottom: '1rem',
            },
            'ol': {
              marginBottom: '1rem',
            },
          },
        },
        // Dark mode typography
        invert: {
          css: {
            color: '#e5e5e5',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
