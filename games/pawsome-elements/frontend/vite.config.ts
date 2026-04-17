import { defineConfig, loadEnv, Plugin } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { fileURLToPath, URL } from 'node:url';
import { VitePWA } from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue';
import { getFilesMeta } from './vite/files-meta-heper';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import gitDescribe from 'git-describe';
import pkg from './package.json';

function setupAppVersion(): void {
  try {
    const hash = gitDescribe.gitDescribeSync().hash;
    process.env.VITE_APP_VERSION = hash ? `v${pkg.version}.${hash}` : `v${pkg.version}`;
  } catch {
    process.env.VITE_APP_VERSION = `v${pkg.version}`;
  }
}

async function setupResourcesMeta(): Promise<void> {
  process.env.VITE_APP_RESOURCES_META = JSON.stringify(await getFilesMeta('public/static', '/static'));
}

function setupProdPlugins(env: Record<string, string>) {
  if ((env.NODE_ENV || process.env.NODE_ENV) !== 'production') {
    return [];
  }

  return [
    sentryVitePlugin({
      org: 'kwokka',
      project: 'pawsome-elements-frontend',
      sourcemaps: {
        filesToDeleteAfterUpload: ['**/*.js.map'],
      },
      telemetry: false,
    }),
  ];
}

function setupDevPlugins(env: Record<string, string>) {
  const plugins: Plugin[] = [];
  if ((env.NODE_ENV || process.env.NODE_ENV) === 'production') {
    return plugins;
  }

  // Uncomment, if HTTPS is needed during development to test https requiring features i.e. Cache API.
  // plugins.push(basicSsl({}));

  return plugins;
}

function setupPwaPlugin(env: Record<string, string>) {
  return VitePWA({
    injectRegister: 'script-defer',
    registerType: 'prompt',
    workbox: {
      globPatterns: [],
      cleanupOutdatedCaches: true,
      maximumFileSizeToCacheInBytes: 10_000_000,
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/static/'),
          handler: 'CacheFirst',
          options: {
            cacheName: env.VITE_APP_RESOURCES_CACHE_NAME,
          },
        },
        {
          urlPattern: /^https:\/\/app\.kwokka\.co\/.*$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: env.VITE_APP_KWOKKA_CACHE_NAME,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
      ],
    },
    manifest: {
      name: 'Pawsome Elements - Free Online Multiplayer Card Game',
      short_name: 'Pawsome Elements',
      description: 'Free online multiplayer card game about dog-mages in your browser.',
      icons: [
        {
          src: '/icons/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icons/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
      categories: ['games'],
      theme_color: '#3a260c',
      background_color: '#3a260c',
      display: 'fullscreen',
      orientation: 'landscape-primary',
      id: 'pawsome_elements',
      start_url: 'https://app.pawsome-elements.com',
      dir: 'ltr',
    },
  });
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  setupAppVersion();
  await setupResourcesMeta();

  const vuePlugin = vue();
  const pwaPlugin = setupPwaPlugin(env);
  const prodPlugins = setupProdPlugins(env);
  const devPlugins = setupDevPlugins(env);

  // https://vitejs.dev/config/
  return {
    server: {
      port: 9000,
      allowedHosts: ['local.kwokka.co'],
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
    plugins: [vuePlugin, pwaPlugin, ...devPlugins, ...prodPlugins],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            phaser: ['phaser'],
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/framework/_index.scss";',
        },
      },
    },
  };
});
