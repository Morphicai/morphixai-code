import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    // Define __DEBUG_MODE__ based on the environment
    __DEBUG_MODE__: mode === 'development'
  },
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
}));