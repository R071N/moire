<template>
  <router-link class="header__cart" aria-label="Корзина с товарами" :to="{ name: 'cart' }">
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров" v-if="$store.state.isCartLoading">...</span>
    <span class="header__count" aria-label="Количество товаров" v-else-if="$store.state.isCartLoadingFailed">!</span>
    <span class="header__count" aria-label="Количество товаров" v-else>{{ $store.state.cartData.length }}</span>
  </router-link>
</template>

<script>
export default {
}
</script>
