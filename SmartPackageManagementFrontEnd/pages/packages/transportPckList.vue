<template>
  <div class="container mt-5">
    <h1>Transport Packages Management</h1>
    <div class="row mb-3">
      <div class="col-md-10 mx-auto">
        <button
          type="button"
          class="btn btn-success px-4 btn-addpackage"
          @click="addPackage"
        >
          <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Transport Package
        </button>
        <div class="modal-overlay" :class="{ show: showAddPackageForm }"></div>
        <div class="modal" tabindex="-1" :class="{ show: showAddPackageForm }">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add New Package</h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="closeAddPackageForm"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addNewPackage">
                  <div class="mb-3">
                    <label for="code" class="form-label">Code:</label>
                    <input
                      v-model="packageData.code"
                      type="text"
                      id="code"
                      class="form-control"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="material" class="form-label">Material:</label>
                    <input
                      v-model="packageData.material"
                      type="text"
                      id="material"
                      class="form-control"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="material" class="form-label"
                      >Production Date:</label
                    >
                    <input
                      v-model="packageData.manufactureDate"
                      type="date"
                      id="manufactureDate"
                      class="form-control"
                    />
                  </div>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-primary">
                      Add Package
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label>Code</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Search by Code"
              v-model="searchTerm.code"
              @input="handleSearch"
            />
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 20%">Code</th>
              <th style="width: 20%">View Package</th>
              <th style="width: 20%">Active</th>

              <th style="width: 20%"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="packageItem in packages" :key="packageItem.code">
              <td>{{ packageItem.code }}</td>
              <td style="text-align: center">
                <button
                  class="btn btn-info btn-sm"
                  @click="viewPackage(packageItem)"
                >
                  <i class="bi bi-xs bi-eye"></i>
                </button>
              </td>
              <td style="text-align: center">
                {{ packageItem.active }}
                &nbsp; &nbsp; &nbsp;
                <button
                  class="btn btn-xs"
                  :class="{
                    'btn-danger': packageItem.active == true,
                    'btn-success': packageItem.active !== true,
                  }"
                  @click="activePackage(packageItem.code)"
                >
                  <i
                    v-if="packageItem.active !== true"
                    class="bi bi-xs bi-check"
                  ></i>
                  <i v-else class="bi bi-xs bi-x"></i>
                </button>
              </td>

              <td style="text-align: center">
                <button
                  class="btn btn-xs btn-danger"
                  @click="deletePackage(packageItem.code)"
                >
                  <i class="bi bi-xs bi-trash"></i>
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
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import Pagination from "../pagination.vue";
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const config = useRuntimeConfig();
const api = config.public.API_URL;

const searchTerm = ref({
  code: "",
  packageType: "",
});

const currentPage = ref(1);
const pageSize = ref(10);
const metadata = ref({});
const packages = ref([]);

const viewPackage = (packageItem) => {
  router.push(`/packages/transport/${packageItem.code}`);
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const fetchData = async () => {
  const queryParams = new URLSearchParams();

  if (searchTerm.value.code) {
    queryParams.append("code", searchTerm.value.code);
  }

  const response = await useFetch(
    `${api}/transport-packages/all?page=${
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
  packages.value = response.data.value.data;
  metadata.value = response.data.value.metadata;
};

const changePage = (newPage) => {
  if (newPage > 0 && newPage <= metadata.value.totalPages) {
    currentPage.value = newPage;
    fetchData();
  }
};

const showAddPackageForm = ref(false);

const packageData = ref({
  code: "",
  material: "",
  manufactureDate: "",
});

const addPackage = () => {
  showAddPackageForm.value = true;
};

const closeAddPackageForm = () => {
  showAddPackageForm.value = false;
};

const addNewPackage = async () => {
  try {
    const response = await fetch(`${api}/transport-packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        code: packageData.value.code,
        material: packageData.value.material,
        manufactureDate: packageData.value.manufactureDate,
      }),
    });

    if (response.ok) {
      toast.success("Package added successfully");
      showAddPackageForm.value = false;
      refresh();
    } else {
      toast.error("Error adding Package");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const deletePackage = async (packageCode) => {
  try {
    const response = await fetch(`${api}/transport-packages/${packageCode}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      toast.success(`Transport Package deleted successfully`);
      refresh();
    } else {
      toast.error(`Error deleting transport Package ${packageCode}`);
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const activePackage = async (packageCode) => {
  try {
    const response = await fetch(
      `${api}/transport-packages/${packageCode}/active-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      toast.success(`Transport Package updated successfully`);
      refresh();
    } else {
      toast.error(`Error updateding transport Package ${packageCode}`);
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const refresh = () => {
  fetchData();
};

onMounted(() => {
  if (!authStore.user) {
    navigateTo("/auth/login");
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

.btn-addpackage {
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
