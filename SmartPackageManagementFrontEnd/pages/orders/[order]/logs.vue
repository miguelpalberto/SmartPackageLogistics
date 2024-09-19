<template>
    <button class="btn btn-secondary mb-3" :disabled="isLoading" @click="this.$router.go(-1)">
        Back to Previous Page
    </button>
    <div class="container-fluid">
        <div class="row">
            <div v-if="isLoading" class="col-12">
                <common-loading-component />
            </div>
            <div v-else class="col-12 mx-auto table-responsive">
                <h1>Logs for Order #{{ $route.params.order }}</h1>
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th class="align-middle text-start">Date</th>
                            <th class="align-middle text-center">New Status</th>
                            <th class="align-middle text-center">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="orderLogs?.length == 0">
                            <td colspan="3" class="text-center"><b>No order logs found</b></td>
                        </tr>
                        <tr v-for="orderLog in orderLogs" :key="orderLog.id">
                            <td class="align-middle text-start">
                                {{ timeStampToLocaleString(orderLog.timestamp) }}
                            </td>
                            <td class="align-middle text-center">
                                {{ orderLog.orderStatus }}
                            </td>
                            <td class="align-middle text-center">
                                {{ orderLog.logEntry }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
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

const orderLogs = ref([])
const isLoading = ref(true)

const fetchOrderLogs = async (orderId) => {
    const api = config.public.API_URL;
    const endpoint = `/orderlogs/all?orderId=${orderId}`
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
            orderLogs.value = response.data.value;
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
        await fetchOrderLogs(route.params.order);
    }
    else {
        await new Promise(r => setTimeout(r, 1000));
        toast.error('Order not found');
        router.back(-1);
    }
})

</script>