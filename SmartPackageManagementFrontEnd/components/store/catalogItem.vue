<template>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 p-3 d-flex align-items-stretch">
        <div class="card flex-grow-1 d-flex align-items-center" style="width: 100%">
            <div class="card-header w-100 text-center">
                <b>{{ product.productCategory }}</b>
            </div>
            <img :src="getProductImgSrc(product)" class="card-img-top" alt="product" style="max-height: 200px; object-fit: contain;">
            <div class="card-body p-2 text-center">
                <h5 class="fw-bolder">
                    {{ product.name }} <br>
                    {{ `(ref#${product.reference})` }}
                </h5>
                <p class="overflow-hidden">{{ product.description }}</p>
            </div>

            <div class="card-footer pt-0 border-top-0 bg-transparent w-100 text-center">
                <p class="card-text fw-bolder">
                    {{ product.price }}€ per smallest package
                </p>
                <div class="d-flex flex-column">
                    <div class="form-floating w-100">
                        <select class="form-select" name="packageType" v-model="packageType">
                            <option value="primary" selected>{{ `${product.primaryPackageType} with
                                                            ${product.primaryPackQuantity} ${product.primaryPackageMeasurementUnit} of ${product.name}`
                            }}</option>
                            <option value="secondary">{{ `Box with ${product.secondaryPackQuantity}
                                                            ${product.primaryPackageType}s` }} </option>
                            <option value="tertiary">{{ `Pallet with ${product.tertiaryPackQuantity} Boxes` }}</option>
                        </select>
                        <label for="packageType" class="form-label">Size</label>
                    </div>
                    <div class="d-flex flex-row">
                        <div class="form-floating w-100">
                            <input type="number" min="0" max="50" maxlength="2" class="form-control" v-model="quantity"
                                name="quantity">
                            <label for="quantity" class="form-label">Qty.</label>
                        </div>
                        <button type="button" @click="addToCart" class="btn btn-success" :disabled="quantity <= 0">
                            <i class="bi bi-cart-plus-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "~/store/cart.js";
import { useToast } from "vue-toastification";
import defaultImage from "~/assets/images/no_image_available.png";

const cartStore = useCartStore();
const toast = useToast();
const props = defineProps({
    product: {
        type: Object,
        required: true
    },
})

const packageType = ref("primary");
const quantity = ref(0);

const addToCart = () => {
    if (quantity.value === 0) {
        toast.error("Quantity must be greater than 0.");
        return;
    }

    if (quantity.value > 50) {
        toast.error("Quantity must be less than 50.");
        return;
    }

    cartStore.addToCart(props.product, packageType.value, quantity.value);
    toast.success(`Item has been added to cart.`)

    quantity.value = 0;
}

</script>
<style scoped>
.bi {
    margin: 0 !important;
}
</style>
