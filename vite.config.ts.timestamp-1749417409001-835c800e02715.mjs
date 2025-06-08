// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
import { visualizer } from "file:///home/project/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "analyze" && visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Enable source maps for better debugging
    sourcemap: mode === "development",
    // Optimize bundle splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-popover"],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "query-vendor": ["@tanstack/react-query"],
          "router-vendor": ["react-router-dom"],
          "supabase-vendor": ["@supabase/supabase-js"],
          // Feature chunks
          "admin-features": [
            "./src/pages/AdminDashboard.tsx",
            "./src/components/admin/Analytics.tsx",
            "./src/components/admin/PostManagement.tsx",
            "./src/components/admin/UserManagement.tsx"
          ],
          "charts": ["recharts"]
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1e3
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBtb2RlID09PSAnYW5hbHl6ZScgJiYgdmlzdWFsaXplcih7XG4gICAgICBmaWxlbmFtZTogJ2Rpc3Qvc3RhdHMuaHRtbCcsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgIH0pLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIEVuYWJsZSBzb3VyY2UgbWFwcyBmb3IgYmV0dGVyIGRlYnVnZ2luZ1xuICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcbiAgICAvLyBPcHRpbWl6ZSBidW5kbGUgc3BsaXR0aW5nXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIC8vIFZlbmRvciBjaHVua3NcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAndWktdmVuZG9yJzogWydAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JywgJ0ByYWRpeC11aS9yZWFjdC1wb3BvdmVyJ10sXG4gICAgICAgICAgJ2Zvcm0tdmVuZG9yJzogWydyZWFjdC1ob29rLWZvcm0nLCAnQGhvb2tmb3JtL3Jlc29sdmVycycsICd6b2QnXSxcbiAgICAgICAgICAncXVlcnktdmVuZG9yJzogWydAdGFuc3RhY2svcmVhY3QtcXVlcnknXSxcbiAgICAgICAgICAncm91dGVyLXZlbmRvcic6IFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICdzdXBhYmFzZS12ZW5kb3InOiBbJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyddLFxuICAgICAgICAgIC8vIEZlYXR1cmUgY2h1bmtzXG4gICAgICAgICAgJ2FkbWluLWZlYXR1cmVzJzogW1xuICAgICAgICAgICAgJy4vc3JjL3BhZ2VzL0FkbWluRGFzaGJvYXJkLnRzeCcsXG4gICAgICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9hZG1pbi9BbmFseXRpY3MudHN4JyxcbiAgICAgICAgICAgICcuL3NyYy9jb21wb25lbnRzL2FkbWluL1Bvc3RNYW5hZ2VtZW50LnRzeCcsXG4gICAgICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9hZG1pbi9Vc2VyTWFuYWdlbWVudC50c3gnXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnY2hhcnRzJzogWydyZWNoYXJ0cyddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIE9wdGltaXplIGNodW5rIHNpemUgd2FybmluZ3NcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxrQkFBa0I7QUFKM0IsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsSUFDMUMsU0FBUyxhQUFhLFdBQVc7QUFBQSxNQUMvQixVQUFVO0FBQUEsTUFDVixNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsSUFDZCxDQUFDO0FBQUEsRUFDSCxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsV0FBVyxTQUFTO0FBQUE7QUFBQSxJQUVwQixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUE7QUFBQSxVQUVaLGdCQUFnQixDQUFDLFNBQVMsV0FBVztBQUFBLFVBQ3JDLGFBQWEsQ0FBQywwQkFBMEIsaUNBQWlDLHlCQUF5QjtBQUFBLFVBQ2xHLGVBQWUsQ0FBQyxtQkFBbUIsdUJBQXVCLEtBQUs7QUFBQSxVQUMvRCxnQkFBZ0IsQ0FBQyx1QkFBdUI7QUFBQSxVQUN4QyxpQkFBaUIsQ0FBQyxrQkFBa0I7QUFBQSxVQUNwQyxtQkFBbUIsQ0FBQyx1QkFBdUI7QUFBQTtBQUFBLFVBRTNDLGtCQUFrQjtBQUFBLFlBQ2hCO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBLFVBQ0EsVUFBVSxDQUFDLFVBQVU7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
