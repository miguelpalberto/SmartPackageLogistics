<template>
  <div class="container mt-2">
    <div class="row justify-content-center">
      <img
        class="img-fluid mb-5"
        src="/logo.png"
        style="max-width: 800px"
        alt="Logo"
      />
      <div class="col-12">
        <div class="card shadow">
          <form class="p-4" @submit.prevent="login">
            <h3 class="mb-3 text-center">Login</h3>
            <hr />

            <div class="mb-3">
              <label for="inputUsername" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="inputUsername"
                required
                v-model="loginFormData.username"
              />
            </div>

            <div class="mb-3">
              <label for="inputPassword" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="inputPassword"
                required
                v-model="loginFormData.password"
              />
            </div>

            <div class="d-grid gap-2 col-md-4 mx-auto">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from "~/store/auth-store.js";
import { useCartStore } from "~/store/cart";
import { useToast } from "vue-toastification";
const authStore = useAuthStore();
const cartStore = useCartStore();
const config = useRuntimeConfig();
const toast = useToast();
const api = config.public.API_URL;
const loginFormData = ref({
  username: "",
  password: "",
});
const messages = ref([]);

const login = async () => {
  const { data, error } = await useFetch(`${api}/auth/login`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: loginFormData.value,
  });
  if (error.value) {
    toast.error(error.value.data);
    return;
  }

  try {
    sessionStorage.setItem("token", data.value);
    authStore.loadUser(data.value).then(() => {
      cartStore.loadCart();
      if (authStore.isCustomer) {
        if (cartStore.count > 0) {
          navigateTo("/cart");
          return;
        }
      } else {
        cartStore.clear();
      }
    });
  } catch (error) {
    messages.value.push({ userError: error.message });
    return;
  }

  navigateTo("/");
};
</script>
<style scoped>
.card {
  border: none;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
