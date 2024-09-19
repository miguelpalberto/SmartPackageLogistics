import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCartStore = defineStore("cartStore", () => {
    const cart = ref([]);
    const count = computed(() => cart.value.length);
    const total = ref(0);

    const loadCart = () => {
        const cartData = sessionStorage.getItem("cart");
        if (cartData) {
            cart.value = JSON.parse(cartData);
            calculateTotal();
        }
    }

    const addToCart = (product, packageType, quantity) => {
        const orderItemIndex = generateOrderItemIndex(product, packageType);
        const index = cart.value.findIndex((item) => item.index === orderItemIndex);

        if (index !== -1) {
            cart.value[index].quantity = cart.value[index].quantity + quantity;
            cart.value[index].subTotal = calculateSubtotal(product, packageType, cart.value[index].quantity);
        } else {
            cart.value.push(generateOrderItem(product, packageType, quantity, orderItemIndex));
        }

        calculateTotal();
        sessionStorage.setItem("cart", JSON.stringify(cart.value));
    }

    const increaseQuantity = (ordemItemIndex) => {
        const index = cart.value.findIndex((item) => item.index === ordemItemIndex);
        if (index !== -1) {
            cart.value[index].quantity = cart.value[index].quantity + 1;
            cart.value[index].subTotal = calculateSubtotal(cart.value[index].product, cart.value[index].packageType, cart.value[index].quantity);
        }
        calculateTotal();
        sessionStorage.setItem("cart", JSON.stringify(cart.value));
    }

    const decreaseQuantity = (ordemItemIndex) => {
        const index = cart.value.findIndex((item) => item.index === ordemItemIndex);
        if (index !== -1) {
            cart.value[index].quantity = cart.value[index].quantity - 1;

            if (cart.value[index].quantity === 0) {
                cart.value.splice(index, 1);
            }
            else{
                cart.value[index].subTotal = calculateSubtotal(cart.value[index].product, cart.value[index].packageType, cart.value[index].quantity);
            }
        }
        calculateTotal();
        sessionStorage.setItem("cart", JSON.stringify(cart.value));
    }

    const removeFromCart = (ordemItemIndex) => {
        const index = cart.value.findIndex((item) => item.index === ordemItemIndex);
        if (index !== -1) {
            cart.value.splice(index, 1);
        }
        calculateTotal();
        sessionStorage.setItem("cart", JSON.stringify(cart.value));
    }

    const generateOrderItemIndex = (product, packageType) => {
        return `${product.id}-${packageType}`
    }

    const generateOrderItem = (product, packageType, quantity, orderItemIndex) => {
        return {
            index: orderItemIndex,
            product: { ...product }, // clone product
            packageType: packageType,
            quantity: quantity,
            subTotal: calculateSubtotal(product, packageType, quantity)
        }
    }

    const calculateTotal = () => {
        total.value = 0
        cart.value.forEach((item) => {
            total.value += item.subTotal
        })
        total.value = Math.round(total.value * 100) / 100
    }

    const calculateSubtotal = (product, packageType, quantity) => {
        let subTotal = 0
        switch (packageType) {
            case "primary":
                subTotal = product.price * quantity
                break;
            case "secondary":
                subTotal = product.price * product.secondaryPackQuantity * quantity
                break;
            case "tertiary":
                subTotal = product.price * product.secondaryPackQuantity * product.tertiaryPackQuantity * quantity
                break;
        }

        return Math.round(subTotal * 100) / 100
    }

    const clear = () => {
        cart.value = [];
        total.value = 0;
        sessionStorage.removeItem("cart");
    }

    const cartToOrder = (form) => {
        if (cart.value.length === 0){
            return null;
        }
        
        return  {
            address: form.address,
            phoneNumber: form.phoneNumber,
            postCode: form.postCode,
            city: form.city,
            totalPrice: total.value,
            date: new Date().getTime(), //unix timestamp utc
            orderItems: cart.value.map((item) => {
                return {
                    quantity: item.quantity,
                    price: item.subTotal,
                    productId: item.product.id,
                    packageType: item.packageType
                }
            })
        }
    }

    const order = async (form, token) => {
        const config = useRuntimeConfig();
        const api = config.public.API_URL;
        const order = cartToOrder(form);
        if (order === null){
            return null;
        }

        const response = await fetch(`${api}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error("Something went wrong!");
        }

        if (response.ok) {
            clear();
        }
    }

    return {
        cart, total, count, increaseQuantity, decreaseQuantity,
        addToCart, removeFromCart, clear, loadCart, order
    };
})