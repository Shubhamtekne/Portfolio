import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Build optimizations
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor'
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'animation-vendor'
          if (id.includes('node_modules/lucide-react')) return 'ui-vendor'
          if (id.includes('node_modules/@tanstack/react-query') || id.includes('node_modules/@tanstack/query-core')) return 'query-vendor'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
    sourcemap: false,
    cssMinify: true,
    assetsInlineLimit: 4096,
  },

  // Development server
  server: {
    port: 3000,
    open: false,
  },

  // Preview server
  preview: {
    port: 3000,
  },

  // CSS handling
  css: {
    devSourcemap: false,
  },
})
