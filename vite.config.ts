import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  root: './src',
  publicDir: '../public',
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
})
