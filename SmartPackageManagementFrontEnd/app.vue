<template>
  <nav
    class="navbar navbar-expand-md navbar-dark bg-dark sticky-top flex-md-nowrap p-0 shadow"
  >
    <div class="container-fluid">
      <nuxt-link
        class="navbar-brand col-md-3 col-lg-2 me-0 px-3"
        :to="`/`"
        @click="clickMenuOption"
      >
        Smart Package Management
      </nuxt-link>
      <button
        id="buttonSidebarExpandId"
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav">
          <li
            v-if="!authStore.isAuthenticated || authStore.isCustomer"
            class="nav-item"
          >
            <nuxt-link class="nav-link" :to="`/cart`">
              <i class="bi bi-cart4"></i>
              Cart ({{ cartStore.count }})
            </nuxt-link>
          </li>
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <nuxt-link class="nav-link" :to="`/auth/register`">
              <i class="bi bi-person-check-fill"></i>
              Register</nuxt-link
            >
          </li>
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <nuxt-link class="nav-link" :to="`/auth/login`">
              <i class="bi bi-box-arrow-in-right"></i>
              Login
            </nuxt-link>
          </li>
          <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
            <button
              class="nav-link dropdown-toggle"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle"></i>
              <span class="avatar-text">{{ authStore.username }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
              <li v-if="authStore.isCustomer">
                <nuxt-link
                  class="dropdown-item"
                  :to="`/auth/${authStore.user?.username}`"
                >
                  <i class="bi bi-person-square"></i>
                  My Profile
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  class="dropdown-item"
                  :to="`/auth/changePassword`"
                  @click="clickMenuOption"
                >
                  <i class="bi bi-key"></i>
                  Change Password
                </nuxt-link>
              </li>
              <li>
                <button class="dropdown-item" @click.prevent="logout">
                  <i class="bi bi-arrow-right"></i>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container-fluid">
    <div class="row">
      <nav
        id="sidebarMenu"
        class="bg-light sidebar collapse"
        :class="
          authStore.isAuthenticated
            ? 'd-md-block col-md-3 col-lg-2'
            : 'd-md-none'
        "
      >
        <div class="position-sticky pt-3">
          <ul class="nav flex-column" v-if="authStore.isAuthenticated">
            <!-- CUSTOMERS -->
            <li v-if="authStore.isCustomer" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/`"
                @click="clickMenuOption"
              >
                <i class="bi bi-shop"></i>
                Catalog
              </nuxt-link>
            </li>
            <li v-if="authStore.isCustomer" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/dashboards/customerDashboard`"
                @click="clickMenuOption"
              >
                <i class="bi bi-list-check"></i>
                Customer Dashboard
              </nuxt-link>
            </li>
            <li v-if="authStore.isCustomer" class="nav-item">
              <nuxt-link class="nav-link w-100 me-3" :to="{ name: 'orders-my' }" @click="clickMenuOption">
                <i class="bi bi-list-columns"></i>
                My Orders
              </nuxt-link>
            </li>
            <!-- ##################################################### -->

            <!-- LOGISTIC OPERATORS -->
            <li v-if="authStore.isLogisticOperator" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/dashboards/logisticsOperatorDashboard`"
                @click="clickMenuOption"
              >
                <i class="bi bi-tv"></i>
                Logistic Dashboard
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator"
              class="nav-item">
              <nuxt-link class="nav-link w-100 me-3" :to="{ name: 'orders' }" @click="clickMenuOption">
                <i class="bi bi-list-check"></i>
                All Orders
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator"
              class="nav-item">
              <nuxt-link class="nav-link w-100 me-3" :to="{ name: 'orders-pending' }" @click="clickMenuOption">
                <i class="bi bi-list-check"></i>
                Pending Orders
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator"
              class="nav-item">
              <nuxt-link class="nav-link w-100 me-3" :to="{ name: 'orders-to-ship' }" @click="clickMenuOption">
                <i class="bi bi-list-check"></i>
                Orders to Ship
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator"
              class="nav-item">
              <nuxt-link class="nav-link w-100 me-3" :to="{ name: 'deliveries' }" @click="clickMenuOption">
                <i class="bi bi-truck"></i>
                All Deliveries
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator"
              class="nav-item">
              <nuxt-link class="nav-link w-100 me-3" :to="{ name: 'deliveries-to-process' }" @click="clickMenuOption">
                <i class="bi bi-truck-flatbed"></i>
                Deliveries to Process
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/packages/packagesList`"
                @click="clickMenuOption"
              >
                <i class="bi bi-box-seam"></i>
                Packages List
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/packages/transportPckList`"
                @click="clickMenuOption"
              >
                <i class="bi bi-list-check"></i>
                Transport Packages
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/sensors/sensorsList`"
                @click="clickMenuOption"
              >
                <i class="bi bi-list-check"></i>
                Sensors List
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/sensors/sensorTypes`"
                @click="clickMenuOption"
              >
                <i class="bi bi-list-check"></i>
                Sensors Types
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/users/customersList`"
                @click="clickMenuOption"
              >
                <i class="bi bi-people"></i>
                Customers
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/users/logisticsOperatorsList`"
                @click="clickMenuOption"
              >
                <i class="bi bi-people"></i>
                Logistic Operators
              </nuxt-link>
            </li>
            <li v-if="authStore.isLogisticOperator" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/users/manufacturersList`"
                @click="clickMenuOption"
              >
                <i class="bi bi-people"></i>
                Manufacturers
              </nuxt-link>
            </li>
            <!-- ##################################################### -->

            <!-- MANUFACTURERS -->
            <li v-if="authStore.isManufacturer" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/dashboards/manufacturerDashboard`"
                @click="clickMenuOption"
              >
                <i class="bi bi-tv"></i>
                Manufacturer Dashboard
              </nuxt-link>
            </li>
            <li v-if="authStore.isManufacturer" class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/products/newProduct`"
                @click="clickMenuOption"
              >
                <i class="bi bi-plus-square"></i>
                New Product
              </nuxt-link>
            </li>
            <!-- ##################################################### -->

            <!-- COMMON -->
            <li
              v-if="authStore.isManufacturer || authStore.isLogisticOperator"
              class="nav-item"
            >
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/products/productsList`"
                @click="clickMenuOption"
              >
                <i class="bi bi-list-check"></i>
                Products List
              </nuxt-link>
            </li>
                        <!-- MANUFACTURERS -->
                        <li v-if="authStore.isManufacturer" class="nav-item">
                          <nuxt-link
                            class="nav-link w-100 me-3"
                            :to="`/packages/packagesListManufacturer`"
                            @click="clickMenuOption"
                          >
                            <i class="bi bi-box-seam"></i>
                            Packages List
                          </nuxt-link>
                        </li>
            <!-- COMMON -->
            <li class="nav-item">
              <nuxt-link
                class="nav-link w-100 me-3"
                :to="`/notifications/notificationsList`"
                @click="clickMenuOption"
              >
                <i class="bi bi-bell"></i>
                Notifications List
              </nuxt-link>
            </li>
            <!-- ##################################################### -->
          </ul>
          <div class="d-block d-md-none">
            <h6
              class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
            >
              <span>User</span>
            </h6>
            <ul class="nav flex-column mb-2">
              <li
                v-if="!authStore.isAuthenticated || authStore.isCustomer"
                class="nav-item"
              >
                <nuxt-link
                  class="nav-link"
                  :to="`/cart`"
                  @click="clickMenuOption"
                >
                  <i class="bi bi-cart4"></i>
                  Cart ({{ cartStore.count }})
                </nuxt-link>
              </li>
              <li v-if="!authStore.user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :to="`/auth/register`"
                  @click="clickMenuOption"
                >
                  <i class="bi bi-person-check-fill"></i>
                  Register
                </nuxt-link>
              </li>
              <li v-if="!authStore.user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :to="`/auth/login`"
                  @click="clickMenuOption"
                >
                  <i class="bi bi-box-arrow-in-right"></i>
                  Login
                </nuxt-link>
              </li>
              <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
                <button
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink2"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="bi bi-person-circle"></i>
                  <span class="avatar-text">{{ authStore.username }}</span>
                </button>
                <ul
                  class="dropdown-menu dropdown-menu-dark dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink2"
                >
                  <li v-if="authStore.isCustomer">
                    <nuxt-link
                      class="dropdown-item"
                      :to="`/auth/${authStore.user?.username}`"
                      @click="clickMenuOption"
                    >
                      <i class="bi bi-person-square"></i>
                      My Profile
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link
                      class="dropdown-item"
                      :to="`/auth/changePassword`"
                      @click="clickMenuOption"
                    >
                      <i class="bi bi-key"></i>
                      Change Password
                    </nuxt-link>
                  </li>
                  <li>
                    <button class="nav-item" @click.prevent="logout">
                      <i class="bi bi-arrow-right"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main
        class="ms-sm-auto px-md-4"
        :class="
          authStore.isAuthenticated
            ? 'col-md-9 col-lg-10'
            : 'col-md-12 col-lg-12'
        "
      >
        <div class="container-fluid py-2 mt-3 mb-5">
          <NuxtPage></NuxtPage>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/store/auth-store.js";
import { useCartStore } from "./store/cart";
import { ref, onMounted } from "vue";
const authStore = useAuthStore();
const cartStore = useCartStore();

const logout = () => {
  authStore.logout();
  cartStore.clear();
  clickMenuOption();
  navigateTo("/");
};

const clickMenuOption = () => {
  const domReference = document.getElementById("buttonSidebarExpandId");
  if (domReference) {
    if (window.getComputedStyle(domReference).display !== "none") {
      domReference.click();
    }
  }
};

onMounted(() => {
  cartStore.loadCart();
});
</script>

<style>
@import "./assets/styles/dashboard.css";

.btn:focus {
  outline: none;
  box-shadow: none;
}

#sidebarMenu {
  overflow-y: auto;
}

.nav-item:hover {
  background-color: rgb(151, 151, 151);
}

.nav-item:hover > .nav-link {
  color: white !important;
}

.router-link-active:not(.navbar-brand) {
  background-color: rgb(102, 102, 102);
  color: white;
}
</style>
