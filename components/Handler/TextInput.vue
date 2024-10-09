<script lang="ts" setup>
const model = defineModel();
const props = defineProps<{
  error?: boolean;
}>();
</script>

<template>
  <div>
    <input
      v-model="model"
      type="text"
      :class="{ 'error': props.error }"
    />
  </div>
</template>

<style scoped>
  .error {
    border-color: red;
    color: red;
  }
</style>