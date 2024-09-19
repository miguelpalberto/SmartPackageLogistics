<template>
  <div class="container mt-5">
    <h1>Manufacturers Management</h1>
    <div class="row mb-3">
      <div class="col-md-8">
        <div class="d-flex mb-3">
          <button
            type="button"
            class="btn btn-success px-4 btn-addmanufacturer"
            @click="addManufacturer"
          >
            <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Manufacturer
          </button>
          <div
            class="modal-overlay"
            :class="{ show: showAddManufacturerForm }"
          ></div>
          <div
            class="modal"
            tabindex="-1"
            :class="{ show: showAddManufacturerForm }"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Add New Manufacturer</h5>
                  <button
                    type="button"
                    class="btn-close"
                    @click="closeAddManufacturerForm"
                  ></button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="addNewManufacturer">
                    <div class="mb-3">
                      <label for="name" class="form-label">Username:</label>
                      <input
                        v-model="manufacturerData.username"
                        type="text"
                        id="type"
                        class="form-control"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="name" class="form-label">Name:</label>
                      <input
                        v-model="manufacturerData.name"
                        type="text"
                        id="type"
                        class="form-control"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="unit" class="form-label">Email:</label>
                      <input
                        v-model="manufacturerData.email"
                        type="email"
                        id="unit"
                        class="form-control"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="unit" class="form-label">Password:</label>
                      <input
                        v-model="manufacturerData.password"
                        type="password"
                        id="unit"
                        class="form-control"
                      />
                    </div>
                    <div class="d-grid">
                      <button type="submit" class="btn btn-primary">
                        Add Manufacturer
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
          <th style="width: 20%">Products</th>
          <th style="width: 10%"></th>
          <th style="width: 10%"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="manufacturer in manufacturers">
          <td>{{ manufacturer.username }}</td>
          <td>
            <template v-if="editingManufacturer === manufacturer.username">
              <input
                v-model="manufacturer.name"
                type="text"
                class="form-control"
              />
            </template>
            <template v-else>
              {{ manufacturer.name }}
            </template>
          </td>
          <td>
            <template v-if="editingManufacturer === manufacturer.username">
              <input
                v-model="manufacturer.email"
                type="text"
                class="form-control"
              />
            </template>
            <template v-else>
              {{ manufacturer.email }}
            </template>
          </td>
          <td style="text-align: center">
            <button
              class="btn btn-info btn-sm"
              @click="viewProducts(manufacturer)"
            >
              <i class="bi bi-xs bi-eye"></i>
            </button>
          </td>
          <td style="text-align: center">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="
                editingManufacturer === manufacturer.username
                  ? saveManufacturer(manufacturer)
                  : startEditing(manufacturer.username)
              "
            >
              <i
                :class="[
                  'bi',
                  'bi-xs',
                  {
                    'bi-check': editingManufacturer === manufacturer.username,
                    'bi-pencil': editingManufacturer !== manufacturer.username,
                  },
                ]"
              ></i>
            </button>
          </td>
          <td style="text-align: center">
            <button
              class="btn btn-xs btn-danger"
              @click="deleteManufacturer(manufacturer.username)"
              :disabled="editingManufacturer === manufacturer.username"
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
const manufacturers = ref([]);

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};
const showAddManufacturerForm = ref(false);
const editingManufacturer = ref(null);

const manufacturerData = ref({
  username: "",
  name: "",
  email: "",
  password: "",
});

const startEditing = (username) => {
  editingManufacturer.value = username;
};

const addManufacturer = () => {
  showAddManufacturerForm.value = true;
};

const closeAddManufacturerForm = () => {
  showAddManufacturerForm.value = false;
};

const addNewManufacturer = async () => {
  try {
    const response = await fetch(`${api}/manufacturers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        username: manufacturerData.value.username,
        name: manufacturerData.value.name,
        email: manufacturerData.value.email,
        password: manufacturerData.value.password,
      }),
    });

    if (response.ok) {
      toast.success("New Manufacturer added successfully");
      showAddManufacturerForm.value = false;
      refresh();
    } else {
      toast.error("Error adding manufacturer");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const saveManufacturer = async (manufacturer) => {
  try {
    const response = await fetch(
      `${api}/manufacturers/${manufacturer.username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          username: manufacturer.username,
          password: manufacturer.password,
          email: manufacturer.email,
          name: manufacturer.name,
        }),
      }
    );

    if (response.ok) {
      editingManufacturer.value = null;
      toast.success(
        `Manufacturer ${manufacturer.username} updated successfully`
      );
      refresh();
    } else {
      toast.error("Error updating manufacturer");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const deleteManufacturer = async (username) => {
  try {
    const response = await fetch(`${api}/manufacturers/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      toast.success(`Manufacturer deleted successfully`);
      refresh();
    } else {
      toast.error("Error deleteing manufacturer");
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
    `${api}/manufacturers/all?pageSize=20&page=${
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
  manufacturers.value = response.data.value.data;
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

.btn-addmanufacturer {
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
