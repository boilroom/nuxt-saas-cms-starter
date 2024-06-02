<script lang="ts" setup>
definePageMeta({
  middleware: ['no-auth-only'],
  layout: 'auth-pages',
});

const errorText = ref('');
const formLoading = ref(false);
const fields: (AuthFormInputField | AuthFormHiddenField)[] = [
  {
    id: 'email',
    type: 'input',
    inputType: 'text',
    name: 'email',
    value: '',
    label: 'Email',
    validationType: 'email',
    placeholder: 'Enter your email',
    errorHint: 'Enter username or email address',
  },
];

const possibleErrorsList: { [key: string]: string } = {
  default: 'Oops! Something went wrong. Try again later',
  invalid_email_validation: 'Invalid email format. Please check your input and try again',
  email_sent_error: 'Email sending error. Please try again later',
};

const resetPassword = (e: Event) => {
  formLoading.value = true;
  fetch('/api/v1/auth/reset-password', {
    method: 'POST',
    body: new FormData(e.target as HTMLFormElement),
  }).then(res => res.json())
    .then((res) => {
      if (res.statusCode === 200) {
        navigateTo('/message?type=success&code=password_recovery_sent');
      } else {
        errorText.value = possibleErrorsList[res.data.errorCode] || possibleErrorsList.default;
      }
      formLoading.value = false;
    });
};

</script>

<template>
  <section>
    <AuthForm
      title="Reset password"
      :fields="fields"
      :error-text="errorText"
      :input-disabled="formLoading"
      @submit="resetPassword"
    >
      <template #formTop>
        <p>Please enter your email address and we will email you a link to reset your password.</p>
      </template>
      <template #formBottom>
        <p><NuxtLink to="/">Back to main page</NuxtLink></p>
      </template>
    </AuthForm>
  </section>
</template>