// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@vueuse/nuxt', '@nuxt/ui', 'nitro-cloudflare-dev'],

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    database: {
      url: process.env.DATABASE_URL,
    },
  },

  build: {
    transpile: ['trpc-nuxt'],
  },

  compatibilityDate: '2025-05-15',

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },

    database: {
      default: {
        connector: 'cloudflare-d1',
        options: {
          databaseURL: process.env.DATABASE_URL,
        },
      },
    },
  },

  typescript: {
    typeCheck: true,
    strict: true,
  },

  eslint: {
    checker: true,
    config: { stylistic: true },
  },
})
