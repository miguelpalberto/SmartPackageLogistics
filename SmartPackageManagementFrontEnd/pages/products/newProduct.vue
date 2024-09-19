<template>
  <div class="container mt-5">
    <h1>Create New Product</h1>
    <br>

      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <div class="row mb-3">
      <div class="card-body col-md-8 mx-auto">
        <form @submit.prevent="">
          
          <div class="row mb-3">

            <div class="col-md-6">
              <label for="inputProductReference" class="form-label"
                >Product Reference:</label
              >
              <input
                type="text"
                class="form-control"
                v-model="reference"
                required
              />
            </div>

            <div class="col-md-6">
              <label for="inputProductName" class="form-label"
                >Product Name:</label
              >
              <input type="text" class="form-control" v-model="name" required />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-12">
              <label for="inputProductDescription" class="form-label"
                >Product Description:</label
              >
              <textarea
                type="text-area"
                class="form-control"
                v-model="description"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="inputProductPrice" class="form-label"
                >Unit Price:</label
              >
              <input
                type="number"
                class="form-control"
                v-model="price"
                required
                pattern="\d*"
              />
            </div>
            <div class="col-md-4">
              <label for="inputProductVat" class="form-label"
                >VAT Rate:</label
              >
              <input
                type="number"
                class="form-control"
                v-model="vat"
                required
                pattern="\d*"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="inputProductCategoryId" class="form-label"
                >Category (ID):</label
              >
              <input
                type="text"
                class="form-control"
                v-model="productCategoryId"
                required
              />
            </div>
            <div class="col-md-4">
              <label for="inputPrimaryPackageMeasurementUnitId" class="form-label"
                >Unit of Measurement (ID):</label
              >
              <input
                type="text"
                class="form-control"
                v-model="primaryPackageMeasurementUnitId"
                required
              />
            </div>
            <div class="col-md-4">
              <label for="inputPrimaryPackageTypeId" class="form-label"
                >Type of Primary Package (ID):</label
              >
              <input
                type="text"
                class="form-control"
                v-model="primaryPackageTypeId"
                required
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="inputProductPrimaryPackQuantity" class="form-label"
                >Primary Qty:</label
              >
              <input
                type="number"
                class="form-control"
                v-model="primaryPackQuantity"
                required
                pattern="\d*"
              />
            </div>
            <div class="col-md-4">
              <label for="inputProductSecondaryPackQuantity" class="form-label"
                >Secundary Qty:</label
              >
              <input
                type="number"
                class="form-control"
                v-model="secondaryPackQuantity"
                required
                pattern="\d*"
              />
            </div>
            <div class="col-md-4">
              <label for="inputProductTertiaryPackQuantity" class="form-label"
                >Terciary Qty:</label
              >
              <input
                type="number"
                class="form-control"
                v-model="tertiaryPackQuantity"
                required
                pattern="\d*"
              />
            </div>
          </div>

          <div class="d-grid gap-2 col-md-4 mx-auto">
            <button type="button" class="btn btn-primary" @click="submitForm">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification";
const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const api = config.public.API_URL;
const reference = ref("");
const name = ref("");
const description = ref("");
const price = ref(0);
const manufacturerUsername = ref("");
const primaryPackageTypeId = ref("");
const primaryPackageMeasurementUnitId = ref("");
const primaryPackQuantity = ref("");
const secondaryPackQuantity = ref("");
const tertiaryPackQuantity = ref("");
const productCategoryId = ref("");
const vat = ref("");
const minValue = ref("");
const maxValue = ref("");
const successMessage = ref("");
const errorMessage = ref("");

const submitForm = async () => {
  try {
    const response = await fetch(`${api}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        reference: reference.value,
        name: name.value,
        description: description.value,
        price: price.value,
        manufacturerUsername: authStore.user.username,
        primaryPackageTypeId: primaryPackageTypeId.value,
	      primaryPackageMeasurementUnitId: primaryPackageMeasurementUnitId.value,
	      primaryPackQuantity: primaryPackQuantity.value,
	      secondaryPackQuantity: secondaryPackQuantity.value,
	      tertiaryPackQuantity: tertiaryPackQuantity.value,
	      productCategoryId: productCategoryId.value,
      }),
    });

    if (response.ok) {
      //console.log("Product created successfully");
      toast.success("New product created successfully");
      //successMessage.value = "Product created successfully";
      // Clear error message
      errorMessage.value = "";
      router.push({
        path: "/products/productsList",
        query: { successMessage: "" },
      });
    } else {
      //console.error("Error creating product");
      toast.error("Error creating product");
      //errorMessage.value = "Error creating product";
      successMessage.value = "";
    }
  } catch (error) {
    //console.error("An unexpected error occurred:", error);
    toast.error("An unexpected error occurred");
    errorMessage.value = "An unexpected error occurred";
    successMessage.value = "";
  }
};

onMounted(() => {
  if (!authStore.user) {
    navigateTo("/auth/login");
  }
});
</script>

<style scoped>
.card-body {
  background-color: rgb(220, 220, 220);
}
</style>
