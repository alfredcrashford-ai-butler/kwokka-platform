import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import gitDescribe from 'git-describe';
import pkg from './package.json';

try {
  const hash = gitDescribe.gitDescribeSync().hash;
  process.env.VITE_APP_VERSION = hash ? `v${pkg.version}.${hash}` : `v${pkg.version}`;
} catch {
  process.env.VITE_APP_VERSION = `v${pkg.version}`;
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    allowedHosts: ['local.kwokka.co'],
    cors: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/framework/_index.scss";',
      },
    },
  },
});
