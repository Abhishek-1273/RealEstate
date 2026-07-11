import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers — smaller output, no legacy transforms
    target: 'esnext',
    cssMinify: true,
    sourcemap: false,
    // Skip reporting compressed sizes during build for faster CI builds
    reportCompressedSize: false,
    // Inline assets smaller than 4KB directly into JS/CSS to save requests
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js — very large 3D library, isolated so pages without Globe don't pay the cost
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/three-stdlib') ||
            id.includes('node_modules/@react-three')
          ) {
            return 'vendor-three';
          }

          // Leaflet — map library, only loaded on pages that use InteractiveMap
          if (id.includes('node_modules/leaflet')) {
            return 'vendor-leaflet';
          }

          // React core — cache-busted independently from other vendor code
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')
          ) {
            return 'vendor-framework';
          }

          // Swiper — slider library
          if (id.includes('node_modules/swiper')) {
            return 'vendor-swiper';
          }

          // Framer Motion — animation library
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer-motion';
          }

          // All other node_modules in one shared chunk
          if (id.includes('node_modules')) {
            return 'vendor-libs';
          }
        },
      },
    },
  },
})
