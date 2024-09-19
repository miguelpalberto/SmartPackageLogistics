<template>
    <div class="table-responsive">
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th>
                    </th>
                    <th class="align-middle text-start">
                        Item
                    </th>
                    <th class="align-middle text-center">
                        Current Stock
                    </th>
                    <th class="align-middle text-center">
                        Quantity Left to Deliver
                    </th>
                    <th class="align-middle text-end">
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="align-middle text-center">
                        <img :src="getProductImgSrc(orderItem.product)" class="img-fluid" width="65" height="65"
                            style="object-fit: contain;" />
                    </td>
                    <td class="align-middle text-start">
                        {{ toPackageDescription(orderItem.packageType, orderItem.product) }}
                    </td>
                    <td class="align-middle text-center">
                        {{ currentStock(orderItem.packageType, orderItem.product) }}
                    </td>
                    <td class="align-middle text-center">
                        <b>
                            {{ `(${virtualQuantityLeft}/${orderItem.quantity})` }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </b>
                    </td>
                    <td v-if="orderItem.quantityLeft > 0" class="align-middle text-end">
                        <div class="btn-group" role="group" aria-label="checkbox buttongroup" v-if="currentStock(orderItem.packageType, orderItem.product) > 0">
                            <input type="checkbox" class="btn-check" :id="`addToDelivery-${orderItem.id}`" autocomplete="off"
                                v-model="showPackages" :disabled="isProcessing">
                            <label class="btn" :class="labelClass(orderItem.id)" :for="`addToDelivery-${orderItem.id}`">Add as
                                Part of Delivery</label>
                        </div>
                        <div class="btn-group" role="group" v-else>
                            <button class="btn btn-secondary" disabled>
                                No Stock Available
                            </button>
                        </div>
                    </td>
                    <td v-else class="align-middle text-end">
                        <div class="btn-group" role="group">
                            <button class="btn btn-success" disabled>
                                Delivered
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="showPackages">
                    <td colspan="5">
                        <h6>Associate Packages to Order Item</h6>
                        <table class="table table-light">
                            <thead class="table-secondary">
                                <tr>
                                    <th class="align-middle text-start">Package code</th>
                                    <th class="align-middle text-center">Material</th>
                                    <th class="align-middle text-end"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="isLoading">
                                    <td class="text-center" colspan="3">
                                        <div class="spinner-grow" style="width: 4rem; height: 4rem;" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else v-for="aPackage in paginatedPackages?.data" :key="aPackage.code">
                                    <td class="align-middle text-start">
                                        {{ aPackage.code }}
                                    </td>
                                    <td class="align-middle text-center">
                                        {{ aPackage.material }}
                                    </td>
                                    <td class="align-middle text-end">
                                        <div class="form-control-lg">
                                            <input class="form-check-input" :disabled="isAddingToDeliveryDisabled && !selectedPackages.includes(aPackage.code)" type="checkbox" :checked="selectedPackages.includes(aPackage.code)" @change="(e) => toggleCheckbox(e, aPackage.code)">
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">
                                        <pagination v-if="paginatedPackages || !isLoading"
                                            :metadata="paginatedPackages.metadata" :changePage="changePage" />
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import Pagination from "~/pages/pagination.vue";
import { useAuthStore } from '~/store/auth-store';
const config = useRuntimeConfig();
const authStore = useAuthStore();
const api = config.public.API_URL;

const props = defineProps({
    orderItem: {
        type: Object,
        required: true
    },
    isParentLoading: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['addPackageCode', 'removePackageCode', 'removeOrderItem'])

const showPackages = ref(false)
const selectedPackages = ref([])
const paginatedPackages = ref(null)
const isLoading = ref(false)
const isAddingToDeliveryDisabled = ref(false)
const currentPage = ref(1);
const isProcessing = computed(() => {
    return isLoading.value || props.isParentLoading
})


const virtualQuantityLeft = computed(() => {
    return props.orderItem.quantity - props.orderItem.quantityLeft + selectedPackages.value.length
})

watch(virtualQuantityLeft, (newValue, oldValue) => {
    isAddingToDeliveryDisabled.value = newValue === props.orderItem.quantity
})

watch(showPackages, async (newValue, oldValue) => {
    if (newValue) {
        await fetchPackages()
    }
    else {
        paginatedPackages.value = null
        selectedPackages.value = []
        currentPage.value = 1
        emit('removeOrderItem', props.orderItem.id)
    }
})

const toggleCheckbox = (e, packageCode) => {
    if (e.target.checked) {
        addPackageCode(packageCode)
    }
    else {
        removePackageCode(packageCode)
    }
}

const addPackageCode = (packageCode) => {
    selectedPackages.value.push(packageCode)
    emit('addPackageCode', props.orderItem.id, packageCode)
}

const removePackageCode = (packageCode) => {
    selectedPackages.value = selectedPackages.value.filter((code) => code !== packageCode)
    emit('removePackageCode', props.orderItem.id, packageCode)
}

const fetchPackages = async () => {
    isLoading.value = true;
    //wait 1 second to show loading component
    await new Promise(r => setTimeout(r, 1000));
    const endpoint = `/standard-packages/getForDelivery?pageSize=10&page=${currentPage.value}&packageType=${props.orderItem.packageType}&productId=${props.orderItem.product.id}`

    try {

        await useFetch(`${api}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.token}`
            }
        }).then((response) => {
            paginatedPackages.value = response.data.value;
            isLoading.value = false;
        })
    }
    catch (error) {
        console.log(error);
        isLoading.value = false;
    }
}

const changePage = (page) => {
    currentPage.value = page;
    fetchPackages();
}

const labelClass = (orderItemId) => {
    if (showPackages.value) {
        return 'btn-primary'
    }
    else {
        return 'btn-outline-secondary'
    }
}
</script>
<style scoped>
.form-check-input[disabled] {
    cursor: not-allowed;
    background-color: silver;
}
</style>