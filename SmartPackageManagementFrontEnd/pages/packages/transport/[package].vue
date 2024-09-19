<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <div class="card mb-3">
          <div class="card-body">
            <h3 class="card-title">Package Information</h3>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Code</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="transportPckItem.code"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Active</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="transportPckItem.active"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Production Date</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formattedManufactureDate"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Material</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="transportPckItem.material"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <p></p>
      <div>
        <h5 class="card-title">Packages History</h5>
        <div>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 25%">Date</th>
                <th style="width: 25%">Package</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="packageItem in packages" :key="packageItem.id">
                <td>
                  {{ new Date(packageItem.addedAt).toLocaleString("en-GB") }}
                </td>
                <td>
                  <nuxt-link :to="`/packages/${packageItem.aPackage.code}`">{{
                    packageItem.aPackage.code
                  }}</nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p></p>
      <div>
        <h5 class="card-title">Sensors History</h5>
        <div>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 10%">ID</th>
                <th style="width: 20%">Name</th>
                <th style="width: 20%">SensorType</th>
                <th style="width: 20%">Added At</th>
                <th style="width: 20%">Removed At</th>
                <th style="width: 10%">Measurements</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sensor in sensors" :key="sensors.id">
                <td>
                  <nuxt-link :to="`/sensors/${sensor.sensor.id}`">{{
                    sensor.sensor.id
                  }}</nuxt-link>
                </td>
                <td>{{ sensor.sensor.name }}</td>
                <td>{{ sensor.sensor.sensorType.name }}</td>
                <td>
                  {{ new Date(sensor.addedAt).toLocaleString("en-GB") }}
                </td>
                <td v-if="sensor.removedAt !== null">
                  {{ new Date(sensor.removedAt).toLocaleString("en-GB") }}
                </td>
                <td v-else></td>
                <td style="text-align: center">
                  <button
                    class="btn btn-info btn-sm"
                    @click="viewMeasurements(transportPckItem)"
                  >
                    <i class="bi bi-xs bi-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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

const viewMeasurements = (transportPckItem) => {
  router.push(`/measurements/transport/${transportPckItem.code}`);
};

const { data: transportPckItem } = await useFetch(
  `${api}/transport-packages/${code}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  }
);
const formattedManufactureDate = new Date(
  transportPckItem.value.manufactureDate
).toLocaleString("en-GB");

const { data: packages } = await useFetch(
  `${api}/transport-packages/${code}/packages`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  }
);
const { data: sensors } = await useFetch(
  `${api}/transport-packages/${code}/sensors`,
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
