import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// See docs/AGENTS.md for frontend conventions; this keeps Vite aligned with React + TS defaults.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html']
    }
  }
});
