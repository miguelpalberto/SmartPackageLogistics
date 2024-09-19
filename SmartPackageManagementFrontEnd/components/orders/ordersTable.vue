<template>
    <div class="table-responsive">
        <table class="table table-hover">
            <thead class="table-dark">
                <tr>
                    <th class="align-middle text-start">Reference</th>
                    <th class="align-middle text-center">Date Created</th>
                    <th class="align-middle text-center">Total</th>
                    <th class="align-middle text-center">Status</th>
                    <th class=""></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="orders?.length == 0">
                    <td colspan="5" class="text-center"><b>No orders found</b></td>
                </tr>
                <tr v-for="order in orders" :key="order.id">
                    <td class="align-middle text-start">
                        {{ order.id }}
                    </td>
                    <td class="align-middle text-center">
                        {{ timeStampToLocaleString(order.date) }}
                    </td>
                    <td class="align-middle text-center">
                        {{ order.totalPrice.toFixed(2) }}€
                    </td>
                    <td class="align-middle text-center">
                        <span :class="statusToBadge(order.status)">{{ order.status }}</span>
                    </td>
                    <td class="align-middle text-end">
                        <div class="d-flex flex-row justify-content-end gap-1">
                            <nuxt-link :to="`/orders/${order.id}/deliveries`" class="btn btn-xs btn-success" v-if="order.status != 'PENDING'">
                                <i class="bi bi-truck"></i>
                            </nuxt-link>
                            <nuxt-link :to="`/orders/${order.id}/logs`" class="btn btn-xs btn-secondary">
                                <i class="bi bi-journal-text"></i>
                            </nuxt-link>
                            <nuxt-link :to="`/orders/${order.id}`" class="btn btn-xs btn-dark">
                                <i class="bi bi-eye-fill"></i>
                            </nuxt-link>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    orders: {
        type: Array,
        required: true
    },
    isParentLoading: {
        type: Boolean,
        required: true
    },
    isLogisticOperator: {
        type: Boolean,
        default: false
    }
})

const statusToBadge = (status) => {
    switch (status) {
        case 'PENDING':
            return 'badge bg-warning text-dark'
        case 'ACCEPTED':
            return 'badge bg-success'
        case 'REJECTED':
            return 'badge bg-danger'
        case 'COMPLETED':
            return 'badge bg-primary'
        default:
            return 'badge bg-secondary'
    }
}

</script>
<style scoped>
.bi {
    margin: 0 !important;
}
</style>