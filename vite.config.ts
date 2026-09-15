import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: ['es2015', 'safari13'],
    },
    server: {
      allowedHosts: ['.trycloudflare.com', 'localhost'],
      hmr: process.env.DISABLE_HMR !== 'true',
      
	
      watch: {
        ignored: ['**/data/**'], // Ignorera ändringar i data-mappen så att sidan inte laddas om vid parning
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      env: {
        GEMINI_API_KEY: '',
      },
    },
  };
});
