<script setup>
import { useAuthStore } from "~/store/auth-store.js";
const router = useRouter()
const authStore = useAuthStore()
function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nuxt-link to="/auth/login">Login</nuxt-link>
  |
  <nuxt-link to="/customers">Customers</nuxt-link>
  |
  <a href="#" @click.prevent="logout">Logout</a>
  <div>
    <slot />
  </div>
</template>

<style scoped></style>
