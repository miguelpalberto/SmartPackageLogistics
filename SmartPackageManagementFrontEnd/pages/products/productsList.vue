<template>
  <div class="container mt-5">
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <h1>Products Management</h1>
        <br />
        <div
          v-if="isLogistician"
          class="d-grid gap-5 d-md-flex justify-content-md-end"
        >
          <button
            type="button"
            class="btn btn-info"
            @click="importProducts"
            disabled
          >
            Import Products
          </button>
          <button type="button" class="btn btn-info" @click="exportProducts">
            Export Products
          </button>
        </div>
        <br />
        <div class="row mb-3">
          <div class="col-md-3">
            <label>Reference</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Search by Reference"
              v-model="searchTerm.reference"
              @input="handleSearch"
            />
          </div>
          <div class="col-md-3">
            <label>Name</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Search by name"
              v-model="searchTerm.name"
              @input="handleSearch"
            />
          </div>
          <div class="col-md-3">
            <label>Category</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Search by Category"
              v-model="searchTerm.category"
              @input="handleSearch"
            />
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 10%">Product Reference</th>
              <th style="width: 40%">Product Name</th>
              <th style="width: 20%">Product Category</th>
              <th style="width: 15%">Manage Product</th>
              <th v-if="isManufacturer" style="width: 15%">Manage Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.reference }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.productCategory }}</td>
              <td>
                <nuxt-link :to="`/products/${product.id}`">
                  <button
                  class="btn btn-info btn-sm">
                  <i class="bi bi-xs bi-eye"></i>
                </button>
                </nuxt-link>
              </td>
              <td v-if="isManufacturer">
                <nuxt-link :to="`/products/stockEntry/${product.id}`">
                  <button
                  class="btn btn-success btn-sm">
                  <i class="bi bi-xs bi-plus-square"></i>
                </button>
                  </nuxt-link
                >
              </td>
            </tr>
          </tbody>
        </table>
        <pagination :metadata="metadata" :changePage="changePage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { useRoute } from "vue-router";
import Pagination from "../pagination.vue";
const route = useRoute();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const successMessage = ref(route.query.successMessage || "");
const api = config.public.API_URL;
const searchTerm = ref({
  reference: "",
  name: "",
  category: "",
});

const currentPage = ref(1);
const pageSize = ref(20);
const metadata = ref({});
const products = ref([]);
const isManufacturer = authStore.user.role == "Manufacturer";
const isLogistician = authStore.user.role == "LogisticsOperator";

const exportProducts = async () => {
  try {
    const response = await fetch(`${api}/products/export`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (!response.ok) {
      // Handle error response if needed
      console.error(`Export failed with status ${response.status}`);
      return;
    }

    const blob = await response.blob();

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "exported_products.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const fetchData = async () => {
  const queryParams = new URLSearchParams();
  let response = ref(null);

  if (searchTerm.value.reference) {
    queryParams.append("reference", searchTerm.value.reference);
  }
  if (searchTerm.value.name) {
    queryParams.append("name", searchTerm.value.name);
  }
  if (searchTerm.value.category) {
    queryParams.append("category", searchTerm.value.category);
  }

  if (authStore.user.role != "Manufacturer") {
    response = await useFetch(
      `${api}/products/all?pageSize=20&page=${
        currentPage.value
      }&${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );
  } else {
    response = await useFetch(
      `${api}/manufacturers/${
        authStore.user.username
      }/products?pageSize=20&page=${
        currentPage.value
      }&${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );
  }
  products.value = response.data.value.data;
  metadata.value = response.data.value.metadata;
};

const changePage = (newPage) => {
  if (newPage > 0 && newPage <= metadata.value.totalPages) {
    currentPage.value = newPage;
    fetchData();
  }
};

onMounted(() => {
  if (!authStore.user) {
    router.push("/auth/login");
  }
  fetchData();
});
</script>

<style scoped>
.table {
  width: 100%;
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
