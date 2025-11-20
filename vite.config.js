/**
 * Vite Configuration
 * 
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite';

export default defineConfig({
  // Base public path
  base: '/',
  
  // Server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    
    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting strategy
          'vendor': ['vitest'],
        },
      },
    },
    
    // Terser options for minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  
  // Test configuration (Vitest)
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.js',
        '**/constants.js',
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules', 'dist'],
  },
  
  // Optimizations
  optimizeDeps: {
    include: [],
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
  },
});
