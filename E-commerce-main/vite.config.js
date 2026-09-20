import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    obfuscatorPlugin({
      // Build only. Running the obfuscator during `vite dev` rewrites every
      // module on the fly: it is slow, and it makes dev-only bugs invisible to
      // the source maps. Production bundles stay obfuscated.
      apply: 'build',
      // stringArray & splitStrings disabled: they break Vite's dynamic import
      // resolution and prevent code splitting (lazy-loaded routes).
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true,
        debugProtectionInterval: 4000,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        // stringArray & splitStrings MUST stay disabled — they obfuscate
        // dynamic import() paths (e.g. import("./pages/Home")) into runtime
        // function calls that Vite cannot statically analyse, which completely
        // breaks route-level code splitting.
        splitStrings: false,
        stringArray: false,
        unicodeEscapeSequence: false
      },
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false, // Ensures no source map is generated
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 400,
  }
})
