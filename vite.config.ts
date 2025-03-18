import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import type { UserConfigFnObject } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import type { ImportMetaEnv } from './src/vite-env'

// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') as unknown as ImportMetaEnv
  return {
    root: './src',
    publicDir: '../public',
    resolve: {
      alias: {
        $BOOTSTRAP_PATH: env?.ENABLE_BOOTSTRAP_REBOOT === 'true'
          ? 'bootstrap/scss/bootstrap'
          : 'bootstrap-no-reboot',
      },
    },
    plugins: [
      createHtmlPlugin({ minify: true }),
    ],
    build: {
      outDir: '../dist',
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        input: {
          main: resolve(__dirname, './src/index.html'),
          checkout: resolve(__dirname, './src/checkout.html'),
          about: resolve(__dirname, './src/about.html'),
          convertColors: resolve(__dirname, './src/convertColours.html'),
          creditcard: resolve(__dirname, './src/creditcard.html'),
          instructions: resolve(__dirname, './src/instructions.html'),
        },
      },
    },
    esbuild: {
      legalComments: 'none',
      minifySyntax: true,
      minifyWhitespace: true,
      minifyIdentifiers: true,
      platform: 'browser',
    },
  }
}) satisfies UserConfigFnObject
