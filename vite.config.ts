import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@store': path.resolve(__dirname, './src/store'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@data': path.resolve(__dirname, './data'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/law-proxy': {
        target: 'http://www.law.go.kr',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL('http://localhost' + path);
          const targetUrl = url.searchParams.get('url');
          if (targetUrl) {
            const parsedUrl = new URL(targetUrl);
            return parsedUrl.pathname + parsedUrl.search;
          }
          return path;
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});