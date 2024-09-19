<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Customer Information</h5>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="productReference" class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="customer.name"
                    readonly
                  />
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
const username = route.params.customer;
const config = useRuntimeConfig();
const api = config.public.API_URL;

const { data: customer } = await useFetch(`${api}/customers/${username}`);
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
