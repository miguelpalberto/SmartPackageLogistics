import { defineStore } from "pinia";
export const useAuthStore = defineStore("authStore", () => {
  const token = ref(null);
  const user = ref(null);
  const username = computed(() => user.value?.name ?? "Guest");
  const isAuthenticated = computed(() => !!user.value);
  const config = useRuntimeConfig();
  const api = config.public.API_URL;
  const isLogisticOperator = computed(
    () => user.value?.role === "LogisticsOperator"
  );
  const isManufacturer = computed(() => user.value?.role === "Manufacturer");
  const isCustomer = computed(() => user.value?.role === "Customer");

  const loadUser = async (tokenValue) => {
    try {
      token.value = tokenValue;
      const response = await useFetch(`${api}/auth/user`, {
        method: "get",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token.value,
        },
      });
      user.value = response.data._value;
    } catch (error) {
      clear();
    }
  };

  function clear() {
    sessionStorage.removeItem("token");
    token.value = null;
    user.value = null;
  }

  function logout() {
    clear();
  }

  return {
    token,
    user,
    isAuthenticated,
    isLogisticOperator,
    isManufacturer,
    isCustomer,
    username,
    logout,
    loadUser,
    clear,
  };
});
