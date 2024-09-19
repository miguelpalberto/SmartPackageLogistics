<template>
    <h2>{{ title }}</h2>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Code</th>
                <th>Material</th>
                <th>Package Description</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="aPackage in standardPackages" :key="aPackage.code">
                <td>
                    {{ aPackage.code }}
                </td>
                <td>
                    {{ aPackage.material }}
                </td>
                <td>
                    {{ toPackageDescription(aPackage.packageType, toCurrentProduct(aPackage)) }}
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script setup>
const props = defineProps({
    standardPackages: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

const toCurrentProduct = (standardPackage) => {
    return standardPackage.standardPackageProductMetadata
        .find((metadata) => metadata.removedAt === null).product
}

</script>