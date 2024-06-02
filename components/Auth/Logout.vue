<script lang="ts" setup>
async function logout() {
  await $fetch("/api/v1/auth/logout", {
    method: "POST",
  });
  window.location.href = "/auth/login";
}
</script>

<template>
  <span @click="logout">
    <slot></slot>
  </span>
</template>