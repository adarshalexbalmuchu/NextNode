import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'analyze' &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Force lodash to use ES6 modules (lodash-es) for better compatibility
      'lodash/get': 'lodash-es/get',
      'lodash/isString': 'lodash-es/isString',
      'lodash/isNaN': 'lodash-es/isNaN',
      'lodash/isNumber': 'lodash-es/isNumber',
    },
  },
  build: {
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
    // Optimize for better performance
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'esbuild',
    reportCompressedSize: false, // Faster builds
    // Optimize bundle splitting for better caching and loading
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Vendor chunks - separate by importance and usage frequency
          if (id.includes('node_modules')) {
            // Critical vendor chunk (loaded immediately)
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-core';
            }

            // UI library chunk (lazy loaded)
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-libs';
            }

            // Form handling chunk
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-libs';
            }

            // Data fetching chunk
            if (id.includes('@tanstack/react-query') || id.includes('@supabase')) {
              return 'data-libs';
            }

            // Routing chunk
            if (id.includes('react-router')) {
              return 'router-lib';
            }

            // Charts and visualization (heavy, rarely used)
            if (id.includes('recharts') || id.includes('d3')) {
              return 'chart-libs';
            }

            // Other vendor libraries
            return 'vendor-misc';
          }

          // Feature-based code splitting
          // Admin features (admin-only code)
          if (
            id.includes('/pages/Admin') ||
            id.includes('/pages/CreatePost') ||
            id.includes('/pages/BootstrapAdmin') ||
            id.includes('/components/admin/')
          ) {
            return 'admin-features';
          }

          // Blog features (commonly used)
          if (
            id.includes('/pages/BlogPost') ||
            id.includes('/components/Comments') ||
            id.includes('/components/VirtualizedBlogList')
          ) {
            return 'blog-features';
          }

          // Static pages (lazy loaded)
          if (
            id.includes('/pages/Privacy') ||
            id.includes('/pages/Terms') ||
            id.includes('/pages/Cookies') ||
            id.includes('/pages/Newsletter') ||
            id.includes('/pages/RSSPage')
          ) {
            return 'static-pages';
          }

          // Utils and helpers
          if (id.includes('/utils/') || id.includes('/hooks/')) {
            return 'app-utils';
          }
        },
        // Optimize asset filenames for better caching
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
        assetFileNames: assetInfo => {
          const info = assetInfo.name!.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500, // More strict limit to encourage better splitting
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@radix-ui/react-slot',
      'lodash/get',
      'lodash/isString',
      'lodash/isNaN',
      'lodash/isNumber',
    ],
    exclude: [
      // Keep recharts in exclude to avoid pre-bundling issues
    ],
  },

  // CSS optimizations
  css: {
    devSourcemap: mode === 'development',
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Preview server optimizations
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
  },
}));
