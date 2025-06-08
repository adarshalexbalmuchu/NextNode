import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'analyze' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
    // Optimize bundle splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'query-vendor': ['@tanstack/react-query'],
          'router-vendor': ['react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          // Feature chunks
          'admin-features': [
            './src/pages/AdminDashboard.tsx',
            './src/components/admin/Analytics.tsx',
            './src/components/admin/PostManagement.tsx',
            './src/components/admin/UserManagement.tsx'
          ],
          'charts': ['recharts'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
}));
