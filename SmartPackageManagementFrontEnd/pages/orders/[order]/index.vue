<template>
  <button class="btn btn-secondary" :disabled="isProcessing || isLoading" @click="this.$router.go(-1)">
    Back to Previous Page
  </button>
  <div class="container mt-5">
    <div class="row mb-3">
      <div v-if="isLoading" class="col-12">
        <common-loading-component />
      </div>
      <div v-else class="col-12 mx-auto">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Order Information</h5>
            <form @submit.prevent="">
              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="orderID" class="form-label">ID</label>
                    <input type="number" class="form-control" readonly :value="order.id" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="orderStatus" class="form-label">Current Status</label>
                    <input type="text" class="form-control" readonly :value="order.status" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="orderDate" class="form-label">Date Issued</label>
                    <input type="text" class="form-control" readonly :value="toLocaleString(order.date)" />
                  </div>
                </div>
                <div class="col-md-4" v-if="authStore.isLogisticOperator">
                  <div class="mb-3">
                    <label for="customer" class="form-label">Customer</label>
                    <input type="text" class="form-control" :value="order.customer.name" readonly />
                  </div>
                </div>
                <div class="row">
                  <h6>Destination Details</h6>
                  <div class="col-xs-12 col-md-6">
                    <div class="mb-3">
                      <label for="address" class="form-label">Address</label>
                      <input type="text" id="address" class="form-control" :value="order.address" readonly />
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <div class="mb-3">
                      <label for="postcode" class="form-label">Postcode</label>
                      <input type="text" id="postcode" class="form-control" :value="order.postCode" readonly />
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <div class="mb-3">
                      <label for="city" class="form-label">City</label>
                      <input type="text" id="city" class="form-control" :value="order.city" readonly />
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <div class="mb-3">
                      <label for="phonenumber" class="form-label">Phone Number</label>
                      <input type="text" id="phonenumber" class="form-control" :value="order.phoneNumber" readonly />
                    </div>
                  </div>
                  <div class="row" v-if="authStore.isLogisticOperator">
                    <div v-if="order.status === 'PENDING'" class="d-flex flex-row justify-content-start gap-3">
                      <button class="btn btn-success" type="button" :disabled="isProcessing"
                        @click="updateOrderStatus(order.id, 'ACCEPTED')">
                        <span role="status">Accept</span>
                      </button>
                      <button class="btn btn-danger" type="button" :disabled="isProcessing"
                        @click="updateOrderStatus(order.id, 'REJECTED')">
                        <span role="status">Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Order Items</h5>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>
                    </th>
                    <th class="align-middle text-start">
                      Item
                    </th>
                    <th class="align-middle text-center">
                      Quantity Delivered
                    </th>
                    <th class="align-middle text-center" v-if="authStore.isLogisticOperator">
                      In Stock
                    </th>
                    <th class="align-middle text-center">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="orderItem in order.orderItems" :key="orderItem.id">
                    <td class="align-middle text-center">
                      <img :src="getProductImgSrc(orderItem.product)" class="img-fluid" width="65" height="65"
                        style="object-fit: contain;" />
                    </td>
                    <td class="align-middle text-start">
                      {{ toPackageDescription(orderItem.packageType, orderItem.product) }}
                    </td>
                    <td class="align-middle text-center">
                      <b>{{ `( ${orderItem.quantity - orderItem.quantityLeft} / ${orderItem.quantity} )` }}</b>
                    </td>
                    <td class="align-middle text-center" v-if="authStore.isLogisticOperator">
                      {{ currentStock(orderItem.packageType, orderItem.product) }}
                    </td>
                    <td class="align-middle text-center">
                      {{ orderItem.price.toFixed(2) }}€
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td :colspan="authStore.isLogisticOperator ? 4 : 3" class="align-middle text-end">
                      <b>Total:</b>
                    </td>
                    <td class="text-center">
                      {{ order.totalPrice.toFixed(2) }}€
                    </td>
                    <td>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="row" v-if="authStore.isLogisticOperator && order.status == 'ACCEPTED' && !isOrderCompleted">
              <div class="col-12">
                <div class="d-flex flex-row justify-content-end gap-3">
                  <nuxt-link :to="`/orders/${order.id}/deliveries/create`" class="btn btn-success">
                    <i class="bi bi-truck"></i>
                    Create Delivery
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="row" v-if="authStore.isLogisticOperator && order.status == 'ACCEPTED' && isOrderCompleted">
              <div class="col-12">
                <div class="d-flex flex-row justify-content-end gap-3">
                  <button class="btn btn-success" type="button" :disabled="isProcessing"
                    @click="updateOrderStatus(order.id, 'COMPLETED')">
                    <span role="status">Mark as Completed</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/store/auth-store';
const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const api = config.public.API_URL;

const order = ref(null);
const isLoading = ref(true);
const isProcessing = ref(false);

const fetchOrder = async (orderId) => {
  await new Promise(r => setTimeout(r, 500));
  await useFetch(`${api}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`
    },
  })
    .then((response) => {
      order.value = response.data.value;
      isLoading.value = false;
    })
    .error((error) => {
      toast.error('Order not found');
      router.back(-1);
      isLoading.value = false;
    });
};

const toLocaleString = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: undefined })
}

const toPackageDescription = (packageType, product) => {
  switch (packageType.toLowerCase()) {
    case "primary":
      return `${product.primaryPackageType} with ${product.primaryPackQuantity} ${product.primaryPackageMeasurementUnit} of ${product.name} (ref#${product.reference})`
    case "secondary":
      return `Box with ${product.secondaryPackQuantity} ${product.primaryPackageType}s of ${product.name} (ref#${product.reference})`
    case "tertiary":
      return `Pallet with ${product.tertiaryPackQuantity} Boxes of ${product.name} (ref#${product.reference})`
  }
}

const isOrderCompleted = computed(() => {
  if (!order) {
    return false
  }
  return order.value.orderItems.every((orderItem) => orderItem.quantity - orderItem.quantityLeft === orderItem.quantity)
})

const updateOrderStatus = async (orderId, status) => {
  isProcessing.value = true
  const endpoint = `/orders/${orderId}/update-status`

  await new Promise(r => setTimeout(r, 1000));

  try {
    await useFetch(`${api}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify(status)
    }).then((response) => {
      if (status === 'REJECTED') {
        toast.success(`Order ${orderId} rejected successfully`);
        router.back(-1);
        return;
      }

      toast.success('Order status updated successfully');
      order.value.status = status;
      isProcessing.value = false
    })
  } catch (error) {
    toast.error('Error updating order status');
    isProcessing.value = false
  }
}

onMounted(async () => {
  if (route.params.order) {
    await fetchOrder(route.params.order);
  }
  else {
    await new Promise(r => setTimeout(r, 1000));
    toast.error('Order not found');
    router.back(-1);
  }
});
</script>

<style scoped></style>
