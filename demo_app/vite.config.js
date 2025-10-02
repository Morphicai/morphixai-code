import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: {
      '@': '/src/app',
      '@components': '/src/app/components',
      '@styles': '/src/app/styles',
      '@utils': '/src/app/utils',
    },
  },
  publicDir: 'public',
  server: {
    port: 8812,
    open: true,
    host: 'localhost'
  }
});