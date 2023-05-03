<template>
  <BaseFormField :title="title" :error="error">
    <input class="form__input" type="text" name="name" :placeholder="placeholder" v-model="value">
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  mixins: [formFieldMixin],
}
</script>
