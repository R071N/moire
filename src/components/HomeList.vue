<template>
  <ul class="catalog__list">
    <HomeItem v-for="product in products" :key="product.id" :id="product.id" :title="product.title" :price="product.price" :colors="product.colors" :images="product.images"></HomeItem>
  </ul>
</template>

<script>
import HomeItem from '@/components/HomeItem.vue';

export default {
  components: { HomeItem },
  props: ['products'],
}
</script>
