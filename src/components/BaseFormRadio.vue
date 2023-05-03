<template>
  <li class="options__item">
    <label class="options__label">
      <input class="options__radio sr-only" type="radio" :name="group" :value="value" v-model="dataValue">
      <slot></slot>
    </label>
  </li>
</template>

<script>
import formRadioMixin from '@/mixins/formRadioMixin';

export default {
  mixins: [ formRadioMixin ],
}
</script>