<script lang="ts" setup>
type Message = {
  title: string;
  text: string;
}
type Messages = {
  errors: { [key: string]: Message };
  success: { [key: string]: Message };
}
type MessageType = 'errors' | 'success' | undefined;

definePageMeta({
  layout: 'message-pages',
});

const route = useRoute();
const messageType = route.query.type as MessageType;
const code = route.query.code as string;
const messages: Messages = {
  errors: {
    invalid_email_activation_code: {
      title: 'Error :(',
      text: 'Invalid email activation code. Please check your email and try again. Maybe you have already activated your account'
    },
    default: {
      title: 'Oops!',
      text: 'Something went wrong. Try again later',
    },
  },
  success: {
    password_recovery_sent: {
      title: 'Success!',
      text: 'Password recovery email has been sent. Check your email',
    },
    password_recover_success: {
      title: 'Success!',
      text: 'Password has been successfully changed. You can now sign in with your new password',
    },
  },
};
const message = messageType && code && messages[messageType] && messages[messageType][code] ? messages[messageType][code] : {} as Message;

if (!message.title || !message.text) {
  showError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  });
}
</script>

<template>
  <section>
    <h1>{{ message.title }}</h1>
    <p>{{ message.text }}</p>
    <p>
      <NuxtLink to="/">Back to main page</NuxtLink>
    </p>
  </section>
</template>
