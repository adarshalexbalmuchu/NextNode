
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => {
  return {
    server: {
      host: '::',
      port: 8080,
      cors: true,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8'
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: mode === 'development',
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          format: 'es',
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
          assetFileNames: '[name].[hash].[ext]',
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['@radix-ui/react-slot', 'lucide-react'],
            'router': ['react-router-dom'],
            'query': ['@tanstack/react-query'],
          },
        },
      },
    },
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp'],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        '@radix-ui/react-slot',
        'mammoth',
        'pdfjs-dist',
      ],
      exclude: ['lovable-tagger'],
    },
  };
});
