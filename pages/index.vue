<script lang="ts" setup>
definePageMeta({
  middleware: ['protected'],
});
const user = useUser();
</script>

<template>
  <h1>Welcome to App!</h1>
  <p>Only for authed users!</p>
  <p>Your email: {{ user?.email }}</p>
  <p>
    <AuthLogout><button>Logout!</button></AuthLogout>
  </p>
</template>
