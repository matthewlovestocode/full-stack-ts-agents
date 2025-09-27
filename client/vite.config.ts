import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// See docs/AGENTS.md for frontend conventions; this keeps Vite aligned with React + TS defaults.
export default defineConfig({
  plugins: [react()],
});
