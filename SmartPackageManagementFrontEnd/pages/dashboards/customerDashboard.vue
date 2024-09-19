<template>
  <div v-if="!loading && totalOrders && topProducts" class="container mt-5">
    <div class="d-flex justify-content-center">
      <div class="mb-3">
        <h1 class="h1">Customer Dashboard</h1>
      </div>
    </div>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-4">
          <div class="card bg-gray rounded-lg shadow mb-4">
            <div class="card-body">
              <h2 class="card-title text-xl font-bold mb-4">Total Orders</h2>
              <p class="card-text">{{ totalOrders }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-gray rounded-lg shadow mb-4">
            <div class="card-body">
              <h2 class="card-title text-xl font-bold mb-4">Pending Orders</h2>
              <p class="card-text">{{ totalPendingOrders }}</p>
            </div>
          </div>
        </div>
      </div>
      <p></p>
      <p></p>
      <p></p>

      <div class="row">
        <div class="col-md-12">
          <h3 class="mb-4">Top 10 Products most purchased</h3>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 33%">Product Reference</th>
                <th style="width: 33%">Product Name</th>
                <th style="width: 33%">Total Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="topProduct in topProducts.value"
                :key="topProduct.productReference"
              >
                <td>{{ topProduct.productReference }}</td>
                <td>{{ topProduct.productName }}</td>
                <td>{{ topProduct.totalOrders }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p v-if="loading">Loading...</p>
    <p v-if="error">Error loading data.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";

const authStore = useAuthStore();
const loading = ref(true);
const error = ref(false);
const config = useRuntimeConfig();
const api = config.public.API_URL;
const totalOrders = ref(0);
const totalPendingOrders = ref(0);
const topProducts = ref(null);

const fetchData = async () => {
  try {
    const response = await useFetch(
      `${api}/statistics/${authStore.user.username}/orders`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    const response2 = await useFetch(
      `${api}/statistics/${authStore.user.username}/orders?status=PENDING`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    const response3 = await useFetch(
      `${api}/statistics/${authStore.user.username}/topProducts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    totalOrders.value = response.data.value.metadata.totalItems;
    totalPendingOrders.value = response2.data.value.metadata.totalItems;
    topProducts.value = response3.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!authStore.user) {
    navigateTo("/auth/login");
  }
  if (authStore.user.role != "Customer") {
    navigateTo("/");
  }
  fetchData();
});
</script>

<style scoped>
.card {
  height: 100%;
}
.table {
  width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #6c757d;
  color: white;
}
</style>
