
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { analyzer } from 'vite-bundle-analyzer';


export default defineConfig({
  plugins: [react(),analyzer()],

  build: {
    // Minify production JavaScript
    // minify: "esbuild",

    // Remove console and debugger in production
    esbuild: {
      drop: ["console", "debugger"],
    },

    // Generate compressed assets
    reportCompressedSize: true,

    // CSS optimization
    cssMinify: true,
    minify:true,

    // Chunk size warning threshold (KB)
    chunkSizeWarningLimit: 500,

  },
});
