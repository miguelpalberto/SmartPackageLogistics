<template>
  <div class="container mt-2">
    <div class="row justify-content-center">
      <img
        class="img-fluid mb-5"
        style="max-width: 800px"
        src="/logo.png"
        alt="Logo"
      />
      <div class="card col-12">
        <div class="card-header">
          <h3 class="mt-3 mb-0">User Information</h3>
        </div>
        <div class="card-body">
          <form class="row g-3 needs-validation">
            <div class="col-md-8">
              <div class="mb-3">
                <label for="inputName" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="customer.username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="inputName" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="customer.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="inputEmail" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="customer.email"
                  required
                />
              </div>
              <div class="mb-3 px-1">
                <label for="inputNIF" class="form-label">NIF</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="customer.nif"
                  required
                />
              </div>

              <div class="mb-3 px-1">
                <label for="inputAddress" class="form-label">Address</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="customer.address"
                  required
                />
              </div>

              <div class="d-flex">
                <div class="mb-3 col-6 pe-2">
                  <label for="inputPassword" class="form-label">Password</label>
                  <div class="input-group">
                    <input
                      type="password"
                      class="form-control"
                      v-model="customer.password"
                      required
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div class="mb-3 col-6">
                  <label for="inputPasswordConfirm" class="form-label"
                    >Password Confirmation</label
                  >
                  <div class="input-group">
                    <input
                      type="password"
                      class="form-control"
                      id="inputPasswordConfirm"
                      placeholder="Password Confirm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-light px-4 me-2"
              @click="cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary px-4"
              @click="newCustomer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();
const config = useRuntimeConfig();
const api = config.public.API_URL;
const customer = ref({
  username: "",
  name: "",
  email: "",
  password: "",
  nif: "",
  address: "",
});

const newCustomer = async () => {
  try {
    const response = await fetch(`${api}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: customer.value.username,
        name: customer.value.name,
        email: customer.value.email,
        password: customer.value.password,
        nif: customer.value.nif,
        address: customer.value.address,
      }),
    });

    if (response.ok) {
      toast.success("Customer created successfully");
      navigateTo("/auth/login");
    } else {
      toast.error("Error creating Customer");
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

const cancel = () => {
  navigateTo("/");
};
</script>

<style scoped>
.card {
  margin-top: 20px;
}

.card-header {
  background-color: gray;
  color: white;
}

.card-footer {
  background-color: #f8f9fa;
}
</style>
