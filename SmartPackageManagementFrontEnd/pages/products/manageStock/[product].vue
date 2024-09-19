<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <h2 class="card-title">Stock Management</h2>
        <br />
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
          </div>
        </div>

        <!-- Added form for transforming stock -->
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Transform Stock</h5>
            <form @submit.prevent="transformStock">
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="transformUnit" class="form-label"
                      >Transform Unit Stock</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      v-model="transformUnit"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="transformBox" class="form-label"
                      >Transform Box Stock</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      v-model="transformBox"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="transformPallet" class="form-label"
                      >Transformed Pallet Stock</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      v-model="transformPallet"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">
                Transform Stock
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="openModal"
              >
                Enter Pallet Codes
              </button>
            </form>
          </div>
        </div>
        <!-- End of added form -->

        <!-- Modal for entering pallet codes -->
        <div class="modal" ref="palletModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Enter Pallet Codes</h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="closeModal"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="submitPalletCodes">
                  <div v-for="(code, index) in palletCodes" :key="index">
                    <div class="mb-3">
                      <label :for="'palletCode' + index" class="form-label"
                        >Pallet Code {{ index + 1 }}</label
                      >
                      <input
                        :id="'palletCode' + index"
                        type="text"
                        class="form-control"
                        v-model="palletCodes[index]"
                      />
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">
                    Save Codes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- End of modal -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const transformUnit = ref(0);
const transformBox = ref(0);
const transformPallet = ref(0);
const palletCodes = ref([]);

const transformStock = () => {
  const units = parseInt(transformUnit.value) || 0;
  const boxes = parseInt(transformBox.value) || 0;

  const pallets = Math.floor(units + boxes / 2);

  transformPallet.value = pallets;
};

const openModal = () => {
  if (transformPallet.value > 0) {
    palletCodes.value = new Array(transformPallet.value).fill("");
    $refs.palletModal.showModal();
  }
};

const closeModal = () => {
  $refs.palletModal.close();
};

const submitPalletCodes = () => {
  console.log("Entered Pallet Codes:", palletCodes.value);
  closeModal();
};

onMounted(() => {
  $refs.palletModal = new bootstrap.Modal($refs.palletModal);
});
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
