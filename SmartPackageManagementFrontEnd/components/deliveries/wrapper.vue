<template>
    <div class="container-fluid">
        <h1>{{ title }}</h1>
        <div class="row g-3">
            <div class="col-xs-12 col-md-3" v-if="processDeliveries === false">
                <label for="inputStatus" style="font-size: 14px" class="form-label">Status</label>
                <div class="input-group input-group-sm">
                    <select id="inputStatus" :disabled="isLoading" style="font-size: 14px" v-model="status"
                        class="form-select" @change="fetchFirstPage()">
                        <option v-for="status in statuses" :key="status.value" :value="status.value">
                            {{ status.text }}
                        </option>
                    </select>
                    <button :disabled="isLoading || status == null" class="btn btn-light btn-sm" @click="resetStatus">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
            <div v-if="isLoading" class="col-12">
                <common-loading-component />
            </div>
            <deliveries-table v-else :deliveries="paginatedDeliveries?.data" :is-parent-loading="isLoading" :show-actions="true" />
            <pagination v-if="paginatedDeliveries" :metadata="paginatedDeliveries.metadata" :changePage="changePage" />
        </div>
    </div>
</template>
<script setup>
import Pagination from "~/pages/pagination.vue";
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/store/auth-store';
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const currentPage = ref(1);
const paginatedDeliveries = ref(null)
const isLoading = ref(true)
const status = ref(null)

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    processDeliveries: {
        type: Boolean,
        default: false,
    },
})

const statuses = [
    { value: null, text: "All" },
    { value: "PROCESSING", text: "Processing" },
    { value: "DISPATCHED", text: "Dispatched" },
    { value: "INTRANSIT", text: "In transit" },
    { value: "DELIVERED", text: "Delivered" },
];

const fetchDeliveries = async () => {
    isLoading.value = true;
    const api = config.public.API_URL;
    const endpoint = `/deliveries/all`
    const queryParams = {
        pageSize: 10,
        page: currentPage.value,
    };

    if (status.value) {
        queryParams.status = status.value;
    }

    const queryString = new URLSearchParams(queryParams);
    await new Promise((r) => setTimeout(r, 1000));
    try {
        await useFetch(`${api}${endpoint}?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.token}`
            }
        }).then((response) => {
            paginatedDeliveries.value = response.data.value;
            isLoading.value = false
            console.log(paginatedDeliveries.value)
        })
    } catch (error) {
        toast.error('Something went wrong');
        router.back(-1);
        isLoading.value = false
    }
}

const resetStatus = () => {
    status.value = null;
    fetchFirstPage();
};

const fetchFirstPage = () => {
    currentPage.value = 1;
    fetchDeliveries();
};

const changePage = async (page) => {
    currentPage.value = page;
    await fetchDeliveries();
}

onMounted(async () => {
    if (props.processDeliveries) {
        status.value = "PROCESSING";
    }
    await fetchDeliveries();
})

</script>