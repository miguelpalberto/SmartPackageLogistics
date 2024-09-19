<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <div class="card mb-3">
          <div class="card-body">
            <div>
              <h5 class="card-title">Package's Sensors</h5>
              <div>
                <table class="table">
                  <thead>
                    <tr>
                      <th style="width: 2.5%">ID</th>
                      <th style="width: 10%">Name</th>
                      <th style="width: 2.5%">SensorType</th>
                      <th style="width: 15%">Added At</th>
                      <th style="width: 15%">Removed At</th>
                      <th style="width: 50%">Measurements</th>
                    </tr>
                  </thead>
                  <tbody v-if="sensors.length > 0">
                    <tr v-for="sensor in sensors" :key="sensor.id">
                      <td>{{ sensor.sensor.id }}</td>
                      <td>{{ sensor.sensor.name }}</td>
                      <td>{{ sensor.sensor.sensorType.name }}</td>
                      <td>{{ new Date(sensor.addedAt).toLocaleString("en-GB") }}</td>
                      <td v-if="sensor.removedAt !== null">
                        {{ new Date(sensor.removedAt).toLocaleString("en-GB") }}
                      </td>
                      <td v-else></td>
                      <td style="text-align: center">
                        <select v-if="sensor.sensor.measurements.length > 0" v-model="selectedMeasurement">
                          <option v-for="measurement in sensor.sensor.measurements" :key="measurement.id">
                            {{ measurement.measurement }} - {{ new Date(measurement.timestamp).toLocaleString("en-GB") }}
                          </option>
                        </select>
                        <span v-else>No Measurements</span>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="6">No sensors available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useAuthStore } from "~/store/auth-store.js";
  import { useToast } from "vue-toastification";
  import { useRouter } from "vue-router";
  const authStore = useAuthStore();
  const toast = useToast();
  const router = useRouter();
  const route = useRoute();
  const username = route.params.username;
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  const code = route.params.package;
  const selectedMeasurement = ref(null); // Add this line

  const { data: sensors } = await useFetch(
    `${api}/standard-packages/${code}/measurements`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    }
  );

  onMounted(() => {
    if (!authStore.user) {
      navigateTo("/auth/login");
    }
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
</style>
