
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Fix: Property 'cwd' does not exist on type 'Process'. Cast to any to access the Node.js cwd method safely in config.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  const supabaseUrl = (env.VITE_SUPABASE_URL ?? env.SUPABASE_URL ?? '').trim();
  const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY ?? '').trim();

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
            if (id.includes('node_modules/zustand')) return 'vendor-zustand';
            if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
            if (id.includes('node_modules/xlsx')) return 'vendor-xlsx';
            if (id.includes('node_modules/@google/genai')) return 'vendor-genai';
            if (id.includes('node_modules/@supabase')) return 'vendor-supabase';
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    test: {
      globals: true,
      environment: 'node',
      include: ['**/*.test.ts', '**/*.spec.ts'],
      exclude: ['node_modules', 'dist'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand', 'lucide-react', 'xlsx'],
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || process.env.API_KEY || ''),
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || ''),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || process.env.SUPABASE_URL || ''),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''),
      // Ép inject vào client để trạng thái Supabase luôn đúng
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
  };
});
