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
  {
    id: 'password',
    type: 'input',
    inputType: 'password',
    name: 'password',
    value: '',
    label: 'Password',
    validationType: 'required',
    placeholder: 'Password',
    errorHint: 'Enter your password',
    link: {
      text: 'Forgot password?',
      url: '/auth/reset-password',
    },
  },
];

const possibleErrorsList: { [key: string]: string } = {
  invalid_credentials: 'Invalid credentials. Please check your input and try again',
  default: 'Oops! Something went wrong. Try again later',
};

const signIn = (e: Event) => {
  formLoading.value = true;
  fetch('/api/v1/auth/login', {
    method: 'POST',
    body: new FormData(e.target as HTMLFormElement),
  }).then(res => res.json())
    .then((res) => {
      if (res.statusCode === 204) {
        navigateTo('/');
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
      title="Sign in"
      :fields="fields"
      :error-text="errorText"
      :input-disabled="formLoading"
      @submit="signIn"
    >
      <template #formBottom>
        Don’t have an account? <NuxtLink to="/auth/signup">Sign up</NuxtLink>
      </template>
    </AuthForm>
  </section>
</template>