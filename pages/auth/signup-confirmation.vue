<script lang="ts" setup>
definePageMeta({
  middleware: ['no-auth-only'],
  layout: 'auth-pages',
});
</script>

<template>
  <section>
    <div>
      <h1>Registration successful</h1>
      <div>
        <p>
          We have sent you an email with a verification link. Please click the link to verify your email address.
        </p>
        <p>
          Now you can close this page
        </p>
      </div>
    </div>
  </section>
</template>