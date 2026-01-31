import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Environment variables are handled automatically by Vite via import.meta.env
  // Variables must be prefixed with VITE_ to be exposed to client code
  build: {
    // Tối ưu hóa build
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react'],
          'utils-vendor': ['zustand', 'xlsx'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'zustand', 'xlsx'],
  },
});
