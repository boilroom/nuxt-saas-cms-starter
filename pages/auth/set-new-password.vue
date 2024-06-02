<script lang="ts" setup>
definePageMeta({
  middleware: ['no-auth-only'],
  layout: 'auth-pages',
});

const route = useRoute();
const errorText = ref('');
const formLoading = ref(false);
const fields: (AuthFormInputField | AuthFormHiddenField)[] = [
  {
    id: 'password',
    type: 'input',
    inputType: 'text',
    name: 'password',
    value: '',
    label: 'New password',
    validationType: 'password',
    placeholder: 'Enter your new password',
    errorHint: 'Invalid password',
  },
  {
    id: 'code',
    type: 'hidden',
    name: 'code',
    value: route.query.code as string,
  },
  {
    id: 'email',
    type: 'hidden',
    name: 'email',
    value: route.query.email as string,
  },
];

const possibleErrorsList: { [key: string]: string } = {
  default: 'Oops! Something went wrong. Try again later',
  invalid_data_validation: 'Invalid data. Please check the fields',
  invalid_email_or_code: 'Something went wrong. Maybe the code has expired',
};

const setNewPassword = (e: Event) => {
  formLoading.value = true;
  fetch('/api/v1/auth/set-new-password', {
    method: 'POST',
    body: new FormData(e.target as HTMLFormElement),
  }).then(res => res.json())
    .then((res) => {
      if (res.statusCode === 200) {
        navigateTo('/message?type=success&code=password_recover_success');
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
      title="Set new password"
      :fields="fields"
      :error-text="errorText"
      :input-disabled="formLoading"
      @submit="setNewPassword"
    >
      <template #formBottom>
        <p>Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters</p>
        <p><NuxtLink to="/">Back to main page</NuxtLink></p>
      </template>
    </AuthForm>
  </section>
</template>