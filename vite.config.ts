// FIX: Add a triple-slash directive to include Node.js types. This ensures that 
// the `process` global object has the correct type definitions, including `cwd()`.
/// <reference types="node" />

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // This 'define' block makes Node.js global variables available in client-side
    // code. Vite performs a direct text replacement during the build process.
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
  }
})