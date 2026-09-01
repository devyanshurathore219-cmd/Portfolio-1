import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Bundled JS/CSS go to dist/build/ so they never collide with the
    // verbatim public/assets/ folder that gets copied to dist/assets/.
    assetsDir: 'build',
  },
});
