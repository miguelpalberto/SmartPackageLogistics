<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Product Information</h5>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="productReference" class="form-label"
                    >Product Reference</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="productReference"
                    :readonly="!canEdit"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="productName" class="form-label"
                      >Product Name</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="productName"
                      :readonly="!canEdit"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/store/auth-store.js";
import { useToast } from "vue-toastification";
const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const id = route.params.product;
const config = useRuntimeConfig();
const api = config.public.API_URL;

const { data: product } = await useFetch(`${api}/products/${id}`);

const { data: productParams } = await useFetch(
  `${api}/products/${id}/product-parameters`
);

const response = await useFetch(`${api}/sensor-types/all`);
const sensorTypes = response.data.value.data;

const productReference = ref(product.value.reference);
const productCategory = ref(product.value.productCategory);
const productPrice = ref(product.value.price);
const productUnit = ref(product.value.primaryPackageMeasurementUnit);
const productActive = ref(product.value.active);
const productDescription = ref(product.value.description);
const productName = ref(product.value.name);
const productManufacturer = ref(product.value.manufacturerUsername);
const unitStock = ref(product.value.unitStock);
const boxStock = ref(product.value.boxStock);
const palletStock = ref(product.value.containerStock);
const primaryPackQuantity = ref(product.value.primaryPackQuantity);
const secondaryPackQuantity = ref(product.value.secondaryPackQuantity);
const tertiaryPackQuantity = ref(product.value.tertiaryPackQuantity);

const totalStock =
  parseFloat(unitStock) +
  parseFloat(unitStock) * parseFloat(boxStock) +
  parseFloat(unitStock) * parseFloat(boxStock) * parseFloat(palletStock);

const selectedSensorType = ref(null);
const minValue = ref(0);
const maxValue = ref(0);
const showAddQualityParamForm = ref(false);

const canEdit = authStore.user.username === product.value.manufacturerUsername;

const addQualityParamForm = () => {
  showAddQualityParamForm.value = true;
};

const closeAddQualityParamForm = () => {
  showAddQualityParamForm.value = false;
};

const addNewQualityParam = async () => {
  try {
    const response = await fetch(`${api}/product-parameters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        productId: id,
        sensorTypeId: selectedSensorType.value,
        minValue: minValue.value,
        maxValue: maxValue.value,
      }),
    });

    if (response.ok) {
      toast.success("Parameter added successfully");
      showAddQualityParamForm.value = false;
      refresh();
    } else {
      toast.error("Error adding sensor type");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const deleteProduct = async () => {
  try {
    const response = await fetch(`${api}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      toast.success("Product deleted successfully");
    } else {
      toast.error("Error deleting product");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const saveProduct = async () => {
  try {
    const response = await fetch(`${api}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: productName.value,
        description: productDescription.value,
        price: parseFloat(productPrice.value),
        reference: productReference.value,
        unitStock: unitStock.value,
        boxStock: boxStock.value,
        containerStock: palletStock.value,
        primaryPackQuantity: primaryPackQuantity.value,
        secondaryPackQuantity: secondaryPackQuantity.value,
        tertiaryPackQuantity: tertiaryPackQuantity.value,
        active: productActive.value,
      }),
    });

    if (response.ok) {
      toast.success("Product updated successfully");
    } else {
      toast.error("Error updating product");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};
</script>

<style scoped>
.btn-addqualparam {
  margin-top: 1.85rem;
}

.modal {
  display: none;
}

.btn-addqualparam {
  margin-top: 1.85rem;
}

.modal {
  display: none;
}

.modal.show {
  display: block;
}

.modal-dialog {
  margin-top: 6rem;
}

.modal-content {
  border-radius: 10px;
}

.modal-header {
  background-color: #6c757d;
  color: white;
  border-bottom: none;
}

.modal-title {
  margin-bottom: 0;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  border-top: none;
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: none;
}

.modal-overlay.show {
  display: block;
}
</style>
