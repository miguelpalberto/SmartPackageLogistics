<template>
  <div class="container mt-5">
    <div class="row mb-3">
      <div class="col-md-8 mx-auto">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 10%">ID</th>
              <th style="width: 20%">Customer</th>
              <th style="width: 20%">Date</th>
              <th style="width: 20%">Due Date</th>
              <th style="width: 15%">See Order</th>
              <th style="width: 15%">Expedition</th>
            </tr>
          </thead>
          <tbody>
            <td>1</td>
            <td>Tiago</td>
            <td>20-12-2023</td>
            <td>Pending</td>
            <td><nuxt-link :to="`/orders/1`">Details</nuxt-link></td>
            <td><nuxt-link :to="`/expeditionOrders/1`">Ship</nuxt-link></td>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #6c757d;
  color: white;
}
</style>
