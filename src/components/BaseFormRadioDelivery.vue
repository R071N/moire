<template>
  <BaseFormRadio :group="group">
    <span class="options__value">
      {{ title }} <b>{{ +price ? `${price} ₽` : 'бесплатно' }}</b>
    </span>
  </BaseFormRadio>
</template>

<script>
import BaseFormRadio from '@/components/BaseFormRadio.vue';

export default {
  components: { BaseFormRadio },
  props: ['title', 'price', 'group'],
}
</script>
