<template>
  <div class="content__top">

    <div class="content__row">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        {{ total }} товара (-ов)
      </span>
    </div>
  </div>

  <div class="content__catalog">
    <HomeFilter :filters="filters" @change-filters="setFilters" />


    <section class="catalog">
      <div class="loader-wrapper" v-if="isLoading">
        <BaseLoader />
      </div>
      <h2 v-else-if="isLoadingFailed">Возникла ошибка при загрузке товаров. Попробуйте позже.</h2>
      <h2 v-else-if="!products.length">Нет товаров по вашему запросу. Попробуйте поискать что-нибудь другое!</h2>
      <HomeList :products="products" v-else/>

      <BasePagination :page="page" :per-page="productsPerPage" :count="total" @change-page="setPage" v-if="products.length"/>
    </section>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue';
import BasePagination from '@/components/BasePagination.vue';
import HomeFilter from '@/components/HomeFilter.vue';
import HomeList from '@/components/HomeList.vue';

export default {
  name: "HomeView",
  components: { HomeFilter, HomeList, BasePagination, BaseLoader },
  data() {
    return {
      page: 1,
      productsPerPage: 12,
      filters: {
        filterPriceFrom: 0,
        filterPriceTo: 0,
        filterCategoryId: 0,
        filterColorId: [],
        filterMaterialId: [],
        filterSeasonId: [],
      },
    }
  },
  computed: {
    productsData() {
      return this.$store.state.productsData;
    },
    products() {
      return this.productsData ? this.productsData.items.map((product) => {
        return {
          ...product,
          images: product.colors.flatMap((color) => color.gallery).filter((img) => img !== null)
        }
      }) : [];
    },
    total() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    isLoadingFailed() {
      return this.$store.state.isLoadingFailed;
    },
  },
  methods: {
    loadProducts() {
      this.$store.dispatch('loadProducts', {
        page: this.page,
        limit: this.productsPerPage,
        minPrice: this.filters.filterPriceFrom,
        maxPrice: this.filters.filterPriceTo,
        categoryId: this.filters.filterCategoryId,
        materialIds: this.filters.filterMaterialId,
        seasonIds: this.filters.filterSeasonId,
        colorIds: this.filters.filterColorId
      });
    },
    setFilters(filters) {
      this.filters = filters;
    },
    setPage(page) {
      this.page = page;
    }
  },
  watch: {
    filters() {
      this.page = 1;
      this.loadProducts();
    },
    page() {
      this.loadProducts();
    },
    '$route'() {
      this.loadProducts();
    }
  },
  created() {
    this.filters.filterCategoryId = this.$route.query.categoryId || 0;
    this.loadProducts();
  }
}
</script>
