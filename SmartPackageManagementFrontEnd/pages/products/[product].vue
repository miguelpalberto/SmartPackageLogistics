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
                    :disabled="!canEdit"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="isActive" class="form-label">Active</label>
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="isActive"
                      v-model="productActive"
                      :disabled="!canEdit"
                    />
                  </div>
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
                      :disabled="!canEdit"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="productName" class="form-label"
                      >Product Category</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="productCategory"
                      :disabled="!canEdit"
                    />
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="productDescription" class="form-label"
                  >Product Description</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="productDescription"
                  :disabled="!canEdit"
                />
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="productPrice" class="form-label"
                      >Product Price</label
                    >
                    <div class="input-group">
                      <input
                        type="number"
                        class="form-control"
                        v-model="productPrice"
                        :disabled="!canEdit"
                      />
                      <span class="input-group-text">€</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="productPrice" class="form-label"
                      >Product Unit</label
                    >
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        v-model="productUnit"
                        :disabled="!canEdit"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="unitStock" class="form-label"
                      >Primary Pack Qty</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="primaryPackQuantity"
                      disabled
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="boxStock" class="form-label"
                      >Secondary Pack Qty</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="secondaryPackQuantity"
                      disabled
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="palletStock" class="form-label"
                      >Terciary Pack Qty</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="tertiaryPackQuantity"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="manufacturer" class="form-label"
                  >Manufacturer</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="productManufacturer"
                  disabled
                />
              </div>
            </form>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Product Image</h5>
            <img
              class="img-fluid"
              :src="product.imagePath"
              alt="Product Image"
            />
          </div>
        </div>
        <div v-if="canEdit" class="row mt-3">
          <div class="col-md-3"></div>
          <div class="col-md-3">
            <button
              type="button"
              class="btn btn-danger px-4"
              @click="deleteProduct"
              :disabled="!canEdit"
            >
              <i class="bi bi-trash"></i>&nbsp; Delete
            </button>
          </div>
          <div class="col-md-3 text-end">
            <button
              type="button"
              class="btn btn-primary px-4"
              @click="saveProduct"
              :disabled="!canEdit"
            >
              <i class="bi bi-save"></i>&nbsp; Save
            </button>
          </div>
          <div class="col-md-3"></div>
        </div>
        <br />
        <br />
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Stock Information</h5>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="unitStock" class="form-label">Unit Stock</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="unitStock"
                      disabled
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="boxStock" class="form-label">Box Stock</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="boxStock"
                      disabled
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="palletStock" class="form-label"
                      >Pallet Stock</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="palletStock"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </form>

            <div class="mb-3">
              <label for="totalStock" class="form-label"
                >Total Unit Stock</label
              >
              <input
                type="text"
                class="form-control"
                v-model="totalStock"
                disabled
              />
            </div>

            <div v-if="canEdit" class="mb-3">
              <button
                type="button"
                class="btn btn-success px-4"
                @click="addStock"
                :disabled="!canEdit"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>

        <div v-if="canEdit" class="col-md-10 mx-auto">
          <div
            class="modal-overlay"
            :class="{ show: showAddQualityParamForm }"
          ></div>
          <div
            class="modal"
            tabindex="-1"
            :class="{ show: showAddQualityParamForm }"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Add New Parameter Control</h5>
                  <button
                    type="button"
                    class="btn-close"
                    @click="closeAddQualityParamForm"
                  ></button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="addNewQualityParam">
                    <div class="mb-3">
                      <label for="name" class="form-label">Sensor</label>
                      <select
                        v-model="selectedSensorType"
                        class="form-select"
                        id="sensorType"
                      >
                        <option
                          v-for="type in sensorTypes"
                          :key="type.id"
                          :value="type.id"
                        >
                          {{ type.name }} - {{ type.measurementUnit }}
                        </option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label for="unit" class="form-label">Min Value:</label>
                      <input
                        type="number"
                        id="unit"
                        class="form-control"
                        v-model="minValue"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="unit" class="form-label">Max Value:</label>
                      <input
                        type="number"
                        id="unit"
                        class="form-control"
                        v-model="maxValue"
                      />
                    </div>
                    <div class="d-grid">
                      <button type="submit" class="btn btn-primary">
                        Add Parameter Control
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Product Parameters</h5>
            <div v-if="productParams.length > 0">
              <table class="table">
                <thead>
                  <tr>
                    <th>Sensor Type</th>
                    <th>Min Value</th>
                    <th>Max Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="param in productParams" :key="param.id">
                    <td>{{ param.sensorType.name }}</td>
                    <td>{{ param.minValue }}</td>
                    <td>{{ param.maxValue }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p>No product parameters available.</p>
            </div>
            <button
              v-if="canEdit"
              type="button"
              class="btn btn-success px-4 btn-addqualparam"
              @click="addQualityParamForm"
            >
              <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Parameter
              Control
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/store/auth-store.js";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
const router = useRouter();
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

const responseSensores = await useFetch(`${api}/sensor-types/all`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authStore.token}`,
  },
});

const sensorTypes = responseSensores.data.value.data;

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

const totalStock = computed(() => {
  const parsedUnitStock = parseFloat(unitStock.value) || 0;
  const parsedBoxStock = parseFloat(boxStock.value) || 0;
  const parsedPalletStock = parseFloat(palletStock.value) || 0;

  return (
    parsedUnitStock +
    parsedUnitStock * parsedBoxStock +
    parsedUnitStock * parsedBoxStock * parsedPalletStock
  );
});

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

const addStock = () => {
  router.push({
    path: `/products/stockEntry/${id}`,
  });
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
