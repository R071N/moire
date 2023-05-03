<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <button class="pagination__link pagination__link--arrow" aria-label="Предыдущая страница"
        @click.prevent="paginate(page - 1)" :disabled="page === 1">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </button>
    </li>

    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber.id">
      <a class="pagination__link pagination__link--current"
        :class="{ 'pagination__link--current': pageNumber === page }" @click.prevent="paginate(pageNumber)">
        {{ pageNumber }}
      </a>
    </li>

    <li class="pagination__item">
      <button class="pagination__link pagination__link--arrow" href="#" aria-label="Следующая страница"
        @click.prevent="paginate(page + 1)" :disabled="page === pages">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </button>
    </li>
  </ul>
</template>
<script>
export default {
  props: ['page', 'count', 'perPage'],
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    paginate(page) {
      if (page > 0 && page <= this.pages) this.$emit('changePage', page);
    },
  },
}
</script>
