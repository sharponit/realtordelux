import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Viyra.com',
    short_name: 'Viyra',
    description: 'Luxury real estate, reimagined by SaaSolutions SL for Paradox FZCO.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F4EC',
    theme_color: '#C8A96B',
    icons: [
      {
        src: '/viyra/web/favicons/favicon-256.png',
        sizes: '256x256',
        type: 'image/png'
      }
    ]
  };
}
