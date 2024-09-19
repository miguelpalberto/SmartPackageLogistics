<template>
    <div class="container">
        <h2>Catalog</h2>
        <div class="row g-2">
            <div class="col-xs-12 col-md-6">
                <label for="inputCategory" style="font-size: 14px;" class="form-label">Category</label>
                <div class="input-group input-group-sm">
                    <select id="inputCategory" :disabled="isLoading" style="font-size: 14px;"
                        v-model="category" class="form-select" @change="loadFirstPage()">
                        <option v-for="category in categories" :key="category.value"
                            :value="category.value">
                            {{ category.text }}
                        </option>
                    </select>
                    <button :disabled="isLoading" class="btn btn-light btn-sm"
                        @click="resetCategory">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
            <div class="col-xs-12 col-md-6">
                <label for="inputReference" class="form-label">Reference</label>
                <input id="inputReference" class="form-control" v-debounce:300ms="searchByReference" type="text"
                    placeholder="Search by reference" aria-label="Search by reference" style="font-size: 14px;" />
            </div>
            <div class="col-xs-12 col-md-6">
                <label for="inputName" class="form-label">Name</label>
                <input id="inputName" class="form-control" v-debounce:300ms="searchByName" type="text"
                    placeholder="Search by name" aria-label="Search by name" style="font-size: 14px;" />
            </div>
            <div class="col-xs-12 col-md-6">
                <label for="inputDescription" class="form-label">Description</label>
                <input id="inputDescription" class="form-control" v-debounce:300ms="searchByDescription" type="text"
                    placeholder="Search by description" aria-label="Search by description" style="font-size: 14px;" />
            </div>
            <div class="col-xs-6 col-md-4">
                <label for="inputMinPrice" class="form-label">
                    Min. Price
                </label>
                <input type="text" class="form-control" min="0" id="inputMinPrice" v-debounce:300ms="searchByMinPrice"
                    v-model="minPriceStr">
            </div>
            <div class="col-xs-6 col-md-4">
                <label for="inputMaxPrice" class="form-label">
                    Max. Price
                </label>
                <input type="text" class="form-control" min="0" id="inputMaxPrice" v-debounce:300ms="searchByMaxPrice"
                    v-model="maxPriceStr">
            </div>
            <div class="col-xs-12 col-md-4">
                <br>
                <button type="button" class="btn btn-primary w-100 mt-2" @click="resetFilters">
                    Reset Filters
                </button>
            </div>
            <div v-if="isLoading" class="row">
                <common-loading-component />
            </div>
            <div v-else class="row mt-3 border-3 border-danger">
                <div class="col-12" v-if="paginatedProducts?.data?.length > 0">
                    <div class="row">
                        <store-catalog-item v-for="product in paginatedProducts.data" :key="product.id"
                            :product="product" />
                        <pagination :metadata="paginatedProducts.metadata" :changePage="changePage" />
                    </div>
                </div>
                <div v-else class="col-12">
                    <p class="text-center">No products found.</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "~/store/auth-store.js";
import { setMask, removeMask, formatToNumber } from 'simple-mask-money'
import Pagination from "~/pages/pagination.vue";
const authStore = useAuthStore();
const config = useRuntimeConfig();
const api = config.public.API_URL;
const isLoading = ref(false);

const currentPage = ref(1);
const paginatedProducts = ref(null);

//filters
const reference = ref(null);
const name = ref(null);
const description = ref(null);
const category = ref(null);
const minPrice = ref(null);
const maxPrice = ref(null);
const minPriceStr = ref(null);
const maxPriceStr = ref(null);

const categories = ref([]);

const loadProducts = async () => {
    try {
        isLoading.value = true;
        const queryParams = {
            pageSize: 9,
            page: currentPage.value,
        };

        if (reference.value !== null) {
            queryParams.reference = reference.value;
        }

        if (name.value !== null) {
            queryParams.name = name.value;
        }

        if (description.value !== null) {
            queryParams.description = description.value;
        }

        if (minPrice.value !== null) {
            queryParams.minPrice = minPrice.value;
        }

        if (maxPrice.value !== null) {
            queryParams.maxPrice = maxPrice.value;
        }

        if (category.value !== null) {
            queryParams.category = category.value;
        }

        const queryString = new URLSearchParams(queryParams);
        await new Promise(r => setTimeout(r, 1000)); //só porque sim 
        await useFetch(`${api}/products/all?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then((response) => {
            paginatedProducts.value = response.data.value;
            isLoading.value = false;
        })
    } catch (error) {
        console.log(error);
        isLoading.value = false;
    }
};

const loadCategories = async () => {
    try {
        await useFetch(`${api}/product-categories/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then((response) => {
            categories.value = response.data.value.map((productCategory) => {
                return {
                    value: productCategory.category,
                    text: productCategory.category
                }
            });
            categories.value.unshift({ value: null, text: "All" });
        })
    } catch (error) {
        toast.error("Something went wrong while loading categories.");
    }
};

const searchByReference = (searchValue) => {
    reference.value = searchValue;
    loadFirstPage();
};

const searchByName = (searchValue) => {
    name.value = searchValue;
    loadFirstPage();
};

const searchByDescription = (searchValue) => {
    description.value = searchValue;
    loadFirstPage();
};

const searchByMinPrice = () => {
    minPrice.value = formatToNumber(minPriceStr.value);
    loadFirstPage();
};

const searchByMaxPrice = () => {
    maxPrice.value = formatToNumber(maxPriceStr.value);
    loadFirstPage();
};

const loadFirstPage = () => {
    currentPage.value = 1;
    loadProducts();
};

const resetFilters = () => {
    reference.value = null;
    name.value = null;
    description.value = null;
    minPrice.value = null;
    maxPrice.value = null;
    minPriceStr.value = "0,00€";
    maxPriceStr.value = "0,00€";
    category.value = null;
    loadFirstPage();
};

const resetCategory = () => {
    category.value = null;
    loadFirstPage();
};

const changePage = (newPage) => {
    if (newPage > 0 && newPage <= paginatedProducts.value.metadata.totalPages) {
        currentPage.value = newPage;
        loadProducts();
    }
};

onMounted(async () => {
    await loadCategories();
    await loadProducts().then(() => {
        const maskConfig = {
            suffix: '€',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
        }


        setMask('#inputMinPrice', maskConfig)
        setMask('#inputMaxPrice', maskConfig)
    });
});

onBeforeUnmount(() => {
    currentPage.value = 1;
    paginatedProducts.value = null;
    removeMask('#inputMinPrice')
    removeMask('#inputMaxPrice')
});
</script>
<style scoped>
.bi {
    margin: 0 !important;
}
</style>
