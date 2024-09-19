<template>
  <div class="container mt-5">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 20%">Date</th>
          <th style="width: 40%">Message</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="notifications.length > 0">
          <tr v-for="notification in notifications" :key="notification.id">
            <td>
              {{ new Date(notification.timestamp).toLocaleString("en-GB") }}
            </td>
            <td>{{ notification.text }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="6" class="text-center">
              No notifications have been received.
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <pagination :metadata="metadata" :changePage="changePage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { useToast } from "vue-toastification";
import Pagination from "../pagination.vue";
const toast = useToast();
const currentPage = ref(1);
const authStore = useAuthStore();
const pageSize = ref(20);
const notifications = ref([]);
const metadata = ref({});
const config = useRuntimeConfig();
const api = config.public.API_URL;

const fetchData = async () => {
  const queryParams = new URLSearchParams();
  let response = ref(null);

  if (authStore.user.role == "Manufacturer") {
    response = await useFetch(
      `${api}/manufacturers/${
        uthStore.user.username
      }/notifications?pageSize=20&page=${
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
  } else if (authStore.user.role == "Customer") {
    response = await useFetch(
      `${api}/customers/${
        authStore.user.username
      }/notifications?pageSize=20&page=${
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
  } else if (authStore.user.role == "LogisticsOperator") {
    response = await useFetch(
      `${api}/logistics-operator/${
        authStore.user.username
      }/notifications?pageSize=20&page=${
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
  notifications.value = response.data.value.data;
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

modal {
  display: none;
}

.modal.show {
  display: block;
}

.modal-dialog {
  margin-top: 6rem;
}

.modal-content {
  border-radius: 10px;
}

.modal-header {
  background-color: #6c757d;
  color: white;
  border-bottom: none;
}

.modal-title {
  margin-bottom: 0;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  border-top: none;
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: none;
}

.modal-overlay.show {
  display: block;
}
</style>
