<template>
  <store-catalog v-if="!authStore.isAuthenticated || authStore.isCustomer" />
</template>
<script setup>
import { useAuthStore } from "~/store/auth-store.js";
const authStore = useAuthStore();
</script>
