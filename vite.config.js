import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  define: {
    'THREE.sRGBEncoding': '3001',
  },
  plugins: [
    basicSsl()
  ],
  server: {
    host: true,       // allows network access
    port: 5173,       // optional: keep default port
    https: true,
  }
});
