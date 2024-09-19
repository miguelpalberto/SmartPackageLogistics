// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false,
    runtimeConfig: {
        public: {
            API_URL:
                process.env.API_URL ||
                "http://localhost:8080/SmartPackageManagement/api",
        },
    },
    modules: ["@pinia/nuxt"],
    css: [
        "~/assets/styles/main.scss",
        "bootstrap-vue/dist/bootstrap-vue.css",
        "bootstrap-icons/font/bootstrap-icons.css",
    ],
});
