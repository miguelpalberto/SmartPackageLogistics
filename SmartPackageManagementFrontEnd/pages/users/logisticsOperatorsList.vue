<template>
  <div class="container mt-5">
    <h1>Logistics Operators Management</h1>
    <div class="row mb-3">
      <div class="col-md-8">
        <div class="d-flex mb-3">
          <button
            type="button"
            class="btn btn-success px-4 btn-addlogisticsoperator"
            @click="addLogisticsOperator"
          >
            <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Logistics Operator
          </button>
          <div
            class="modal-overlay"
            :class="{ show: showAddLogisticsOperatorForm }"
          ></div>
          <div
            class="modal"
            tabindex="-1"
            :class="{ show: showAddLogisticsOperatorForm }"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Add New Logistics Operator</h5>
                  <button
                    type="button"
                    class="btn-close"
                    @click="closeAddLogisticsOperatorForm"
                  ></button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="addNewLogisticsOperator">
                    <div class="mb-3">
                      <label for="name" class="form-label">Username:</label>
                      <input
                        v-model="logisticsOperatorData.username"
                        type="text"
                        id="type"
                        class="form-control"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="name" class="form-label">Name:</label>
                      <input
                        v-model="logisticsOperatorData.name"
                        type="text"
                        id="type"
                        class="form-control"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="unit" class="form-label">Email:</label>
                      <input
                        v-model="logisticsOperatorData.email"
                        type="email"
                        id="unit"
                        class="form-control"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="unit" class="form-label">Password:</label>
                      <input
                        v-model="logisticsOperatorData.password"
                        type="password"
                        id="unit"
                        class="form-control"
                      />
                    </div>
                    <div class="d-grid">
                      <button type="submit" class="btn btn-primary">
                        Add Logistics Operator
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-2">
        <label>Username</label>
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Search by username"
          v-model="searchTerm.username"
          @input="handleSearch"
        />
      </div>
      <div class="col-md-2">
        <label>Name</label>
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Search by name"
          v-model="searchTerm.name"
          @input="handleSearch"
        />
      </div>
      <div class="col-md-2">
        <label>Email</label>
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Search by email"
          v-model="searchTerm.email"
          @input="handleSearch"
        />
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 20%">Username</th>
          <th style="width: 20%">Name</th>
          <th style="width: 20%">Email</th>
          <th style="width: 10%"></th>
          <th style="width: 10%"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="logisticsOperator in logisticsOperators"
          :key="logisticsOperator.username"
        >
          <td>{{ logisticsOperator.username }}</td>
          <td>
            <template
              v-if="editingLogisticsOperator === logisticsOperator.username"
            >
              <input
                v-model="logisticsOperator.name"
                type="text"
                class="form-control"
              />
            </template>
            <template v-else>
              {{ logisticsOperator.name }}
            </template>
          </td>
          <td>
            <template
              v-if="editingLogisticsOperator === logisticsOperator.username"
            >
              <input
                v-model="logisticsOperator.email"
                type="text"
                class="form-control"
              />
            </template>
            <template v-else>
              {{ logisticsOperator.email }}
            </template>
          </td>
          <td style="text-align: center">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="
                editingLogisticsOperator === logisticsOperator.username
                  ? saveLogisticsOperator(logisticsOperator)
                  : startEditing(logisticsOperator.username)
              "
            >
              <i
                :class="[
                  'bi',
                  'bi-xs',
                  {
                    'bi-check':
                      editingLogisticsOperator === logisticsOperator.username,
                    'bi-pencil':
                      editingLogisticsOperator !== logisticsOperator.username,
                  },
                ]"
              ></i>
            </button>
          </td>
          <td style="text-align: center">
            <button
              class="btn btn-xs btn-danger"
              @click="deleteLogisticsOperator(logisticsOperator.username)"
              :disabled="
                editingLogisticsOperator === logisticsOperator.username
              "
            >
              <i class="bi bi-xs bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination :metadata="metadata" :changePage="changePage" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { useToast } from "vue-toastification";
import Pagination from "../pagination.vue";
const authStore = useAuthStore();

const toast = useToast();

const config = useRuntimeConfig();
const api = config.public.API_URL;

const searchTerm = ref({
  username: "",
  name: "",
  email: "",
});

const currentPage = ref(1);
const pageSize = ref(10);
const metadata = ref({});
const logisticsOperators = ref([]);

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const showAddLogisticsOperatorForm = ref(false);
const editingLogisticsOperator = ref(null);

const logisticsOperatorData = ref({
  username: "",
  name: "",
  email: "",
  password: "",
});

const startEditing = (username) => {
  editingLogisticsOperator.value = username;
};

const addLogisticsOperator = () => {
  showAddLogisticsOperatorForm.value = true;
};

const closeAddLogisticsOperatorForm = () => {
  showAddLogisticsOperatorForm.value = false;
};

const addNewLogisticsOperator = async () => {
  try {
    const response = await fetch(`${api}/logistics-operator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        username: logisticsOperatorData.value.username,
        name: logisticsOperatorData.value.name,
        email: logisticsOperatorData.value.email,
        password: logisticsOperatorData.value.password,
      }),
    });

    if (response.ok) {
      toast.success("New Logistic Operator added successfully");
      showAddLogisticsOperatorForm.value = false;
      refresh();
    } else {
      toast.error("Error adding logisticsOperator");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const saveLogisticsOperator = async (logisticsOperator) => {
  try {
    const response = await fetch(
      `${api}/logistics-operator/${logisticsOperator.username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          username: logisticsOperator.username,
          password: logisticsOperator.password,
          email: logisticsOperator.email,
          name: logisticsOperator.name,
        }),
      }
    );

    if (response.ok) {
      editingLogisticsOperator.value = null;
      toast.success(
        `Logistic Operator ${logisticsOperator.username} updated successfully`
      );
      refresh();
    } else {
      toast.error("Error updating logistics Operator");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const deleteLogisticsOperator = async (username) => {
  try {
    const response = await fetch(`${api}/logistics-operator/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      toast.success(`Logistic Operator deleted successfully`);
      refresh();
    } else {
      toast.error("Error deleting logistics Operator");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const fetchData = async () => {
  const queryParams = new URLSearchParams();

  if (searchTerm.value.username) {
    queryParams.append("username", searchTerm.value.username);
  }
  if (searchTerm.value.name) {
    queryParams.append("name", searchTerm.value.name);
  }
  if (searchTerm.value.email) {
    queryParams.append("email", searchTerm.value.email);
  }

  const response = await useFetch(
    `${api}/logistics-operator/all?pageSize=20&page=${
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
  logisticsOperators.value = response.data.value.data;
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

.btn-addlogisticsoperator {
  margin-top: 1.85rem;
}

.modal {
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
