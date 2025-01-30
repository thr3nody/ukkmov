// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@sidebase/nuxt-auth"],

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true
  },
  runtimeConfig: {
    baseURL: '/api/auth'
  },
  auth: {
    // globalAppMiddleware: true,
    originEnvKey: 'NUXT_BASE_URL',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post'},
        signUp: { path: '/register', method: 'post'},
        signOut: { path: '/logout', method: 'post'},
        getSession: { path: '/session', method: 'get'}
      },
      pages: {
        login: 'login'
      }
    },
  }
});
