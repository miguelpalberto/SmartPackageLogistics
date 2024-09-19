<template>
    <div class="row g-4">
        <div class="col-12 mb-3">
            <div class="d-flex gap-2 justify-content-between">
                <button class="btn btn-primary" type="button" @click="navigateTo('/')">
                    <i class="bi bi-arrow-left"></i>
                    &nbsp;
                    <span>Continue Shopping</span>
                </button>
            </div>
        </div>
        <div class="col-12">
            <h4>Order Details</h4>
            <hr>
            <cart-order-item-table :orderItems="cartStore.cart" :isParentLoading="isLoading" :total="cartStore.total"
                @increaseQuantity="cartStore.increaseQuantity" @decreaseQuantity="cartStore.decreaseQuantity"
                @removeFromCart="cartStore.removeFromCart" />
        </div>
        <div class="col-md-12" v-if="cartStore.count > 0">
            <h4>Billing Details</h4>
            <hr>
            <form class="row m-0 p-2 g-2 needs-validation border border-2 rounded" novalidate @submit.prevent="tryOrder">
                <div class="mb-1">
                    <label for="address" class="form-label">Address<span class="text-danger">*</span>
                        &nbsp;<span class="text-muted">(required)</span></label>
                    <input type="address" class="form-control" :class="{ 'is-invalid': errors.address }" id="address"
                        :disabled="isLoading" required v-model="address">
                    <common-field-error-message :error="errors.address" />
                </div>
                <div class="mb-1">
                    <label for="phoneNumber" class="form-label">Phone Number<span class="text-danger">*</span>
                        &nbsp;<span class="text-muted">(required)</span></label>
                    <input type="phoneNumber" class="form-control" :class="{ 'is-invalid': errors.phoneNumber }"
                        id="phoneNumber" :disabled="isLoading" required v-model="phoneNumber">
                    <common-field-error-message :error="errors.phoneNumber" />
                </div>
                <div class="mb-1">
                    <label for="postcode" class="form-label">Postcode<span class="text-danger">*</span>
                        &nbsp;<span class="text-muted">(required)</span></label>
                    <input type="postcode" class="form-control" :class="{ 'is-invalid': errors.postCode }" id="postcode"
                        :disabled="isLoading" required v-model="postCode">
                    <common-field-error-message :error="errors.postCode" />
                </div>
                <div class="mb-3">
                    <label for="city" class="form-label">City<span class="text-danger">*</span>
                        &nbsp;<span class="text-muted">(required)</span></label>
                    <input type="city" class="form-control" :class="{ 'is-invalid': errors.city }" id="city"
                        :disabled="isLoading" required v-model="city">
                    <common-field-error-message :error="errors.city" />
                </div>
                <div class="d-flex justify-content-start">
                    <button class="btn btn-success" type="submit" :disabled="isLoading || !isFormValid">
                        <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="isLoading"></span>
                        <span role="order">Place order</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { useCartStore } from '~/store/cart';
import { useAuthStore } from '~/store/auth-store';
import { useToast } from 'vue-toastification';
import { ref, watch } from 'vue';
const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();
const isLoading = ref(false);


const address = ref('');
const phoneNumber = ref('');
const postCode = ref('');
const city = ref('');

const errors = reactive({
    address: null,
    phoneNumber: null,
    postCode: null,
    city: null
});

//use watch instead
const isAddressValid = ref(false)
const isPhoneNumberValid = ref(false)
const isPostCodeValid = ref(false)
const isCityValid = ref(false)


watch(address, () => {
    isAddressValid.value = validateAddress()
})

watch(phoneNumber, () => {
    isPhoneNumberValid.value = validatePhoneNumber()
})

watch(postCode, () => {
    isPostCodeValid.value = validatePostcode()
})

watch(city, () => {
    isCityValid.value = validateCity()
})

const validateAddress = () => {
    if (!address.value || address.value.length === 0) {
        errors.address = 'Address is required';
        return false;
    }

    if (address.value.length < 5) {
        errors.address = 'Address must be at least 5 characters';
        return false;
    }

    if (address.value.length > 200) {
        errors.address = 'Address must be less than 200 characters';
        return false;
    }

    errors.address = null;
    return true;
}

const validatePhoneNumber = () => {
    if (!phoneNumber.value || phoneNumber.value.length === 0) {
        errors.phoneNumber = 'Phone number is required';
        return false;
    }

    if (phoneNumber.value.length != 9) {
        errors.phoneNumber = 'Phone number must be exact than 9 characters';
        return false;
    }

    if (!phoneNumber.value.startsWith('9')) {
        errors.phoneNumber = 'Invalid phone number format (e.g. 9xxxxxxxx)';
        return false;
    }

    errors.phoneNumber = null;
    return true;
}

const validatePostcode = () => {
    if (!postCode.value || postCode.value.length === 0) {
        errors.postCode = 'Postcode is required';
        return false;
    }

    if (!postCode.value.match(/^[0-9]{4}-[0-9]{3}?$/)) {
        errors.postCode = 'Invalid postcode';
        return false;
    }

    errors.postCode = null;
    return true;
}

const validateCity = () => {
    if (!city.value || city.value.length === 0) {
        errors.city = 'City is required';
        return false;
    }

    if (city.value.length > 100) {
        errors.city = 'City must be less than 100 characters';
        return false;
    }

    errors.city = null;
    return true;
}

const isFormValid = computed(() => {
    return isAddressValid.value
        && isPostCodeValid.value
        && isPhoneNumberValid.value
        && isCityValid.value;
});


const tryOrder = () => {
    if (cartStore.cart.length === 0) {
        return;
    }

    if (!authStore.isAuthenticated) {
        toast.error('You must be logged in to order.');
        navigateTo('/auth/login');
    }
    else {
        isLoading.value = true;

        cartStore.order({
            address: address.value,
            phoneNumber: phoneNumber.value,
            postCode: postCode.value,
            city: city.value
        }, authStore.token)
            .then(() => {
                toast.success('Order placed successfully.');
                navigateTo('/');
            })
            .catch(error => {
                toast.error(error.message);
            })
            .finally(() => {
                isLoading.value = false;
            });
    }
}
</script>
<style scoped>
.bi {
    margin: 0 !important;
}
</style>
```