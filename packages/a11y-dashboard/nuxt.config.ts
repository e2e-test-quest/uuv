import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: 'src',
  devtools: { enabled: true },
  devServer: {
    host: 'localhost',
    port: 4300,
  },
  typescript: {
    typeCheck: true,
    tsConfig: {
      extends: './tsconfig.app.json',
    },
  },
  imports: {
    autoImport: true,
  },

  css: ['~/assets/css/styles.css'],

  vite: {
    plugins: [
      nxViteTsPaths()
    ]
  },

  modules: [
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        files: ['en.json']
      }
    ],
    langDir: './lang',
    defaultLocale: 'en'
  },

  plugins: [
    { src: '~/plugins/vue-masonry', ssr: false }
  ],

  ssr: false,

  app: {
    head: {
      title: 'UUV A11y Dashboard'
    }
  }
});
