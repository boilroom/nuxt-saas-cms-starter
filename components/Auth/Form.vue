<script lang="ts" setup>
declare global {
  interface AuthFormInputField {
    id: string;
    type: 'input';
    inputType: 'text' | 'password';
    name: string;
    value: string;
    validationType?: string;
    label?: string;
    placeholder?: string;
    errorHint?: string;
    link?: {
      text: string;
      url: string;
    };
  }
  interface AuthFormHiddenField {
    id: string;
    type: 'hidden';
    name: string;
    value?: string;
  }
}

const props = defineProps<{
  title: string;
  fields: (AuthFormInputField | AuthFormHiddenField)[];
  inputDisabled?: boolean;
  buttonLabel?: string;
  errorText?: string;
}>();

const emits = defineEmits<{
  (e: 'submit', value: Event): void;
}>();

const fieldsErorrs = ref<{ [key: string]: string }>({});

const passwordsFieldsVisibilty = ref(props.fields.reduce((acc, field) => {
  if (field.type === 'input' && field.inputType === 'password') {
    acc[field.id] = false;
  }
  return acc;
}, {} as { [key: string]: boolean }));

const formSubmit = (e: Event) => {
  const formData = new FormData(e.target as HTMLFormElement);
  props.fields.forEach((field) => {
    if (field.type === 'input' && field.validationType) {
      const validationResult = dataValidation(field.validationType, formData.get(field.name));
      fieldsErorrs.value[field.name] = validationResult.error ? field.errorHint || validationResult.message || 'Invalid value' : '';
    }
  });
  if (Object.values(fieldsErorrs.value).filter((v) => v).length === 0) {
    emits('submit', e);
  }
};
</script>

<template>
	<form
		method="post"
    class="auth-form"
    @submit.prevent="formSubmit"
	>
    <h2>{{ title }}</h2>
    <section>
      <slot name="formTop"></slot>
    </section>
    <section v-if="errorText">
      {{ errorText }}
    </section>
    <section class="fields">
      <div
        v-for="field in fields"
        :key="field.id"
        class="field"
      >
          <section
            v-if="field.type === 'input'"
            class="input-field"
          >
            <div class="input-field__label">
              <span v-if="field.label">{{ field.label }}</span>
              <NuxtLink
                v-if="field.link"
                :to="field.link.url"
              >
                {{ field.link.text }}
              </NuxtLink>
            </div>
            <div
              v-if="field.errorHint && fieldsErorrs[field.name]"
            >
              {{ field.errorHint }}
            </div>
            <div>
              <input
                :name="field.name"
                :type="field.inputType === 'password' ? (passwordsFieldsVisibilty[field.id] ? 'text' : 'password') : field.inputType"
                :placeholder="field.placeholder"
                v-model="field.value"
              />
              <span v-if="field.inputType === 'password'" @click="passwordsFieldsVisibilty[field.id] = !passwordsFieldsVisibilty[field.id]">Change visibility</span>
            </div>
          </section>
          <section
            v-else-if="field.type === 'hidden'"
            class="hidden-field"
          >
            <input
              :name="field.name"
              type="hidden"
              :value="field.value || ''"
            />
          </section>
      </div>
    </section>
    <section>
      <button type="submit">{{ buttonLabel || 'Submit' }}</button>
    </section>
    <section>
      <slot name="formBottom"></slot>
    </section>
    <div
      class="auth-form__loader"
      :class="{ 'auth-form__loader_active': inputDisabled }"
    ></div>
	</form>
</template>

<style scoped>
  .auth-form {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 220px;
  }
  .auth-form__loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .auth-form__loader_active {
    opacity: 1;
    pointer-events: all;
  }
  .fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .input-field input {
    width: 100%;
  }
  .input-field__label {
    display: flex;
    justify-content: space-between;
  }
</style>