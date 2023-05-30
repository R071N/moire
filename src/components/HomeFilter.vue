<template>
  <div class="filter loader-wrapper" v-if="isLoading">
    <BaseLoader />
  </div>
  <div class="filter" v-else-if="isLoadingFailed">
    <h2>Произошла ошибка при загрузке фильтров! Попробуйте перезагрузить страницу.</h2>
  </div>
  <aside class="filter" v-else>
    <form class="filter__form form" action="#" method="get" @submit.prevent="setFilters">
      <fieldset class="form__block form__block1">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" name="category" v-model.number="currentCategoryId">
            <option value="0">Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id">{{ category.title }}</option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors colors--black">
          <li class="colors__item" v-for="col in colors" :key="col.id">
            <label :for="col.id" class="colors__label">
              <input class="colors__radio sr-only" type="checkbox" name="col" :value="col.id" v-model="currentColorId"
                :id="col.id">
              <span class="colors__value" :style="{ 'background-color': col.code }">
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="material in materials" :key="material.id">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="material" :value="material.id"
                :id="material.id" v-model="currentMaterialId">
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="season in seasons" :key="season.id">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="collection" :value="season.id"
                :id="season.id" v-model="currentSeasonId">
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button class="filter__reset button button--second" type="button" @click="resetFilters" v-if="isResetBtnVisible">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import BaseLoader from './BaseLoader.vue';

export default {
  props: ['filters'],
  components: { BaseLoader },
  data() {
    return {
      currentPriceFrom: this.filters.filterPriceFrom,
      currentPriceTo: this.filters.filterPriceTo,
      currentCategoryId: this.filters.filterCategoryId,
      currentColorId: this.filters.filterColorId,
      currentMaterialId: this.filters.filterMaterialId,
      currentSeasonId: this.filters.filterSeasonId
    }
  },
  computed: {
    colors() {
      return this.$store.state.colorsData;
    },
    materials() {
      return this.$store.state.materialsData;
    },
    seasons() {
      return this.$store.state.seasonsData;
    },
    categories() {
      return this.$store.state.categoriesData;
    },
    productFilters() {
      return {
        filterPriceFrom: this.currentPriceFrom,
        filterPriceTo: this.currentPriceTo,
        filterCategoryId: this.currentCategoryId,
        filterColorId: this.currentColorId,
        filterMaterialId: this.currentMaterialId,
        filterSeasonId: this.currentSeasonId
      }
    },
    isLoading() {
      return this.$store.state.areFiltersLoading;
    },
    isLoadingFailed() {
      return this.$store.state.areFiltersLoadingFailed;
    },
    isResetBtnVisible() {
      return Object.values(this.filters).some(filter => filter.length !== undefined ? filter.length : filter);
    }
  },
  methods: {
    async loadFilters() {
      this.$store.dispatch('loadFilters');
    },
    setFilters() {
      this.$emit('change-filters', this.productFilters);
    },
    resetFilters() {
      this.currentPriceFrom = 0;
      this.currentPriceTo = 0;
      this.currentCategoryId = 0;
      this.currentColorId = [];
      this.currentMaterialId = [];
      this.currentSeasonId = [];
      this.$router.replace({ 'query': null });
      this.setFilters();
    }
  },
  created() {
    this.$store.dispatch('loadFilters');
  }
}
</script>
