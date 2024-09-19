<script setup>
const props = defineProps({
    error: {
        type: String,
        default: null,
    },
})
</script>

<template>
    <div v-if="error" class="validation-error">
        {{ error || '' }}
    </div>
</template>

<style scoped>
.validation-error {
    color: red;
    font-size: 0.85rem;
}
</style>