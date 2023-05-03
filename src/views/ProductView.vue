<template>
  <div class="loader-wrapper" v-if="isLoading">
    <BaseLoader />
  </div>
  <h1 v-else-if="isLoadingFailed">
    Проиошла ошибка при загрузке товара. Пожалуйста, попробуйте зайти сюда позже.
  </h1>
  <div v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'home' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'home', query: { 'categoryId': product.category.id } }">
            {{ product.category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="gallery[activeColorIdx].image" :alt="product.title">
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="img in gallery" :key="img.id">
            <a href="" class="pics__link" :class="{ 'pics__link--current': img.id === activeColorId }"
              @click.prevent="changeImg(img.id)">
              <img width="98" height="98" :src="img.image" :alt="product.title">
            </a>
          </li>

        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST">
            <div class="item__row item__row--center">
              <div class="form__counter" :class="{ product__counter: $route.name === 'cart' }">
                <button type="button" aria-label="Убрать один товар" @click="setItemAmount(productAmount - 1)"
                  :disabled="productAmount === 1">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="itemAmountVal">

                <button type="button" aria-label="Добавить один товар" @click="setItemAmount(productAmount + 1)">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="item__price">
                {{ product.price }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item" v-for="col in product.colors" :key="col.id">
                    <label class="colors__label">
                      <input class="colors__radio sr-only" type="radio" name="color-item" :value="col.color.id"
                        :checked="activeColorId === col.color.id" v-model="activeColorId">
                      <span class="colors__value" :style="{ background: col.color.code }">
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>


              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" name="category" v-model="activeSizeId">
                    <option :value="size.id" v-for="size in product.sizes" :key="size.id" :checked="activeSizeId === size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit" :disabled="isSending"
              @click.prevent="addToCart">
              В корзину
            </button>
            <p v-if="isSending">Добавляем товар в корзину...</p>
            <p v-if="isSendingFailed">Произошла ошибка при добавлении товара в корзину. Попробуйте ещё раз!</p>
            <p v-else-if="isAdded">Товар успешно добавлен в корзину!</p>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link" :class="{ 'tabs__link--current': selectedTab === 'ProductContent' }"
              @click="setSelectedComponent('ProductContent')">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" :class="{ 'tabs__link--current': selectedTab === 'ProductDelivery' }"
              @click="setSelectedComponent('ProductDelivery')">
              Доставка и возврат
            </a>
          </li>
        </ul>
        <component :is="selectedTab"></component>
      </div>
    </section>
  </div>
</template>
<script>
import BaseLoader from '@/components/BaseLoader.vue';
import ProductContent from '@/components/ProductContent.vue';
import ProductDelivery from '@/components/ProductDelivery.vue';
import axios from 'axios';
import { API_URL } from '@/config.js';

export default {
  data() {
    return {
      productAmount: 1,
      isLoading: false,
      isLoadingFailed: false,
      isSending: false,
      isSendingFailed: false,
      isAdded: false,
      productData: null,
      activeColorIdx: 0,
      activeSizeIdx: 0,
      selectedTab: 'ProductContent'
    };
  },
  components: { BaseLoader, ProductContent, ProductDelivery },
  computed: {
    product() {
      return {
        ...this.productData,
        gallery: this.productData.colors.map(color => {
          return {
            id: color.color.id,
            image: color.gallery ? color.gallery[0].file.url : 'https://vatholmogorka.ru/images/2023/01/31/no_image.jpg'
          }
        })
      };
    },
    gallery() {
      return this.product.gallery;
    },
    activeColorId: {
      get() {
        return this.gallery[this.activeColorIdx].id;
      },
      set(id) {
        const idx = this.gallery.findIndex((item) => item.id === id);
        this.activeColorIdx = idx;
      }
    },
    activeSizeId: {
      get() {
        return this.product.sizes[this.activeSizeIdx].id;
      },
      set(id) {
        const idx = this.product.sizes.findIndex((item) => item.id === id);
        this.activeSizeIdx = idx;
      }
    },
    itemAmountVal: {
      get() {
        return this.productAmount;
      },
      set(val) {
        if (!val) return;
        this.$emit('setItemAmount', val);
      }
    }
  },
  methods: {
    async loadProduct() {
      this.isLoading = true;
      this.isLoadingFailed = false;
      try {
        const { data } = await axios.get(`${API_URL}/products/${this.$route.params.id}`);
        this.productData = data;
      } catch (err) {
        this.isLoading = false;
        this.isLoadingFailed = true;
      }
      this.isLoading = false;
    },
    setItemAmount(val) {
      this.productAmount = val;
    },
    changeImg(id) {
      const idx = this.gallery.findIndex((item) => item.id === id);
      this.activeColorIdx = idx;
    },
    async addToCart() {
      this.isSending = true;
      this.isAdded = false;
      this.isSendingFailed = false;
      try {
        await this.$store.dispatch('addToCart', {
          productId: this.product.id,
          colorId: this.activeColorId,
          sizeId: this.activeSizeId,
          quantity: this.productAmount
        });
      } catch (err) {
        this.isSendingFailed = true;
      }
      this.isSending = false;
      this.isAdded = true;
    },
    setSelectedComponent(val) {
      this.selectedTab = val;
    }
  },
  created() {
    this.loadProduct();
  }
}
</script>
