import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl()
  ],
  server: {
    host: true,       // allows network access
    port: 5173,       // optional: keep default port
    strictPort: true, // ensures it doesn't fall back to another port
    https: true,
  }
});
