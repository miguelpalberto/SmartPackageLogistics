<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <h2 class="card-title">Stock Entry</h2>
        <br>
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Product Information</h5>
            <form @submit.prevent="submitForm">
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
              </div>
            </form>
          </div>
        </div>
        
        <div class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Primary Quantity</h6>
                <div class="mb-3">
                  <label for="primaryQty" class="form-label">Add Amount:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="primaryQty"
                    
                  />
                </div>
                <h6>Package Information</h6>
                <div class="mb-3">
                  <label for="primaryCode" class="form-label">Code:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="primaryCode"
                  />
                </div>
                <div class="mb-3">
                  <label for="primaryMaterial" class="form-label"
                    >Material:</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="primaryMaterial"
                  />
                </div>
                <div class="mb-3">
                  <label for="primaryManufactureDate" class="form-label"
                    >Production Date:</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    v-model="primaryManufactureDate"
                  />
                </div>
                <br>
                <div>
                  <button type="submit" class="btn btn-primary mx-auto" @click="submitPrimaryForm">Submit Primary Package</button>
                </div>
              </div>

              <div class="col-md-6">
                <h6>Secondary Quantity</h6>
                <div class="mb-3">
                  <label for="secondaryQty" class="form-label">Add Amount:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="secondaryQty"
                  />
                </div>
                <h6>Package Information</h6>
                <div class="mb-3">
                  <label for="secondaryCode" class="form-label">Code:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="secondaryCode"
                  />
                </div>
                <div class="mb-3">
                  <label for="secondaryMaterial" class="form-label"
                    >Material:</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="secondaryMaterial"
                  />
                </div>
                <div class="mb-3">
                  <label for="secondaryManufactureDate" class="form-label"
                    >Production Date:</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    v-model="secondaryManufactureDate"
                  />
                </div>
                <br>
              <div>
                <button type="submit" class="btn btn-primary mx-auto" @click="submitSecondaryForm">Submit Secondary Package</button>
              </div>
            </div>
            <!-- <div class="text-center">
              <button type="submit" class="btn btn-primary mx-auto" @click="submitBothForm">Submit Packages</button>
            </div> -->
          </div>
        </div>
        </div>
        

        <!-- <div class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Primary Quantity</h6>
                <div class="mb-3">
                  <label for="primaryQty" class="form-label">Add Amount:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="primaryQty"
                    :disabled=true
                  />
                </div>
                <h6>Package Information</h6>
                <div class="mb-3">
                  <label for="primaryCode" class="form-label">Code:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="primaryCode"
                  />
                </div>
                <div class="mb-3">
                  <label for="primaryMaterial" class="form-label"
                    >Material:</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="primaryMaterial"
                  />
                </div>
                <div class="mb-3">
                  <label for="primaryManufactureDate" class="form-label"
                    >Production Date:</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    v-model="primaryManufactureDate"
                  />
                </div>
                <br>
                <div>
                  <button type="submit" class="btn btn-primary" @click="submitPrimaryForm">Submit Primary Package</button>
                </div>
              </div>

              <div class="col-md-6">
                <h6>Secondary Quantity</h6>
                <div class="mb-3">
                  <label for="secondaryQty" class="form-label">Add Amount:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="secondaryQty"
                    :disabled=true
                  />
                </div>
                <h6>Package Information</h6>
                <div class="mb-3">
                  <label for="secondaryCode" class="form-label">Code:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="secondaryCode"
                  />
                </div>
                <div class="mb-3">
                  <label for="secondaryMaterial" class="form-label"
                    >Material:</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="secondaryMaterial"
                  />
                </div>
                <div class="mb-3">
                  <label for="secondaryManufactureDate" class="form-label"
                    >Production Date:</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    v-model="secondaryManufactureDate"
                  />
                </div>
                <br>
                <div>
                  <button type="submit" class="btn btn-primary">Submit Secondary Package</button>
                </div>
              </div>
            </div>
          </div>
        </div> -->

          <!-- <div class="card-footer">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>-->
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

const productReference = ref(product.value.reference);
const productName = ref(product.value.name);
const primaryPackQuantity = ref(product.value.primaryPackQuantity);
const secondaryPackQuantity = ref(product.value.secondaryPackQuantity);
const tertiaryPackQuantity = ref(product.value.tertiaryPackQuantity);
const primaryQty = ref("");
const secondaryQty = ref("");
const primaryCode = ref("");
const primaryMaterial = ref("");
const primaryManufactureDate = ref("");
const secondaryCode = ref("");
const secondaryMaterial = ref("");
const secondaryManufactureDate = ref("");

const resetPrimaryForm = () => {
  primaryCode.value = '';
  primaryMaterial.value = '';
  primaryManufactureDate.value = '';
  primaryQty.value = '';
};
const resetSecondaryForm = () => {
  secondaryCode.value = '';
  secondaryMaterial.value = '';
  secondaryManufactureDate.value = '';
  secondaryQty.value = '';
};

const submitPrimaryForm = async () => {
  try {
    const response = await fetch(`${api}/standard-packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        code: primaryCode.value,
        material: primaryMaterial.value,
        packageType: "PRIMARY",
        initialProductId: id,
        manufactureDate: primaryManufactureDate.value,
        initialAmountCreation: primaryQty.value,
      }),
    });

    if (response.ok) {
      toast.success("Stock updated successfully");
      resetPrimaryForm();

      successMessage.value = "Stock updated successfully";
      errorMessage.value = "";//limpa a mensagem de erro
      router.push({
        path: "/products/productsList",
        query: { successMessage: "Stock updated successfully" },
      });
    } else {
      toast.error("Error updating stock");
      errorMessage.value = "Error updating stock";
      successMessage.value = "";
    }
  } catch (error) {
    errorMessage.value = "An unexpected error occurred";
    successMessage.value = "";
  }
};
const submitSecondaryForm = async () => {
  try {
    const response = await fetch(`${api}/standard-packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        code: secondaryCode.value,
        material: secondaryMaterial.value,
        packageType: "SECONDARY",
        initialProductId: id,
        manufactureDate: secondaryManufactureDate.value,
        initialAmountCreation: secondaryQty.value,
      }),
    });

    if (response.ok) {
      toast.success("Stock updated successfully");
      resetSecondaryForm();

      successMessage.value = "Stock updated successfully";
      errorMessage.value = "";//limpa a mensagem de erro
      router.push({
        path: "/products/productsList",
        query: { successMessage: "Stock updated successfully" },
      });

    } else {
      toast.error("Error updating stock");
      errorMessage.value = "Error updating stock";
      successMessage.value = "";
    }
  } catch (error) {
    successMessage.value = "";
  }
};
const initialFormValues = {
  code: '',
  material: '',
  manufactureDate: '',
  qty: '',
  // ... other form fields
};
// const submitBothForm = async () => {
//   try {
//     const response = await fetch(`${api}/standard-packages`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${authStore.token}`,
//       },
//       body: JSON.stringify(
//         {
//         code: primaryCode.value,
//         material: primaryMaterial.value,
//         packageType: "PRIMARY",
//         initialProductId: id,
//         manufactureDate: primaryManufactureDate.value,
//         initialAmountCreation: primaryQty2.value,
//       }
//       ),
//     });

//     if (response.ok) {

//       successMessage.value = "Stock updated successfully";
//       errorMessage.value = "";//limpa a mensagem de erro
//       router.push({
//         path: "/products/productsList",
//         query: { successMessage: "Stock updated successfully" },
//       });
//     } else {

//       errorMessage.value = "Error updating stock";
//       successMessage.value = "";
//     }
//   } catch (error) {

//     errorMessage.value = "An unexpected error occurred";
//     successMessage.value = "";
//   }
// };









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
