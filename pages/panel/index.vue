<script lang="ts" setup>
definePageMeta({
  middleware: ['protected'],
});

const url = useRequestURL();
const data = ref<any>({});
const errors = ref<{ [key: string]: boolean }>({});

const fieldsValidations: { [key: string]: string | Array<string> } = {
  id: ['digits', 'required'],
};

fetch(`${url.origin}/api/v1/demo/mock-data`, {
  method: 'GET',
}).then(res => res.json())
  .then((res) => {
    if (res.status === 'ok') {
      data.value = res.data;
    }
  });

const idEditVal = computed({
  get: () => data.value.id,
  set: (val) => {
    data.value.id = val;
  },
});

const testAction = () => {
  console.log('Test action', typeof data.value.id, data.value.id);
  data.value.id = 11111;
};

const dataUpdated = (val: any, field: string) => {
  console.log('Data updated', val, dataValidation('email', val));
  errors.value[field] = dataValidation('email', val).error;
};
</script>

<template>
  <div>
    <h1>Panel</h1>
    <p>Protected page</p>
    <pre>{{ data }}</pre>
    <div>
      <HandlerTextInput v-model="idEditVal" :error="Boolean(errors.id)" @update:model-value="dataUpdated($event, 'id')" />
    </div>
    <div>
      <button @click="testAction">Test</button>
    </div>
  </div>
</template>
