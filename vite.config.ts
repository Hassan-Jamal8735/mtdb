import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import laravel from 'laravel-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import replace from '@rollup/plugin-replace';

// keep manifest paths relative to Laravel's public path
function basePath(): Plugin {
  return {
    name: 'relative-base-path',
    enforce: 'post',
    config: () => ({ base: '' }),
  };
}

export default defineConfig({
  server: {
    host: '127.0.0.1', // ✅ use same host as Laravel
    port: 5173,
    hmr: {
      host: '127.0.0.1', // ✅ ensure HMR matches
    },
  },

  base: '',

  build: {
    manifest: true, // ✅ ensures manifest.json is generated
    outDir: 'public/build', // ✅ matches Laravel’s public path
    sourcemap: true,
    rollupOptions: {
      external: ['puppeteer'],
    },
  },

  resolve: {
    preserveSymlinks: true,
  },

  plugins: [
    tsconfigPaths(),
    react(),
    laravel({
      input: ['resources/client/main.tsx'],
      refresh: true, // ✅ you can turn this on for auto-reload
    }),
    basePath(),
    replace({
      preventAssignment: true,
      __SENTRY_DEBUG__: false,
      "import { URL } from 'url'": false,
    }),
  ],
});
