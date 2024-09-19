<template>
  <div v-if="!loading && totals" class="container mt-5">
    <div class="d-flex justify-content-center">
      <div class="mb-3">
        <h1 class="h1">Manufacturer Dashboard</h1>
      </div>
    </div>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-4">
          <div class="card bg-gray rounded-lg shadow mb-4">
            <div class="card-body">
              <h2 class="card-title text-xl font-bold mb-4">Total Products</h2>
              <p class="card-text">{{ totals.value.totalProducts }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card bg-gray rounded-lg shadow mb-4">
            <div class="card-body">
              <h2 class="card-title text-xl font-bold mb-4">Active Products</h2>
              <p class="card-text">{{ totals.value.totalActiveProducts }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card bg-gray rounded-lg shadow mb-4">
            <div class="card-body">
              <h2 class="card-title text-xl font-bold mb-4">
                Inactive Products
              </h2>
              <p class="card-text">{{ totals.value.totalInactiveProducts }}</p>
            </div>
          </div>
        </div>
      </div>
      <p></p>
      <p></p>
      <p></p>

      <div class="row">
        <div class="col-md-6">
          <h3 class="mb-4">Top 10 Products</h3>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 33%">Product Reference</th>
                <th style="width: 33%">Product Name</th>
                <th style="width: 33%">Total</th>
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
        <div class="col-md-6">
          <h3 class="mb-4">Products out of stock</h3>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 33%">Product Reference</th>
                <th style="width: 33%">Product Name</th>
                <th style="width: 33%">Total Orders</th>
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
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";

const authStore = useAuthStore();
const totals = ref([]);
const topProducts = ref([]);
const productsOutStock = ref([]);
const loading = ref(true);
const error = ref(false);
const config = useRuntimeConfig();
const api = config.public.API_URL;

const fetchData = async () => {
  try {
    const response = await useFetch(
      `${api}/statistics/${authStore.user.username}/productTotals`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    const response2 = await useFetch(
      `${api}/statistics/${authStore.user.username}/topProductsManufacturer`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    const response3 = await useFetch(
      `${api}/statistics/${authStore.user.username}/outOfStockWithPendingOrders`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    totals.value = response.data;
    topProducts.value = response2.data;
    productsOutStock.value = response3.data;
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
  if (authStore.user.role != "Manufacturer") {
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
