<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <div class="card mb-3">
          <div class="card-body">
            <h3 class="card-title">Sensor Information</h3>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">ID</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="sensor.id"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Sensor Type</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="sensor.sensorType.name"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="sensor.name"
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
        <h5 class="card-title">Package History</h5>
        <div>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 25%">Package</th>
                <th style="width: 25%">Package Type</th>
                <th style="width: 25%">Added at</th>
                <th style="width: 25%">Removed at</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="packageItem in packages" :key="packageItem.id">
                <td>
                  <nuxt-link :to="`/packages/${packageItem.aPackage.code}`">{{
                    packageItem.aPackage.code
                  }}</nuxt-link>
                </td>
                <td>{{ packageItem.aPackage.packageType }}</td>
                <td>
                  {{
                    new Date(packageItem.addedAt * 1000).toLocaleString("en-GB")
                  }}
                </td>
                <td v-if="packageItem.removedAt !== null">
                  {{
                    new Date(packageItem.removedAt * 1000).toLocaleString(
                      "en-GB"
                    )
                  }}
                </td>
                <td v-else></td>
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
const authStore = useAuthStore();
const toast = useToast();

const route = useRoute();
const config = useRuntimeConfig();
const api = config.public.API_URL;
const id = route.params.sensor;
const { data: sensor } = await useFetch(`${api}/sensors/${id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authStore.token}`,
  },
});

const { data: packages } = await useFetch(`${api}/sensors/${id}/packages`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authStore.token}`,
  },
});

onMounted(() => {
  if (!authStore.user) {
    navigateTo("/auth/login");
  }
  if (authStore.user.role != "LogisticsOperator") {
    navigateTo("/");
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
