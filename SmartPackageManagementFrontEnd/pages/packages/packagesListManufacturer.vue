<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-10 mx-auto">
        <h1>Packages List</h1>
        <br>

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
                      >Package Type:</label
                    >
                    <input
                      v-model="packageData.packageType"
                      type="text"
                      id="material"
                      class="form-control"
                      disabled
                    />
                  </div>
                  <div class="mb-3">
                    <label for="material" class="form-label"
                      >Package Type:</label
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

          <div class="col-md-6">
            <label>Package Type</label>
            <select
              class="form-control mb-3"
              v-model="searchTerm.packageType"
              @change="handleSearch"
            >
              <option value="">All</option>
              <option value="PRIMARY">PRIMARY</option>
              <option value="SECONDARY">SECONDARY</option>
              <!-- <option value="TERTIARY">TERTIARY</option> -->
            </select>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 33%">Code</th>
              <th style="width: 33%">Type</th>
              <th style="width: 33%">View Sensor Measurements</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="packageItem in packages" :key="packageItem.code">
              <td>{{ packageItem.code }}</td>
              <td>{{ packageItem.packageType }}</td>
              <td style="text-align: center">
                <!-- <button
                  class="btn btn-info btn-sm"
                  @click="viewPackage(packageItem)"
                >
                  <i class="bi bi-xs bi-eye"></i>
                </button> -->
                <nuxt-link :to="`/packages/packageSensorsManufacturer/${packageItem.code}`">
                  <button
                  class="btn btn-info btn-sm">
                  <i class="bi bi-xs bi-eye"></i>
                </button>
                </nuxt-link>
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
  router.push(`/packages/${packageItem.code}`);
  //router.push(`/packages/packageSensorsManufacturer/${packageItem.code}`);
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

  if (searchTerm.value.packageType) {
    queryParams.append("packageType", searchTerm.value.packageType);
  }

  const response = await useFetch(
    `${api}/standard-packages/all?pageSize=20&page=${
      currentPage.value
    }`,
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
  packageType: "TERTIARY",
  manufactureDate: "",
});

const addPackage = () => {
  showAddPackageForm.value = true;
};

const closeAddPackageForm = () => {
  showAddPackageForm.value = false;
};
const resetAddForm = () => {
  packageData.value.code = '';
  packageData.value.material = '';
  packageData.value.manufactureDate = '';
};
const addNewPackage = async () => {
  try {
    const response = await fetch(`${api}/standard-packages/empty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        code: packageData.value.code,
        material: packageData.value.material,
        packageType: packageData.value.packageType,
        manufactureDate: packageData.value.manufactureDate,
        initialProductId: null,
        initialAmountCreation: 1,
      }),
    });

    if (response.ok) {
      toast.success("Package added successfully");
      showAddPackageForm.value = false;
      resetAddForm();
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
    const response = await fetch(`${api}/standard-packages/${packageCode}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      toast.success(`Package deleted successfully`);
      refresh();
    } else {
      toast.error(`Error deleting  Package ${packageCode}`);
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const activePackage = async (packageCode) => {
  try {
    const response = await fetch(
      `${api}/standard-packages/${packageCode}/active-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      toast.success(`Package updated successfully`);
      refresh();
    } else {
      toast.error(`Error updating  Package ${packageCode}`);
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
