import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./lib', import.meta.url)),
    },
  },
  plugins: [dts({ rollupTypes: true })],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'KwokkaCookieConsent',
      fileName: 'kwokka-cookie-consent',
    },
  },
});
