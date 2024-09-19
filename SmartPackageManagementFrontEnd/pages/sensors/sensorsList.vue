<template>
  <div class="container mt-5">
    <h1>Sensors Management</h1>
    <div class="row mb-3">
      <div class="col-md-10 mx-auto">
        <button
          type="button"
          class="btn btn-success px-4 btn-addsensor"
          @click="addSensor"
        >
          <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Sensor
        </button>
        <div class="modal-overlay" :class="{ show: showAddSensorForm }"></div>
        <div class="modal" tabindex="-1" :class="{ show: showAddSensorForm }">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add New Sensor</h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="closeAddSensorForm"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addNewSensor">
                  <div class="mb-3">
                    <label for="name" class="form-label">Name:</label>
                    <input
                      v-model="sensorData.name"
                      type="text"
                      id="name"
                      class="form-control"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="sensorTypeId" class="form-label"
                      >Sensor Type:</label
                    >
                    <select
                      v-model="sensorData.sensorTypeId"
                      class="form-control"
                    >
                      <option value="">Select Sensor Type</option>
                      <option
                        v-for="sensorType in sensorTypes"
                        :key="sensorType.id"
                        :value="sensorType.id"
                      >
                        {{ sensorType.name }}
                      </option>
                    </select>
                  </div>
                  <div class="d-grid">
                    <button type="submit" class="btn btn-primary">
                      Add Sensor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
        <table class="table">
          <thead>
            <tr>
              <th style="width: 20%">Id</th>
              <th style="width: 20%">Name</th>
              <th style="width: 20%">Sensor Type</th>
              <th style="width: 10%">Available</th>
              <th style="width: 10%">History</th>
              <th style="width: 10%"></th>
              <th style="width: 10%"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sensor in sensors" :key="sensor.id">
              <td>{{ sensor.id }}</td>
              <td>
                <template v-if="editingSensor === sensor.id">
                  <input
                    v-model="sensor.name"
                    type="text"
                    class="form-control"
                  />
                </template>
                <template v-else>
                  {{ sensor.name }}
                </template>
              </td>
              <td>{{ sensor.sensorType.name }}</td>
              <td>{{ sensor.available }}</td>
              <td style="text-align: center">
                <button
                  class="btn btn-info btn-sm"
                  @click="viewSensorDetails(sensor)"
                >
                  <i class="bi bi-xs bi-eye"></i>
                </button>
              </td>
              <td style="text-align: center">
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="
                    editingSensor === sensor.id
                      ? saveSensor(sensor)
                      : startEditing(sensor.id)
                  "
                >
                  <i
                    :class="[
                      'bi',
                      'bi-xs',
                      {
                        'bi-check': editingSensor === sensor.id,
                        'bi-pencil': editingSensor !== sensor.id,
                      },
                    ]"
                  ></i>
                </button>
              </td>
              <td style="text-align: center">
                <button
                  class="btn btn-xs btn-danger"
                  @click="deleteSensor(sensor.id)"
                  :disabled="editingSensor === sensor.id"
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
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const config = useRuntimeConfig();
const api = config.public.API_URL;

const searchTerm = ref({
  name: "",
});
const sensorData = ref({
  name: "",
  sensorTypeId: "",
});

const currentPage = ref(1);
const pageSize = ref(10);
const metadata = ref({});
const sensors = ref([]);
const sensorTypes = ref([]);

const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

const viewSensorDetails = (sensor) => {
  router.push(`/sensors/${sensor.id}`);
};

const fetchData = async () => {
  const queryParams = new URLSearchParams();

  if (searchTerm.value.name) {
    queryParams.append("name", searchTerm.value.name);
  }

  const response = await useFetch(
    `${api}/sensors/all?pageSize=20&page=${
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
  const response2 = await useFetch(`${api}/sensor-types/all?pageSize=999`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  sensors.value = response.data.value.data;
  sensorTypes.value = response2.data.value.data;
  metadata.value = response.data.value.metadata;
};

const changePage = (newPage) => {
  if (newPage > 0 && newPage <= metadata.value.totalPages) {
    currentPage.value = newPage;
    fetchData();
  }
};

const showAddSensorForm = ref(false);
const editingSensor = ref(null);
const addSensor = () => {
  showAddSensorForm.value = true;
};

const closeAddSensorForm = () => {
  showAddSensorForm.value = false;
};

const startEditing = (sensor) => {
  editingSensor.value = sensor;
};

const addNewSensor = async () => {
  try {
    const response = await fetch(`${api}/sensors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: sensorData.value.name,
        sensorType: {
          id: sensorData.value.sensorTypeId,
        },
      }),
    });

    if (response.ok) {
      toast.success("Sensor  added successfully");
      showAddSensorForm.value = false;
      refresh();
    } else {
      toast.error("Error adding sensor");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const saveSensor = async (sensor) => {
  try {
    const response = await fetch(`${api}/sensors/${sensor.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: sensor.name,
        sensorType: {
          id: sensor.sensorType.id,
        },
      }),
    });

    if (response.ok) {
      editingSensor.value = null;
      toast.success(`Sensor Type ${sensor.name} updated successfully`);
      refresh();
    } else {
      toast.error(`Error updating sensor type ${sensor.name}`);
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const deleteSensor = async (sensorId) => {
  try {
    const response = await fetch(`${api}/sensors/${sensorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      toast.success("Sensor deleted successfully");
      refresh();
    } else {
      toast.error("Error deleting sensor");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
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
