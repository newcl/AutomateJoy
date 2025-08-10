import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // important for loading assets in production
  // build: {
  //   outDir: path.resolve(__dirname, '../dist/frontend'), // go up to electron root
  //   emptyOutDir: true
  // }
})
