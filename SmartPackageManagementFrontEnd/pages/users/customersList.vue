<template>
  <div class="container mt-5">
    <h1>Customer Management</h1>
    <div class="row mb-3">
      <div class="col-md-3">
        <label>Username</label>
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Search by username"
          v-model="searchTerm.username"
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
        <label>Nif</label>
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Search by nif"
          v-model="searchTerm.nif"
          @input="handleSearch"
        />
      </div>
      <div class="col-md-3">
        <label>Email</label>
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Search by email"
          v-model="searchTerm.email"
          @input="handleSearch"
        />
      </div>
      <div class="col-md-12">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 20%">Username</th>
              <th style="width: 20%">Name</th>
              <th style="width: 20%">NIF</th>
              <th style="width: 20%">Email</th>
              <th style="width: 20%">Orders</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.username">
              <td>{{ customer.username }}</td>
              <td>{{ customer.name }}</td>
              <td>{{ customer.nif }}</td>
              <td>{{ customer.email }}</td>
              <td style="text-align: center">
                <button
                  class="btn btn-info btn-sm"
                  @click="viewOrders(customer)"
                >
                  <i class="bi bi-xs bi-eye"></i>
                </button>
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
import { onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { useRouter } from "vue-router";
import Pagination from "../pagination.vue";

const router = useRouter();
const authStore = useAuthStore();

const config = useRuntimeConfig();
const api = config.public.API_URL;

const searchTerm = ref({
  username: "",
  name: "",
  nif: "",
  email: "",
});

const currentPage = ref(1);
const pageSize = ref(10);
const metadata = ref({});
const customers = ref([]);

const viewOrders = (customer) => {
  router.push(`/orders/customer/${customer.username}`);
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const fetchData = async () => {
  const queryParams = new URLSearchParams();

  if (searchTerm.value.username) {
    queryParams.append("username", searchTerm.value.username);
  }
  if (searchTerm.value.name) {
    queryParams.append("name", searchTerm.value.name);
  }
  if (searchTerm.value.nif) {
    queryParams.append("nif", searchTerm.value.nif);
  }
  if (searchTerm.value.email) {
    queryParams.append("email", searchTerm.value.email);
  }

  const response = await useFetch(
    `${api}/customers/all?pageSize=20&page=${
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
  customers.value = response.data.value.data;
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
    navigateTo("/auth/login");
  }
  if (authStore.user.role != "LogisticsOperator") {
    navigateTo("/");
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
