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
    sourcemap: true
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: {
      '@': '/src/console',
      '@components': '/src/console/components',
      '@styles': '/src/console/styles',
      '@utils': '/src/console/utils',
    },
  }
});