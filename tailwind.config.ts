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
        black: '#171717',
        gold: '#C8A96B',
        ivory: '#EEE6D8',
        porcelain: '#F8F4EC',
        taupe: '#4D463D'
      }
    }
  },
  plugins: []
} satisfies Config;
