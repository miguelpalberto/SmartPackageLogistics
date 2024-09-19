<template>
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="changePassword"
  >
    <h3 class="mt-5 mb-3">Change Password</h3>
    <hr />

    <div class="row">
      <div class="mb-3 col-6">
        <label for="inputPassword" class="form-label">New Password</label>
        <div class="input-group">
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            required
            v-model="passwords.newPassword"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="togglePasswordVisibility"
          >
            <i v-if="showPassword" class="bi bi-eye"></i>
            <i v-else class="bi bi-eye-slash"></i>
          </button>
        </div>
      </div>
      <div class="mb-3 col-6">
        <label for="inputPasswordConfirm" class="form-label"
          >Password Confirmation</label
        >
        <div class="input-group">
          <input
            type="password"
            class="form-control"
            id="inputPasswordConfirm"
            required
            v-model="passwords.confirmPassword"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="togglePasswordConfirmVisibility"
          >
            <i v-if="showPasswordConfirm" class="bi bi-eye"></i>
            <i v-else class="bi bi-eye-slash"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="mb-3 d-flex justify-content-center">
      <button
        type="button"
        class="btn btn-primary px-5"
        @click="changePassword"
      >
        Change Password
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const config = useRuntimeConfig();
const api = config.public.API_URL;

const toast = useToast();

const passwords = ref({
  newPassword: "",
  confirmPassword: "",
});

const errors = ref(null);

const changePassword = async () => {
  try {
    const { response, error } = await useFetch(`${api}/auth/set-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        newPassword: passwords.value.newPassword,
        confirmPassword: passwords.value.confirmPassword,
      }),
    });

    if (response) {
      toast.success(`Password updated successfully`);
    } else {
      toast.error(error.value.data);
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
  const inputPassword = document.getElementById("inputPassword");
  inputPassword.type = showPassword.value ? "text" : "password";
};

const togglePasswordConfirmVisibility = () => {
  showPasswordConfirm.value = !showPasswordConfirm.value;
  const inputPasswordConfirm = document.getElementById("inputPasswordConfirm");
  inputPasswordConfirm.type = showPasswordConfirm.value ? "text" : "password";
};
</script>
