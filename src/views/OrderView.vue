<template>
  <div class="content__top">
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
      <li class="breadcrumbs__item">
        <a class="breadcrumbs__link">
          Оформление заказа
        </a>
      </li>
    </ul>

    <div class="content__row">
      <h1 class="content__title">
        Оформление заказа
      </h1>
    </div>
  </div>

  <section class="cart">
    <form class="cart__form form" action="#" method="POST" @submit.prevent="sendOrder">
      <div class="loader-wrapper" v-if="isSending">
        <BaseLoader />
      </div>
      <div class="cart__field" v-else>
        <div class="cart__data">
          <BaseFormTextField title="ФИО" placeholder="Введите ваше имя" :error="formError.name" v-model="formData.name" />

          <BaseFormTextField title="Адрес доставки" placeholder="Введите ваш адрес" :error="formError.address"
            v-model="formData.address" />

          <BaseFormTextField title="Телефон" placeholder="Введите ваш телефон" :error="formError.phone"
            v-model="formData.phone" />

          <BaseFormTextField title="Email" placeholder="Введите ваш Email" :error="formError.email"
            v-model="formData.email" />

          <BaseFormTextarea title="Комментарии к заказу" placeholder="Ваши пожелания" :error="formError.comments"
            v-model="formData.comments" />
        </div>

        <div class="cart__options" v-if="isLoading">
          <div class="loader-wrapper">
            <BaseLoader />
          </div>
        </div>
        <div class="cart__options" v-else-if="isLoadingFailed">
          <h2>Возникла ошибка при загрузке товаров. Попробуйте позже.</h2>
        </div>
        <div class="cart__options" v-else>
          <h3 class="cart__title">Доставка</h3>
          <ul class="cart__options options">
            <BaseFormRadioDelivery v-for="delivery in deliveries" :key="delivery.id" group="delivery" :value="delivery.id"
              :title="delivery.title" :price="delivery.price" v-model="formData.deliveryId" />
          </ul>
          <span class="form__error" v-if="formError.deliveryTypeId">{{ formError.deliveryTypeId }}</span>

          <h3 class="cart__title">Оплата</h3>
          <ul class="cart__options options">
            <BaseFormRadioPayment v-for="payment in payments" :key="payment.id" group="pay" :title="payment.title"
              :value="payment.id" v-model="formData.paymentId" />
          </ul>
          <span class="form__error" v-if="formError.paymentTypeId">{{ formError.paymentTypeId }}</span>
        </div>
      </div>

      <div class="cart__block">
        <ul class="cart__orders">
          <li class="cart__order" v-for="item in cart" :key="item.id">
            <h3>{{ item.product.title }}</h3>
            <b>{{ item.product.price }} ₽</b>
            <span>Артикул: {{ item.product.id }}</span>
          </li>
        </ul>

        <div class="cart__total">
          <p>Доставка: <b>{{ deliveryPrice ? `${deliveryPrice} ₽` : 'бесплатно' }}</b></p>
          <p>Итого: <b>{{ totalQuantity }}</b> товара на сумму <b>{{ totalPrice }} ₽</b></p>
        </div>

        <button class="cart__button button button--primery" type="submit" :disabled="isLoading || isLoadingFailed">
          Оформить заказ
        </button>
      </div>
      <div class="cart__error form__error-block" v-if="orderErrorMessage !== null">
        <h4>Заявка не отправлена!</h4>
        <p>
          Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
        </p>
      </div>
    </form>
  </section>
</template>

<script>
import BaseFormTextField from '@/components/BaseFormTextField.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import BaseFormRadioDelivery from '@/components/BaseFormRadioDelivery.vue';
import BaseFormRadioPayment from '@/components/BaseFormRadioPayment.vue';
import BaseLoader from '@/components/BaseLoader.vue';

export default {
  components: { BaseLoader, BaseFormTextField, BaseFormTextarea, BaseFormRadioDelivery, BaseFormRadioPayment },
  data() {
    return {
      formData: {
        name: null,
        address: null,
        phone: null,
        email: null,
        comments: null,
        paymentId: 1,
        deliveryId: 1,
      },
    };
  },
  computed: {
    cart() {
      return this.$store.state.cartProductsData;
    },
    totalPrice() {
      return this.$store.getters.cartTotalPrice + this.deliveryPrice;
    },
    totalQuantity() {
      return this.$store.getters.cartTotalQuantity;
    },
    payments() {
      return this.$store.state.paymentsData;
    },
    deliveries() {
      return this.$store.state.deliveriesData;
    },
    deliveryPrice() {
      return this.deliveries ? +this.deliveries.find(delivery => delivery.id === this.formData.deliveryId).price : 0;
    },
    formError() {
      return this.$store.state.orderErrorInfo || {};
    },
    formErrorMessage() {
      return this.$store.state.formErrorMessage;
    },
    orderErrorMessage() {
      return this.$store.state.orderErrorMessage;
    },
    isSending() {
      return this.$store.state.isSending;
    },
    isSendingFailed() {
      return this.$store.state.isSendingFailed;
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    isLoadingFailed() {
      return this.$store.state.isLoadingFailed;
    },
  },
  methods: {
    sendOrder() {
      this.$store.dispatch("sendOrder", {
        name: this.formData.name,
        address: this.formData.address,
        phone: this.formData.phone,
        email: this.formData.email,
        deliveryTypeId: this.formData.deliveryId,
        paymentTypeId: this.formData.paymentId,
        comments: this.formData.comments
      });
    },
    loadPayments() {
      this.$store.dispatch("loadPayments", { deliveryTypeId: this.formData.deliveryId });
    }
  },
  watch: {
    "formData.deliveryId"() {
      this.loadPayments();
      this.formData.paymentId = null;
    }
  },
  created() {
    this.$store.dispatch("loadDeliveries");
    this.loadPayments();
  }
}
</script>
