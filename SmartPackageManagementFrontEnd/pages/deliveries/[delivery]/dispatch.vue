<template>
    <button class="btn btn-secondary mb-3" :disabled="isLoading" @click="this.$router.go(-1)">
        Back to Previous Page
    </button>
    <div class="container-fluid">
        <div class="row">
            <h1>Dispatching Delivery #{{ $route.params.delivery }}</h1>
            <div v-if="isLoading" class="col-12">
                <common-loading-component />
            </div>
            <div v-else class="col-12">
                <div class="row">
                    <div class="col-12">
                        <standard-packages-table :standard-packages="delivery.standardPackages" title="Delivery Packages" />
                    </div>
                    <div class="col-12">
                        <common-loading-component v-if="isLoadingSensors" />
                        <div v-else class="row">
                            <div class="table-responsive">
                                <h2>Available Sensors</h2>
                                <table class="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="align-middle text-start">Name</th>
                                            <th class="align-middle text-center">Sensor Type</th>
                                            <th class="align-middle text-center">Assign to Package</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="paginatedAvailableSensors">
                                        <tr v-for="sensor in paginatedAvailableSensors.data" :key="sensor.id">
                                            <td class="align-middle text-start">
                                                {{ sensor.name }}
                                            </td>
                                            <td class="align-middle text-center">
                                                {{ sensor.sensorType.name }}
                                            </td>
                                            <td class="align-middle text-center">
                                                <!-- select with available package codes-->
                                                <select class="form-select" @change="(e) => onSensorToggle(e, sensor.id)">
                                                    <option v-for="(packageCode, index) in availablePackagesCodes"
                                                     :selected="sensorPackageCodes.get(sensor.id) === packageCode.value"
                                                      :key="index"
                                                       :value="packageCode.value"
                                                        :disabled="packageCode.disabled">
                                                        {{ packageCode.text }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <pagination v-if="paginatedAvailableSensors" :metadata="paginatedAvailableSensors.metadata"
                            :changePage="changePage" />
                    </div>
                </div>
                <button class="btn btn-primary" type="button" @click="dispatchDelivery">
                    Dispatch Delivery
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/store/auth-store';
import Pagination from "~/pages/pagination.vue";
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const delivery = ref(null)
const paginatedAvailableSensors = ref(null)
const isLoading = ref(true)
const isLoadingSensors = ref(true)
const currentPage = ref(1);

const sensorPackageCodes = ref(new Map())

const defaultOption = { value: '', text: "Select a package", disabled: false }

const availablePackagesCodes = ref([])

const setAvailablePackageCodes = () => {
    const codes = []
    codes.push(defaultOption)
    delivery.value.standardPackages.forEach((standardPackage) => {
        if (sensorPackageCodes.value.size === 0) {
            codes.push({ value: 's_' + standardPackage.code, text: standardPackage.code, disabled: false })
            return
        }
        let isFound = false
        sensorPackageCodes.value.forEach((value, key) => {
            if (value === 's_' + standardPackage.code) {
                codes.push({ value: 's_' + standardPackage.code, text: standardPackage.code, disabled: true })
                isFound = true
                return
            }
        })

        if (!isFound) {
            codes.push({ value: 's_' + standardPackage.code, text: standardPackage.code, disabled: false })
        }
    })

    
    delivery.value.transportPackage.forEach((transportPackage) => {
        if (sensorPackageCodes.value.size === 0) {
            codes.push({ value: 's_' + transportPackage.code, text: transportPackage.code, disabled: false })
            return
        }
        let isFound = false
        sensorPackageCodes.value.forEach((value, key) => {
            if (value === 's_' + transportPackage.code) {
                codes.push({ value: 's_' + transportPackage.code, text: transportPackage.code, disabled: true })
                isFound = true
                return
            }
        })

        if (!isFound) {
            codes.push({ value: 's_' + transportPackage.code, text: transportPackage.code, disabled: false })
        }
    })

    availablePackagesCodes.value = codes
}

const onSensorToggle = (event, sensorId) => {
    const packageCode = event.target.value
    if (packageCode === '') {
        sensorPackageCodes.value.delete(sensorId)
        setAvailablePackageCodes()
        return
    }
    
    sensorPackageCodes.value.set(sensorId, packageCode)
    setAvailablePackageCodes()
}

const fetchDelivery = async (deliveryId) => {
    const api = config.public.API_URL;
    const endpoint = `/deliveries/${deliveryId}`
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
            delivery.value = response.data.value;
            isLoading.value = false
        })
    } catch (error) {
        console.log(error)
        toast.error('Error fetching delivery');
        router.back(-1);
        isLoading.value = false
    }
}

const fetchAvailableSensors = async () => {
    isLoadingSensors.value = true;
    const api = config.public.API_URL;
    const endpoint = `/sensors/all`

    const params = {
        pageSize: 10,
        page: currentPage.value,
        isAvailable: true
    };

    const queryString = new URLSearchParams(params);
    //wait 1 second to show loading component
    await new Promise(r => setTimeout(r, 1000));
    try {
        await useFetch(`${api}${endpoint}?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.token}`
            }
        }).then((response) => {
            isLoadingSensors.value = false;
            paginatedAvailableSensors.value = response.data.value;
            setAvailablePackageCodes()
        })
    } catch (error) {
        isLoadingSensors.value = false;
        toast.error('Error fetching sensors');
        console.log(error)
    }
}

const dispatchDelivery = async () => {
    isLoading.value = true;
    await new Promise(r => setTimeout(r, 1000));
    Promise.all([updateStatus(), setSensors()])
        .then(() => {
            toast.success('Delivery dispatched');
            router.back(-1);
        })
        .catch((error) => {
            console.log(error);
            toast.error('Error dispatching delivery');
        })
        .finally(() => {
            isLoading.value = false;
        })
}

const updateStatus = async () => {
    const api = config.public.API_URL;
    const endpoint = `/deliveries/${delivery.value.id}/update-status`
    try {
        await useFetch(`${api}${endpoint}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.token}`
            },
            body: JSON.stringify('DISPATCHED')
        })
    } catch (error) {
        console.log(error);
    }
}

const setSensors = async () => {
    if (sensorPackageCodes.value.size === 0) {
        return
    }

    sensorPackageCodes.value.forEach(async (value, key) => {
        const packageCode = value
        const sensorId = key
        if (packageCode.startsWith('s_')) {
            await setStandardPackageSensor(packageCode.substring(2), sensorId)
        }
        else {
            await setTransportPackageSensor(packageCode.substring(2), sensorId)
        }
    })
}

const setStandardPackageSensor = async (packageCode, sensorId) => {
    if (sensorPackageCodes.value.size === 0) {
        return
    }

    const api = config.public.API_URL;
    const endpoint = `/standard-packages/${packageCode}/set-sensor`

    await useFetch(`${api}${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
            "id" : sensorId
        })
    })
}

const setTransportPackageSensor = async (packageCode, sensorId) => {
    if (sensorPackageCodes.value.size === 0) {
        return
    }

    const api = config.public.API_URL;
    const endpoint = `/transport-packages/${packageCode}/set-sensor`

    await useFetch(`${api}${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
            "id" : sensorId
        })
    })
}

const changePage = async (page) => {
    currentPage.value = page;
    await fetchAvailableSensors()
}

onMounted(async () => {
    if (route.params.delivery) {
        try {
            isLoading.value = true;
            await fetchDelivery(route.params.delivery),
                await fetchAvailableSensors()
        }
        catch (error) {
            toast.error('Something went wrong');
            router.back(-1);
        }
        finally {
            isLoading.value = false;
        }
    }
    else {
        await new Promise(r => setTimeout(r, 1000));
        toast.error('Delivery not found');
        router.back(-1);
    }
})

</script>