export default {
  emits: ['update:modelValue'],
  props: ['modelValue', 'value', 'group', 'error'],
  computed: {
    dataValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  }
}
