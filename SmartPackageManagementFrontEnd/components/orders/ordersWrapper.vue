<template>
  <h1>{{ title }}</h1>
  <div class="col-12">
    <div class="row">
      <div class="col-xs-12 col-md-3" v-if="defaultOrderStatus === null">
        <label for="inputStatus" style="font-size: 14px" class="form-label">Order Status</label>
        <div class="input-group input-group-sm">
          <select id="inputStatus" :disabled="isLoading" style="font-size: 14px" v-model="orderStatus" class="form-select"
            @change="fetchFirstPage()">
            <option v-for="orderStatus in orderStatuses" :key="orderStatus.value" :value="orderStatus.value">
              {{ orderStatus.text }}
            </option>
          </select>
          <button :disabled="isLoading || orderStatus === null" class="btn btn-light btn-sm" @click="resetCategory">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isLoading" class="col-12">
    <common-loading-component />
  </div>
  <div v-else class="col-12">
    <orders-table :orders="paginatedOrders?.data" :is-parent-loading="isLoading"
      :isLogisticOperator="authStore.isLogisticOperator" />
    <pagination v-if="paginatedOrders?.metadata" :metadata="paginatedOrders.metadata" :changePage="changePage" />
  </div>
</template>
<script setup>
import { useAuthStore } from "~/store/auth-store";
import Pagination from "~/pages/pagination.vue";
const authStore = useAuthStore();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  defaultOrderStatus: {
    type: String,
    default: null,
  },
});

const orderStatuses = [
  { value: null, text: "All" },
  { value: "PENDING", text: "Pending" },
  { value: "ACCEPTED", text: "Accepted" },
  { value: "REJECTED", text: "Rejected" },
  { value: "COMPLETED", text: "Completed" },
];

const paginatedOrders = ref(null);
const isLoading = ref(true);
const currentPage = ref(1);

//filters
const orderStatus = ref(null);

const fetchOrders = async () => {
  isLoading.value = true;
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  const endpoint = authStore.isLogisticOperator ? "/orders/all" : "/orders/my";

  try {
    const queryParams = {
      pageSize: 10,
      page: currentPage.value,
    };

    if (orderStatus.value) {
      queryParams.status = orderStatus.value;
    }

    const queryString = new URLSearchParams(queryParams);
    await new Promise((r) => setTimeout(r, 1000));
    await useFetch(`${api}${endpoint}?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    }).then((response) => {
      paginatedOrders.value = response.data.value;
      isLoading.value = false;
    });
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
};

const changePage = (page) => {
  currentPage.value = page;
  fetchOrders();
};

const resetCategory = () => {
  orderStatus.value = null;
  fetchFirstPage();
};

const fetchFirstPage = () => {
  currentPage.value = 1;
  fetchOrders();
};

onMounted(async () => {
  if (props.defaultOrderStatus) {
    orderStatus.value = props.defaultOrderStatus;
  }
  await fetchOrders();
});
</script>
<style scoped>
.bi {
  margin: 0 !important;
}
</style>
