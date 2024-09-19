<template>
    <div class="table-responsive">
        <table class="table table-hover">
            <thead class="table-dark">
                <tr>
                    <th>
                    </th>
                    <th class="align-middle text-start">
                        Item
                    </th>
                    <th class="align-middle text-center">
                        Quantity
                    </th>
                    <th class="align-middle text-center">
                        Unit Price
                    </th>
                    <th class="align-middle text-center">
                        Package Price
                    </th>
                    <th class="align-middle text-center">
                        Subtotal
                    </th>
                    <th class="align-middle text-end"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="orderItems.length === 0">
                    <td colspan="8">
                        <p class="text-center">Cart is empty</p>
                    </td>
                </tr>
                <tr v-else v-for="orderItem in orderItems" :key="orderItem.index">
                    <td class="align-middle text-center">
                        <img :src="getProductImgSrc(orderItem.product)" class="img-fluid" width="65" height="65" style="object-fit: contain;" />
                    </td>
                    <td class="align-middle text-start">
                        {{ toPackageDescription(orderItem.packageType, orderItem.product) }}
                    </td>
                    <td class="align-middle text-center">
                        {{ orderItem.quantity }}
                    </td>
                    <td class="align-middle text-center">
                        {{ orderItem.product.price.toFixed(2) }}€
                    </td>
                    <td class="align-middle text-center">
                        {{ calculatePackagePrice(orderItem.product, orderItem.packageType) }}€
                    </td>
                    <td class="align-middle text-center">
                        {{ orderItem.subTotal.toFixed(2) }}€
                    </td>
                    <td class="align-middle text-end">
                        <div class="d-flex justify-content-end gap-1">
                            <button class="btn btn-xs btn-light" @click="decreaseQuantity(orderItem.index)"
                                :disabled="isParentLoading">
                                <i class="bi bi-dash-circle"></i>
                            </button>
                            <button class="btn btn-xs btn-light" @click="increaseQuantity(orderItem.index)"
                                :disabled="isParentLoading">
                                <i class="bi bi-plus-circle"></i>
                            </button>
                            <button class="btn btn-xs btn-danger" @click="removeFromCart(orderItem.index)"
                                :disabled="isParentLoading">
                                <i class="bi bi-xs bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" class="align-middle text-end">
                        <b>Total:</b>
                    </td>
                    <td class="text-center">
                        {{ total.toFixed(2) }}€
                    </td>
                    <td>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
<script setup>
const props = defineProps({
    orderItems: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    isParentLoading: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['removeFromCart', 'increaseQuantity', 'decreaseQuantity'])

const removeFromCart = (orderItemIndex) => {
    emit('removeFromCart', orderItemIndex)
}

const increaseQuantity = (orderItemIndex) => {
    emit('increaseQuantity', orderItemIndex)
}

const decreaseQuantity = (orderItemIndex) => {
    emit('decreaseQuantity', orderItemIndex)
}

const calculatePackagePrice = (product, packageType) => {
    let packagePrice = 0
    switch (packageType) {
        case "primary":
            packagePrice = product.price
            break;
        case "secondary":
            packagePrice = product.price * product.secondaryPackQuantity
            break;
        case "tertiary":
            packagePrice = product.price * product.secondaryPackQuantity * product.tertiaryPackQuantity
            break;
    }

    return packagePrice.toFixed(2);
}

const toPackageDescription = (packageType, product) => {
    switch (packageType) {
        case "primary":
            return `${product.primaryPackageType} with ${product.primaryPackQuantity} ${product.primaryPackageMeasurementUnit} of ${product.name} (ref#${product.reference})`
        case "secondary":
            return `Box with ${product.secondaryPackQuantity} ${product.primaryPackageType}s of ${product.name} (ref#${product.reference})`
        case "tertiary":
            return `Pallet with ${product.tertiaryPackQuantity} Boxes of ${product.name} (ref#${product.reference})`
    }
}

</script>
<style scoped>
.bi {
    margin: 0 !important;
}
</style>