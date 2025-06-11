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
    // Optimize for better performance
    target: "esnext",
    minify: "esbuild",
    cssMinify: "esbuild",
    reportCompressedSize: false,
    // Faster builds
    // Optimize bundle splitting for better caching and loading
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-core";
            }
            if (id.includes("@radix-ui") || id.includes("lucide-react")) {
              return "ui-libs";
            }
            if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) {
              return "form-libs";
            }
            if (id.includes("@tanstack/react-query") || id.includes("@supabase")) {
              return "data-libs";
            }
            if (id.includes("react-router")) {
              return "router-lib";
            }
            if (id.includes("recharts") || id.includes("d3")) {
              return "chart-libs";
            }
            return "vendor-misc";
          }
          if (id.includes("/pages/Admin") || id.includes("/pages/CreatePost") || id.includes("/pages/BootstrapAdmin") || id.includes("/components/admin/")) {
            return "admin-features";
          }
          if (id.includes("/pages/BlogPost") || id.includes("/components/Comments") || id.includes("/components/VirtualizedBlogList")) {
            return "blog-features";
          }
          if (id.includes("/pages/Privacy") || id.includes("/pages/Terms") || id.includes("/pages/Cookies") || id.includes("/pages/Newsletter") || id.includes("/pages/RSSPage")) {
            return "static-pages";
          }
          if (id.includes("/utils/") || id.includes("/hooks/")) {
            return "app-utils";
          }
        },
        // Optimize asset filenames for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split("/").pop() : "chunk";
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500
    // More strict limit to encourage better splitting
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "@radix-ui/react-slot"
    ],
    exclude: [
      // Exclude heavy libraries from pre-bundling
      "recharts"
    ]
  },
  // CSS optimizations
  css: {
    devSourcemap: mode === "development",
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  // Preview server optimizations
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBtb2RlID09PSAnYW5hbHl6ZScgJiYgdmlzdWFsaXplcih7XG4gICAgICBmaWxlbmFtZTogJ2Rpc3Qvc3RhdHMuaHRtbCcsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgIH0pLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIEVuYWJsZSBzb3VyY2UgbWFwcyBmb3IgYmV0dGVyIGRlYnVnZ2luZ1xuICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcbiAgICAvLyBPcHRpbWl6ZSBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICBjc3NNaW5pZnk6ICdlc2J1aWxkJyxcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsIC8vIEZhc3RlciBidWlsZHNcbiAgICAvLyBPcHRpbWl6ZSBidW5kbGUgc3BsaXR0aW5nIGZvciBiZXR0ZXIgY2FjaGluZyBhbmQgbG9hZGluZ1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgIC8vIFZlbmRvciBjaHVua3MgLSBzZXBhcmF0ZSBieSBpbXBvcnRhbmNlIGFuZCB1c2FnZSBmcmVxdWVuY3lcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAvLyBDcml0aWNhbCB2ZW5kb3IgY2h1bmsgKGxvYWRlZCBpbW1lZGlhdGVseSlcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QnKSB8fCBpZC5pbmNsdWRlcygncmVhY3QtZG9tJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdyZWFjdC1jb3JlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gVUkgbGlicmFyeSBjaHVuayAobGF6eSBsb2FkZWQpXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0ByYWRpeC11aScpIHx8IGlkLmluY2x1ZGVzKCdsdWNpZGUtcmVhY3QnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3VpLWxpYnMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBGb3JtIGhhbmRsaW5nIGNodW5rXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0LWhvb2stZm9ybScpIHx8IGlkLmluY2x1ZGVzKCdAaG9va2Zvcm0nKSB8fCBpZC5pbmNsdWRlcygnem9kJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdmb3JtLWxpYnMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBEYXRhIGZldGNoaW5nIGNodW5rXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScpIHx8IGlkLmluY2x1ZGVzKCdAc3VwYWJhc2UnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2RhdGEtbGlicyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFJvdXRpbmcgY2h1bmtcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3Qtcm91dGVyJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdyb3V0ZXItbGliJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ2hhcnRzIGFuZCB2aXN1YWxpemF0aW9uIChoZWF2eSwgcmFyZWx5IHVzZWQpXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlY2hhcnRzJykgfHwgaWQuaW5jbHVkZXMoJ2QzJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdjaGFydC1saWJzJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gT3RoZXIgdmVuZG9yIGxpYnJhcmllc1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3ItbWlzYyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIEZlYXR1cmUtYmFzZWQgY29kZSBzcGxpdHRpbmdcbiAgICAgICAgICAvLyBBZG1pbiBmZWF0dXJlcyAoYWRtaW4tb25seSBjb2RlKVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3BhZ2VzL0FkbWluJykgfHwgXG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCcvcGFnZXMvQ3JlYXRlUG9zdCcpIHx8IFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnL3BhZ2VzL0Jvb3RzdHJhcEFkbWluJykgfHxcbiAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJy9jb21wb25lbnRzL2FkbWluLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2FkbWluLWZlYXR1cmVzJztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQmxvZyBmZWF0dXJlcyAoY29tbW9ubHkgdXNlZClcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9wYWdlcy9CbG9nUG9zdCcpIHx8IFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnL2NvbXBvbmVudHMvQ29tbWVudHMnKSB8fFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnL2NvbXBvbmVudHMvVmlydHVhbGl6ZWRCbG9nTGlzdCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Jsb2ctZmVhdHVyZXMnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBTdGF0aWMgcGFnZXMgKGxhenkgbG9hZGVkKVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3BhZ2VzL1ByaXZhY3knKSB8fCBcbiAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJy9wYWdlcy9UZXJtcycpIHx8IFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnL3BhZ2VzL0Nvb2tpZXMnKSB8fFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnL3BhZ2VzL05ld3NsZXR0ZXInKSB8fFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnL3BhZ2VzL1JTU1BhZ2UnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdzdGF0aWMtcGFnZXMnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBVdGlscyBhbmQgaGVscGVyc1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3V0aWxzLycpIHx8IGlkLmluY2x1ZGVzKCcvaG9va3MvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnYXBwLXV0aWxzJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIE9wdGltaXplIGFzc2V0IGZpbGVuYW1lcyBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IChjaHVua0luZm8pID0+IHtcbiAgICAgICAgICBjb25zdCBmYWNhZGVNb2R1bGVJZCA9IGNodW5rSW5mby5mYWNhZGVNb2R1bGVJZCA/IGNodW5rSW5mby5mYWNhZGVNb2R1bGVJZC5zcGxpdCgnLycpLnBvcCgpIDogJ2NodW5rJztcbiAgICAgICAgICByZXR1cm4gYGpzL1tuYW1lXS1baGFzaF0uanNgO1xuICAgICAgICB9LFxuICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgIGNvbnN0IGluZm8gPSBhc3NldEluZm8ubmFtZSEuc3BsaXQoJy4nKTtcbiAgICAgICAgICBjb25zdCBleHQgPSBpbmZvW2luZm8ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKC9wbmd8anBlP2d8c3ZnfGdpZnx0aWZmfGJtcHxpY28vaS50ZXN0KGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBgaW1hZ2VzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoL2Nzcy9pLnRlc3QoZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGBjc3MvW25hbWVdLVtoYXNoXVtleHRuYW1lXWA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV1gO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gT3B0aW1pemUgY2h1bmsgc2l6ZSB3YXJuaW5nc1xuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyBNb3JlIHN0cmljdCBsaW1pdCB0byBlbmNvdXJhZ2UgYmV0dGVyIHNwbGl0dGluZ1xuICB9LFxuICBcbiAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdyZWFjdCcsXG4gICAgICAncmVhY3QtZG9tJyxcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICdAdGFuc3RhY2svcmVhY3QtcXVlcnknLFxuICAgICAgJ0ByYWRpeC11aS9yZWFjdC1zbG90J1xuICAgIF0sXG4gICAgZXhjbHVkZTogW1xuICAgICAgLy8gRXhjbHVkZSBoZWF2eSBsaWJyYXJpZXMgZnJvbSBwcmUtYnVuZGxpbmdcbiAgICAgICdyZWNoYXJ0cydcbiAgICBdXG4gIH0sXG4gIFxuICAvLyBDU1Mgb3B0aW1pemF0aW9uc1xuICBjc3M6IHtcbiAgICBkZXZTb3VyY2VtYXA6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgc2Nzczoge1xuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiO2BcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFxuICAvLyBQcmV2aWV3IHNlcnZlciBvcHRpbWl6YXRpb25zXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiA0MTczLFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgaG9zdDogdHJ1ZVxuICB9XG59KSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNB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
