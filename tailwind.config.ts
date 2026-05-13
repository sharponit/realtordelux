/**
 * Viyra.com™
 * Developed by SaaSolutions SL
 * Intellectual Property owned by Paradox FZCO
 * © 2026 Paradox FZCO. All rights reserved.
 */
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#081225',
        gold: '#C8A25D',
        ivory: '#F8F6F2'
      }
    }
  },
  plugins: []
} satisfies Config;
