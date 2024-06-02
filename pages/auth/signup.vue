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
    errorHint: 'Invalid email address',
  },
  {
    id: 'password',
    type: 'input',
    inputType: 'text',
    name: 'password',
    value: '',
    label: 'Password',
    validationType: 'required',
    placeholder: 'Password',
    errorHint: 'Invalid password',
  },
];

const possibleErrorsList: { [key: string]: string } = {
  invalid_credentials_validation: 'Email/password validation failed. Please check your input and try again',
  user_exists: 'User with this email already exists. Please try to login or use another email',
  email_sent_error: 'Email sending error. Please try again later',
  default: 'Oops! Something went wrong. Try again later',
};

const signUp = (e: Event) => {
  formLoading.value = true;
  fetch('/api/v1/auth/signup', {
    method: 'POST',
    body: new FormData(e.target as HTMLFormElement),
  }).then(res => res.json())
    .then((res) => {
      if (res.statusCode === 200) {
        navigateTo('/auth/signup-confirmation');
      } else {
        errorText.value = possibleErrorsList[res.data.errorCode] || possibleErrorsList.default;
      }
      formLoading.value = false;
    });
};
</script>

<template>
  <div>
    <AuthForm
      title="Sign up"
      :fields="fields"
      :error-text="errorText"
      button-label="Sign up"
      :input-disabled="formLoading"
      @submit="signUp"
    >
      <template #formBottom>
        <p>Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters</p>
        <p>Already have an account? <NuxtLink to="/auth/login">Log in</NuxtLink></p>
      </template>
    </AuthForm>
  </div>
</template>