<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="img" width="120" height="120" :alt="title">
    </div>
    <h3 class="product__title">
      {{ title }}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i class="colors__value" :style="{ background: colorCode }"></i>
        {{ colorTitle }}
      </span>
      <span>
        Размер:
        {{ size.title }}
      </span>
    </p>
    <span class="product__code">
      Артикул: {{ itemId }}
    </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар" @click.prevent="amountRemoveCount" :disabled="amount === 1">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="productAmount" name="count">

      <button type="button" aria-label="Добавить один товар" @click.prevent="amountAddCount">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ (productAmount * price) }} ₽
    </b>

    <div class="product__status">
      <span class="product__error" v-if="isSendingFailed">Что-то пошло не так. Попробуйте позже!</span>
    </div>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
      @click.prevent="deleteItem">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>
<script>
import axios from 'axios';
import { API_URL } from '@/config.js';

export default {
  data() {
    return {
      isSending: false,
      isSendingFailed: false,
    };
  },
  props: [
    'title',
    'img',
    'basketItemId',
    'itemId',
    'colorCode',
    'colorTitle',
    'price',
    'amount',
    'size'
  ],
  computed: {
    productAmount: {
      get() {
        return this.amount;
      },
      async set(val) {
        this.isSendingFailed = false;
        this.$store.commit('updateCartProductQuantity', { productId: this.itemId, quantity: val });
        try {
          const { data } = await axios.put(`${API_URL}/baskets/products`,
            { basketItemId: this.basketItemId, quantity: val },
            {
              params: { userAccessKey: this.$store.state.userAccessKey }
            });
          this.$store.commit('updateCart', data.items);
        } catch (err) {
          this.isSendingFailed = true;
          this.$store.commit('syncCartProducts');
        }
      }
    },
  },
  methods: {
    deleteItem() {
      this.$store.dispatch('deleteFromCart', { basketItemId: this.basketItemId, productId: this.itemId });
    },
    amountRemoveCount() {
      if (this.amount > 0) {
        this.productAmount -= 1;
      }
    },
    amountAddCount() {
      if (this.amount < 999) {
        this.productAmount += 1;
      }
    },
  },
};
</script>
