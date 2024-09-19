<template>
    <!-- 
    <div class="container mt-5">
      <div class="row mb-3">
        <div class="col-md-8 mx-auto">
          <div class="card mb-3">
            <div class="card-body">
              <h3 class="card-title">Transport Package Information</h3>
              <form @submit.prevent="">
                <div class="row">
                  <div class="col-md-8">
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
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <label>Sensor</label>
        <select
          v-model="searchTerm.sensorId"
          class="form-control mb-3"
          @change="handleSearch"
        >
          <option value="">All Sensors</option>
          <option
            v-for="sensor in uniqueSensors"
            :key="sensor.sensorPackageDTO.sensor.id"
            :value="sensor.sensorPackageDTO.sensor.id"
          >
            {{ sensor.sensorPackageDTO.sensor.name }}
          </option>
        </select>
      </div>
  
      <table class="table">
        <thead>
          <tr>
            <th style="width: 20%">Package</th>
            <th style="width: 20%">Sensor</th>
            <th style="width: 15%">Measurement</th>
            <th style="width: 20%">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="measurement in measurements"
            :key="measurement.timestamp"
            :class="getRowClass(measurement)"
          >
            <td>
              {{ measurement.sensorPackageDTO.aPackage.code }}
            </td>
            <td>{{ measurement.sensorPackageDTO.sensor.name }}</td>
            <td>
              {{ measurement.measurement }}
              {{ measurement.sensorPackageDTO.sensor.sensorType.measurementUnit }}
            </td>
            <td>
              {{ new Date(measurement.timestamp).toLocaleString("en-GB") }}
            </td>
            <td v-if="showMinValue(measurement)">
              {{ findMinValue(measurement) }}
            </td>
            <td v-else>
    
            </td>
            <td v-if="showMaxValue(measurement)">
              {{ findMaxValue(measurement) }}
            </td>
            <td v-else>
      
            </td>
          </tr>
        </tbody>
      </table>
      <pagination :metadata="metadata" :changePage="changePage" />
    </div>
-->
  </template> 
  
  <script setup>

//   import { ref, onMounted } from "vue";
//   import { useAuthStore } from "~/store/auth-store.js";
//   import { useToast } from "vue-toastification";
//   import Pagination from "../../pagination.vue";
//   const authStore = useAuthStore();
//   const toast = useToast();
  
//   const route = useRoute();
//   const username = route.params.username;
//   const config = useRuntimeConfig();
//   const api = config.public.API_URL;
//   const code = route.params.package;
  
//   const { data: packageItem } = await useFetch(
//     `${api}/transport-packages/${code}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authStore.token}`,
//       },
//     }
//   );
  
//   const searchTerm = ref({
//     sensorId: "",
//   });
  
//   const currentPage = ref(1);
//   const pageSize = ref(10);
//   const metadata = ref({});
//   const measurements = ref([]);
//   const measurementsSensors = ref([]);
  
//   const handleSearch = () => {
//     currentPage.value = 1;
//     fetchData();
//   };
  
//   const fetchData = async () => {
//     const queryParams = new URLSearchParams();
  
//     if (searchTerm.value.sensorId) {
//       queryParams.append("sensorId", searchTerm.value.sensorId);
//     }
//     //measurements <----------
//     const { data: sensors } = await useFetch(
//     `${api}/standard-packages/${code}/measurements`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authStore.token}`,
//       },
//     }
//   );
//     // const response = await useFetch(
//     //   `${api}/measurements/all?pageSize=25&page=${
//     //     currentPage.value
//     //   }&packageCode=${code}&${queryParams.toString()}`,
//     //   {
//     //     method: "GET",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${authStore.token}`,
//     //     },
//     //   }
//     // );
//     // const response = await useFetch(
//     //   `${api}/measurements/all?pageSize=25&page=${
//     //     currentPage.value
//     //   }&packageCode=${code}&${queryParams.toString()}`,
//     //   {
//     //     method: "GET",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${authStore.token}`,
//     //     },
//     //   }
//     // );
//     const response2 = await useFetch(
//       `${api}/measurements/all?pageSize=99999&packageCode=${code}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authStore.token}`,
//         },
//       }
//     );
//     measurements.value = response.data.value.data;
//     measurementsSensors.value = response2.data.value.data;
//     metadata.value = response.data.value.metadata;
//   };
  
//   const uniqueSensors = computed(() => {
//     const uniqueIds = new Set();
//     return measurementsSensors.value.filter((measurement) => {
//       if (!uniqueIds.has(measurement.sensorPackageDTO.sensor.id)) {
//         uniqueIds.add(measurement.sensorPackageDTO.sensor.id);
//         return true;
//       }
//       return false;
//     });
//   });
  
//   const changePage = (newPage) => {
//     if (newPage > 0 && newPage <= metadata.value.totalPages) {
//       currentPage.value = newPage;
//       fetchData();
//     }
//   };
  
//   const showMinValue = (measurement) => {
//     const sensorPackageDTO = measurement.sensorPackageDTO;
  
//     if (
//       sensorPackageDTO &&
//       sensorPackageDTO.aPackage &&
//       sensorPackageDTO.aPackage.products &&
//       sensorPackageDTO.aPackage.products[0] &&
//       sensorPackageDTO.aPackage.products[0].productParameters
//     ) {
//       const sensorTypeId = sensorPackageDTO.sensor.sensorType.id;
  
//       const matchingParameter =
//         sensorPackageDTO.aPackage.products[0].productParameters.find(
//           (parameter) => parameter.sensorTypeId === sensorTypeId
//         );
  
//       return matchingParameter !== undefined;
//     }
  
//     return false;
//   };
  
//   const findMinValue = (measurement) => {
//     const sensorPackageDTO = measurement.sensorPackageDTO;
  
//     if (
//       sensorPackageDTO &&
//       sensorPackageDTO.aPackage &&
//       sensorPackageDTO.aPackage.products &&
//       sensorPackageDTO.aPackage.products[0] &&
//       sensorPackageDTO.aPackage.products[0].productParameters
//     ) {
//       const sensorTypeId = sensorPackageDTO.sensor.sensorType.id;
  
//       const matchingParameter =
//         sensorPackageDTO.aPackage.products[0].productParameters.find(
//           (parameter) => parameter.sensorTypeId === sensorTypeId
//         );
  
//       return matchingParameter ? matchingParameter.minValue : "";
//     }
  
//     return "";
//   };
  
//   const showMaxValue = (measurement) => {
//     const sensorPackageDTO = measurement.sensorPackageDTO;
  
//     if (
//       sensorPackageDTO &&
//       sensorPackageDTO.aPackage &&
//       sensorPackageDTO.aPackage.products &&
//       sensorPackageDTO.aPackage.products[0] &&
//       sensorPackageDTO.aPackage.products[0].productParameters
//     ) {
//       const sensorTypeId = sensorPackageDTO.sensor.sensorType.id;
  
//       const matchingParameter =
//         sensorPackageDTO.aPackage.products[0].productParameters.find(
//           (parameter) => parameter.sensorTypeId === sensorTypeId
//         );
  
//       return matchingParameter !== undefined;
//     }
  
//     return false;
//   };
  
//   const findMaxValue = (measurement) => {
//     const sensorPackageDTO = measurement.sensorPackageDTO;
  
//     if (
//       sensorPackageDTO &&
//       sensorPackageDTO.aPackage &&
//       sensorPackageDTO.aPackage.products &&
//       sensorPackageDTO.aPackage.products[0] &&
//       sensorPackageDTO.aPackage.products[0].productParameters
//     ) {
//       const sensorTypeId = sensorPackageDTO.sensor.sensorType.id;
  
//       const matchingParameter =
//         sensorPackageDTO.aPackage.products[0].productParameters.find(
//           (parameter) => parameter.sensorTypeId === sensorTypeId
//         );
  
//       return matchingParameter ? matchingParameter.maxValue : "";
//     }
  
//     return "";
//   };
  
//   const getRowClass = (measurement) => {
//     const minValue = findMinValue(measurement);
//     const maxValue = findMaxValue(measurement);
  
//     if (
//       minValue !== "" &&
//       maxValue !== "" &&
//       (measurement.measurement < minValue || measurement.measurement > maxValue)
//     ) {
//       return "out-of-range";
//     } else {
//       return "";
//     }
//   };
//   onMounted(() => {
//     if (!authStore.user) {
//       navigateTo("/auth/login");
//     }
//     fetchData();
//   });
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
  