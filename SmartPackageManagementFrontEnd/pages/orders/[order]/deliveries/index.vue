<template>
    <button class="btn btn-secondary mb-3" :disabled="isLoading" @click="this.$router.go(-1)">
        Back to Previous Page
    </button>
    <div class="container-fluid">
        <div class="row">
            <h1>Deliveries for Order #{{ $route.params.order }}</h1>
            <div v-if="isLoading" class="col-12">
                <common-loading-component />
            </div>
            <deliveries-table v-else :deliveries="deliveries" :is-parent-loading="isLoading" show-details="true" />
        </div>
    </div>
</template>
<script setup>
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/store/auth-store';
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const deliveries = ref([])
const isLoading = ref(true)

const fetchDeliveries = async (orderId) => {
    const api = config.public.API_URL;
    const endpoint = `/orders/${orderId}/deliveries`
    //wait 1 second to show loading component
    await new Promise(r => setTimeout(r, 1000));
    try {
        await useFetch(`${api}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.token}`
            }
        }).then((response) => {
            deliveries.value = response.data.value;
            isLoading.value = false
        })
    } catch (error) {
        toast.error('Something went wrong');
        router.back(-1);
        isLoading.value = false
    }
}

onMounted(async () => {
    if (route.params.order) {
        await fetchDeliveries(route.params.order);
    }
    else {
        await new Promise(r => setTimeout(r, 1000));
        toast.error('Order not found');
        router.back(-1);
    }
})

</script>