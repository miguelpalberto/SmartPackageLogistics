<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h3 class="mt-3 mb-0">User Information</h3>
      </div>
      <div class="card-body">
        <form class="row g-3 needs-validation">
          <div class="col-md-8">
            <div class="mb-3">
              <label for="inputName" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                v-model="customer.username"
                required disabled
              />
            </div>
            <div class="mb-3">
              <label for="inputName" class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                v-model="customer.name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="inputEmail" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                v-model="customer.email"
                required
              />
            </div>
            <div class="mb-3 px-1">
              <label for="inputNIF" class="form-label">NIF</label>
              <input
                type="text"
                class="form-control"
                v-model="customer.nif"
                required
              />
            </div>

            <div class="mb-3 px-1">
              <label for="inputAddress" class="form-label">Address</label>
              <input
                type="text"
                class="form-control"
                v-model="customer.address"
                required
              />
            </div>
          </div>
        </form>
      </div>
      <div class="card-footer">
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-light px-4 me-2">Cancel</button>
          <button
            type="button"
            class="btn btn-primary px-4"
            @click="saveCustomer(customer)"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { useToast } from "vue-toastification";
const authStore = useAuthStore();
const config = useRuntimeConfig();
const api = config.public.API_URL;
const route = useRoute();
const toast = useToast();
const username = route.params.username;

const { data: customer } = await useFetch(`${api}/customers/${username}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authStore.token}`,
  },
});

const saveCustomer = async (customer) => {
  try {
    const response = await fetch(`${api}/customers/${customer.username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: customer.name,
        username: customer.username,
        email: customer.email,
        nif: customer.nif,
        password: customer.password,
        address: customer.address,
      }),
    });

    if (response.ok) {
      toast.success(`Customer ${customer.username} updated successfully`);
      refresh();
    } else {
      toast.error(`Error updating customer ${customer.username}`);
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};
</script>

<style scoped>
.card {
  margin-top: 20px;
}

.card-header {
  background-color: gray;
  color: white;
}

.card-footer {
  background-color: #f8f9fa;
}
</style>
