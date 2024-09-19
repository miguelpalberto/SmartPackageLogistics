<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Order Information</h5>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="orderID" class="form-label">ID</label>
                    <input type="number" class="form-control" readonly />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="orderStatus" class="form-label">Status</label>
                    <input type="text" class="form-control" readonly />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="orderDate" class="form-label">Date</label>
                    <input type="date" class="form-control" readonly />
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="customer" class="form-label">Customer </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="customer"
                  readonly
                />
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">Address </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="address"
                  readonly
                />
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="orderID" class="form-label"
                      >Estimated Due Date</label
                    >
                    <input type="date" class="form-control" readonly />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="orderDate" class="form-label">Due Date</label>
                    <input type="date" class="form-control" readonly />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Order Items</h5>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-md-3">
                  <div class="mb-3">
                    <label for="unitStock" class="form-label">Reference</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="productReference"
                      readonly
                    />
                  </div>
                </div>

                <div class="col-md-5">
                  <div class="mb-3">
                    <label for="boxStock" class="form-label">Description</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="productDescription"
                      readonly
                    />
                  </div>
                </div>

                <div class="col-md-2">
                  <div class="mb-3">
                    <label for="palletStock" class="form-label">Qty</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="palletStock"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="mb-3">
                    <button
                      type="button"
                      class="btn btn-success px-1 btn-addQualityParam"
                      @click="addSensor"
                    >
                      <i class="bi bi-xs bi-plus-circle"></i> Add Sensor
                    </button>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="d-grid gap-2 col-md-12">
                    <button type="submit" class="btn btn-primary">
                      Transport Package Sensor
                    </button>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="d-grid gap-2 col-md-12">
                    <button type="submit" class="btn btn-primary">
                      Submit
                    </button>
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
const route = useRoute();
const username = route.params.username;
const config = useRuntimeConfig();
const api = config.public.API_URL;

const productReference = "123456";
const productPrice = "2";
const productDescription = "Coca Cola";
const unitStock = 100;
const boxStock = 20;
const palletStock = 5;

const totalStock = 12100;
</script>

<style scoped></style>
