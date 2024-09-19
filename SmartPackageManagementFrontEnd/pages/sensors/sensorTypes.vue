<template>
  <div class="container mt-5">
    <h1>Sensor Types Management</h1>
    <div class="row mb-3">
      <div class="col-md-10 mx-auto">
        <button
          type="button"
          class="btn btn-success px-4 btn-addsensortype"
          @click="addSensorType"
        >
          <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Sensor Type
        </button>
        <div
          class="modal-overlay"
          :class="{ show: showAddSensorTypeForm }"
        ></div>
        <div
          class="modal"
          tabindex="-1"
          :class="{ show: showAddSensorTypeForm }"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add New Sensor Type</h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="closeAddSensorTypeForm"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addNewSensorType">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="name" class="form-label">Name:</label>
                      <input
                        v-model="sensorTypeData.name"
                        type="text"
                        id="name"
                        class="form-control"
                      />
                    </div>
                    <div class="col-md-6">
                      <label for="unit" class="form-label">Unit:</label>
                      <input
                        v-model="sensorTypeData.measurementUnit"
                        type="text"
                        id="measurementUnit"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="name" class="form-label"
                      >Measurement Type:</label
                    >
                    <select
                      class="form-control mb-3"
                      v-model="sensorTypeData.measurementType"
                    >
                      <option value="">All</option>
                      <option value="NUMERIC">NUMERIC</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                      <option value="GEOGRAPHIC">GEOGRAPHIC</option>
                    </select>
                  </div>
                  <p></p>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-primary">
                      Add Sensor Type
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <label>Name</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Search by name"
              v-model="searchTerm.name"
              @input="handleSearch"
            />
          </div>
          <div class="col-md-6">
            <label>Unit</label>
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Search by unit"
              v-model="searchTerm.unit"
              @input="handleSearch"
            />
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th style="width: 20%">Id</th>
              <th style="width: 20%">Name</th>
              <th style="width: 20%">Unit</th>
              <th style="width: 20%">Measurement Type</th>
              <th style="width: 10%"></th>
              <th style="width: 10%"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sensorType in sensorTypes" :key="sensorType.id">
              <td>{{ sensorType.id }}</td>
              <td>
                <template v-if="editingSensorType === sensorType.id">
                  <input
                    v-model="sensorType.name"
                    type="text"
                    class="form-control"
                  />
                </template>
                <template v-else>
                  {{ sensorType.name }}
                </template>
              </td>
              <td style="text-align: center">
                <template v-if="editingSensorType === sensorType.id">
                  <input
                    v-model="sensorType.measurementUnit"
                    type="text"
                    class="form-control"
                  />
                </template>
                <template v-else>
                  {{ sensorType.measurementUnit }}
                </template>
              </td>
              <td style="text-align: center">
                {{ sensorType.measurementType }}
              </td>
              <td style="text-align: center">
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="
                    editingSensorType === sensorType.id
                      ? saveSensorType(sensorType)
                      : startEditing(sensorType.id)
                  "
                >
                  <i
                    :class="[
                      'bi',
                      'bi-xs',
                      {
                        'bi-check': editingSensorType === sensorType.id,
                        'bi-pencil': editingSensorType !== sensorType.id,
                      },
                    ]"
                  ></i>
                </button>
              </td>
              <td style="text-align: center">
                <button
                  class="btn btn-xs btn-danger"
                  @click="deleteSensorType(sensorType.id)"
                  :disabled="editingSensorType === sensorType.id"
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
import Pagination from "../pagination.vue";
const toast = useToast();

const authStore = useAuthStore();
const config = useRuntimeConfig();
const api = config.public.API_URL;

const searchTerm = ref({
  unit: "",
  name: "",
});

const currentPage = ref(1);
const pageSize = ref(10);
const metadata = ref({});
const sensorTypes = ref([]);

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const showAddSensorTypeForm = ref(false);

const sensorTypeData = ref({
  name: "",
  measurementUnit: "",
  measurementType: "",
});
const fetchData = async () => {
  const queryParams = new URLSearchParams();

  if (searchTerm.value.unit) {
    queryParams.append("unit", searchTerm.value.unit);
  }
  if (searchTerm.value.name) {
    queryParams.append("name", searchTerm.value.name);
  }

  const response = await useFetch(
    `${api}/sensor-types/all?page=${
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
  sensorTypes.value = response.data.value.data;
  metadata.value = response.data.value.metadata;
};

const changePage = (newPage) => {
  if (newPage > 0 && newPage <= metadata.value.totalPages) {
    currentPage.value = newPage;
    fetchData();
  }
};
const editingSensorType = ref(null);

const addSensorType = () => {
  showAddSensorTypeForm.value = true;
};

const closeAddSensorTypeForm = () => {
  showAddSensorTypeForm.value = false;
};

const addNewSensorType = async () => {
  try {
    const response = await fetch(`${api}/sensor-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: sensorTypeData.value.name,
        measurementUnit: sensorTypeData.value.measurementUnit,
        measurementType: sensorTypeData.value.measurementType,
      }),
    });

    if (response.ok) {
      showAddSensorTypeForm.value = false;
      toast.success("New Sensor Type added successfully");
      refresh();
    } else {
      toast.error("Error adding sensor type");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const startEditing = (sensorTypeId) => {
  editingSensorType.value = sensorTypeId;
};

const saveSensorType = async (sensorType) => {
  try {
    const response = await useFetch(`${api}/sensor-types/${sensorType.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: sensorType.name,
        measurementUnit: sensorType.measurementUnit,
      }),
    });

    if (response.status.value == "success") {
      editingSensorType.value = null;
      toast.success(`Sensor Type ${sensorType.name} updated successfully`);
      refresh();
    } else {
      toast.error(`Error updating sensor type ${sensorType.name}`);
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const deleteSensorType = async (sensorTypeId) => {
  try {
    const response = await fetch(`${api}/sensor-types/${sensorTypeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      toast.success(`Sensor Type deleted successfully`);
      refresh();
    } else {
      toast.error(`Error deleting sensor type ${sensorType.name}`);
      console.error("Error deleting sensor type");
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

.btn-addsensortype {
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
