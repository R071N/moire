<template>
  <BaseFormRadio :group="group">
    <span class="options__value">
      {{ title }}
    </span>
  </BaseFormRadio>
</template>

<script>
import BaseFormRadio from '@/components/BaseFormRadio.vue';

export default {
  components: { BaseFormRadio },
  props: ['title', 'group'],
}
</script>
