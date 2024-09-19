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
                <h1>Create Delivery for Order #{{ $route.params.order }}</h1>
                <deliveries-create-container v-for="orderItem in order.orderItems" :key="orderItem.id" :orderItem="orderItem"
                    :isParentLoading="isLoading" @add-package-code="addPackageCode"
                    @remove-package-code="removePackageCode" @remove-order-item="removeOrderItem"/>
            </div>
        </div>
        <div class="row mt-2">
            <button class="btn btn-primary" :disabled="isLoading || selectedPackages.size === 0" @click="createDelivery">
                {{ selectedPackages.size > 0 ? `Submit Delivery` : 'Please select Packages'  }}
            </button>
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
const order = ref(null);
const isLoading = ref(true);

const selectedPackages = ref(new Map())

const addPackageCode = (orderItemId, packageCode) => {
    if (!selectedPackages.value.has(orderItemId)) {
        selectedPackages.value.set(orderItemId, [])
    }
    selectedPackages.value.get(orderItemId).push(packageCode)
}

const removePackageCode = (orderItemId, packageCode) => {
    selectedPackages.value.set(orderItemId, selectedPackages.value.get(orderItemId).filter((code) => code !== packageCode))
}

const removeOrderItem = (orderItemId) => {
    selectedPackages.value.delete(orderItemId)
}

const fetchOrder = async (orderId) => {
    const api = config.public.API_URL;
    const endpoint = `/orders/${orderId}`
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
            order.value = response.data.value;
            isLoading.value = false
            console.log(response);
        })
    } catch (error) {
        console.log(error);
        toast.error('Error fetching order');
        router.back(-1);
    }
}


const createDelivery = async () => {
    isLoading.value = true;
    //wait 1 second to show loading component
    await new Promise(r => setTimeout(r, 1000));
    const api = config.public.API_URL;
    const endpoint = `/deliveries`
    const data = {
        orderId: order.value.id,
        packageCodes: []
    }
    selectedPackages.value.forEach((value, key) => {
        data.packageCodes.push(...value)
    })
    
    await useFetch(`${api}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.token}`
            },
            body: JSON.stringify(data)
        }).then((response) => {
            console.log(response);
            toast.success('Delivery created');
            router.push(`/orders/${order.value.id}/deliveries`)
        })
        .error((error) => {
            console.log(error);
            toast.error('Error creating delivery');
        })
}

onMounted(async () => {
    if (route.params.order) {
        await fetchOrder(route.params.order);
    }
    else {
        await new Promise(r => setTimeout(r, 1000));
        toast.error('Order not found');
        router.back(-1);
    }
})
</script>