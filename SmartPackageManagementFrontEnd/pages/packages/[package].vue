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
                      v-model="packageItem.code"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Package Type</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="packageItem.packageType"
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
                      v-model="packageItem.active"
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
                      v-model="packageItem.material"
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
        <h5 class="card-title">Products History</h5>
        <div>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 25%">Date</th>
                <th style="width: 25%">Reference</th>
                <th style="width: 25%">Name</th>
                <th style="width: 25%">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ new Date(product.addedAt).toLocaleString("en-GB") }}</td>
                <td>
                  <nuxt-link :to="`/products/${product.id}`">{{
                    product.product.reference
                  }}</nuxt-link>
                </td>
                <td>{{ product.product.name }}</td>
                <td v-if="packageItem.packageType === 'PRIMARY'">
                  {{ product.product.primaryPackQuantity }}
                </td>
                <td v-if="packageItem.packageType === 'SECONDARY'">
                  {{ product.product.secondaryPackQuantity }}
                </td>
                <td v-if="packageItem.packageType === 'TERTIARY'">
                  {{ product.product.tertiaryPackQuantity }}
                </td>
                .
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
                    @click="viewMeasurements(packageItem)"
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

const viewMeasurements = (packageItem) => {
  router.push(`/measurements/${packageItem.code}`);
};

const { data: packageItem } = await useFetch(
  `${api}/standard-packages/${code}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  }
);
const formattedManufactureDate = new Date(
  packageItem.value.manufactureDate
).toLocaleString("en-GB");

const { data: products } = await useFetch(
  `${api}/standard-packages/${code}/products`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  }
);
const { data: sensors } = await useFetch(
  `${api}/standard-packages/${code}/sensors`,
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
