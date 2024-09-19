<template>
    <div class="col-12 mx-auto table-responsive">
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th class="align-middle text-start">Id</th>
                    <th class="align-middle text-center">Dispatched Date</th>
                    <th class="align-middle text-center">Delivered Date</th>
                    <th class="align-middle text-center">Status</th>
                    <th class="align-middle text-end" v-if="showActions"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="deliveries.length == 0">
                    <td colspan="3" class="text-center"><b>No deliveries found</b></td>
                </tr>
                <template v-for="delivery in deliveries" :key="delivery.id">
                    <tr>
                        <td class="align-middle text-start">
                            {{ delivery.id }}
                        </td>
                        <td class="align-middle text-center">
                            {{ timeStampToLocaleString(delivery.dispatchedDate) }}
                        </td>
                        <td class="align-middle text-center">
                            {{ delivery.deliveredDate ? timeStampToLocaleString(delivery.deliveredDate) : 'Not delivered yet' }}
                        </td>
                        <td class="align-middle text-center">
                            <span :class="statusToBadge(delivery.status)">{{ delivery.status }}</span>
                        </td>
                        <td class="align-middle text-end" v-if="showActions">
                            <div class="d-flex flex-row justify-content-end gap-1">
                                <nuxt-link v-if="delivery.status === 'PROCESSING'" :to="`/deliveries/${delivery.id}/dispatch`" class="btn btn-xs btn-primary">
                                    <i class="bi bi-send-check"></i>
                                    <span>
                                        &nbsp; Dispatch
                                    </span>
                                </nuxt-link>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="showDetails">
                        <td colspan=4>
                            <standard-packages-table :standardPackages="delivery.standardPackages" title="Delivery Packages" />
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>
<script setup>

const props = defineProps({
    deliveries: {
        type: Array,
        required: true
    },
    isParentLoading: {
        type: Boolean,
        required: true
    },
    showDetails:{
        type: Boolean,
        required: false,
        default: false
    },
    showActions:{
        type: Boolean,
        required: false,
        default: false
    }
})

const statusToBadge = (status) => {
    //DISPATCHED, INTRANSIT, DELIVERED
    switch (status) {
        case 'DISPATCHED':
            return 'badge bg-warning'
        case 'INTRANSIT':
            return 'badge bg-warning'
        case 'DELIVERED':
            return 'badge bg-success'
        default:
            return 'badge bg-primary'
    }
}


</script>
<style scoped>

.bi {
    margin: 0 !important;
}
</style>