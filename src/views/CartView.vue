<template>
  <div class="loader-wrapper" v-if="isLoading">
    <BaseLoader />
  </div>
  <h1 v-else-if="isLoadingFailed">
    Произошла ошибка при загрузке корзины. Попробуйте ещё раз!
  </h1>
  <div class="content__top" v-else>
    <ul class="breadcrumbs">
      <li class="breadcrumbs__item">
        <router-link class="breadcrumbs__link" :to="{ name: 'home' }">
          Каталог
        </router-link>
      </li>
      <li class="breadcrumbs__item">
        <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
          Корзина
        </router-link>
      </li>
    </ul>

    <div class="content__row">
      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ totalQuantity }} товара(-ов)
      </span>
    </div>
  </div>

  <section class="cart">
    <form class="cart__form form" action="#" method="POST">
      <div class="cart__field">
        <ul class="cart__list">
          <CartItem v-for="item in cart" :key="item.id" :title="item.product.title" :img="item.color.gallery[0].file.url"
            :basket-item-id="item.id" :item-id="item.product.id" :color-code="item.color.color.code"
            :color-title="item.color.color.title" :price="item.product.price" :amount="item.quantity"
            :size="item.size" />
        </ul>
      </div>

      <div class="cart__block">
        <p class="cart__desc">
          Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
        </p>
        <p class="cart__price">
          Итого: <span>{{ totalPrice }} ₽</span>
        </p>

        <div v-if="totalPrice <= 0">Добавьте товары в корзину</div>
        <router-link v-else class="cart__button button button--primery" type="submit" :to="{ name: 'order' }">
          Оформить заказ
        </router-link>
      </div>
    </form>
  </section>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import CartItem from '@/components/CartItem.vue';
import { defineComponent } from 'vue';
import BaseLoader from '@/components/BaseLoader.vue';

export default defineComponent({
  components: { CartItem, BaseLoader },
  computed: {
    ...mapState({
      isLoading: 'isCartLoading',
      isLoadingFailed: 'isCartLoadingFailed',
      error: 'cartError',
    }),
    ...mapGetters({
      cart: 'cartOrder',
      totalPrice: 'cartTotalPrice',
      totalQuantity: 'cartTotalQuantity'
    }),
  },
});
</script>
