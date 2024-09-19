import { useAuthStore } from '../store/auth-store'

const publicRoutes = ['index', 'cart', 'auth-login', 'auth-register']
const customerOnlyRoutes = []
const logisticOperatorOnlyRoutes = ['orders', '/orders/pendingOrders', 'orders/ordersToShip']
const manufacturerOnlyRoutes = []

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        const authStore = useAuthStore();
        const token = sessionStorage.getItem("token");
        if (token && !authStore.isAuthenticated) {
            try {
                await authStore.loadUser(token)
            } catch (error) {
                authStore.clear()
                return navigateTo({ name: 'auth-login' })
            }
        }

        if (!token && !authStore.isAuthenticated && !publicRoutes.includes(to.name)) {
            return navigateTo({ name: 'auth-login' })
        }
    }
})