import { createStore } from 'vuex'
import axios from 'axios';
import { API_URL } from '@/config.js';
import router from '@/router/index';

export default createStore({
  state: {
    productsData: null,
    productData: null,
    categoriesData: null,
    colorsData: null,
    materialsData: null,
    seasonsData: null,
    deliveriesData: null,
    paymentsData: null,
    areFiltersLoading: false,
    areFiltersLoadingFailed: false,
    userAccessKey: null,
    isLoading: false,
    isLoadingFailed: false,
    isSending: false,
    isSendingFailed: false,
    cartData: [],
    cartProductsData: [],
    cartError: null,
    isCartLoading: false,
    isCartLoadingFailed: false,
    orderInfo: null,
    orderErrorInfo: null,
    orderErrorMessage: null,
    formErrorMessage: null,
  },
  getters: {
    cart(state) {
      return state.cartData.map((item) => {
        const product = state.cartProductsData.find((p) => p.product.id === item.productId);
        return {
          ...product,
          ...item
        }
      });
    },
    cartOrder(state) {
      return state.cartProductsData
    },
    cartTotalPrice(_, getters) {
      return getters.cartOrder.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    },
    cartTotalQuantity(_, getters) {
      return getters.cartOrder.length;
    },
  },
  mutations: {
    setProducts(state, payload) {
      state.productsData = payload;
    },
    setProductData(state, payload) {
      state.productData = payload;
    },
    setCategories(state, payload) {
      state.categoriesData = payload;
    },
    setColors(state, payload) {
      state.colorsData = payload;
    },
    setMaterials(state, payload) {
      state.materialsData = payload;
    },
    setSeasons(state, payload) {
      state.seasonsData = payload;
    },
    setDeliveries(state, payload) {
      state.deliveriesData = payload;
    },
    setPayments(state, payload) {
      state.paymentsData = payload;
    },
    updateAccessKey(state, payload) {
      state.userAccessKey = payload;
    },
    syncCartProducts(state) {
      state.cartData = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
    },
    updateCart(state, payload) {
      state.cartProductsData = payload;
    },
    updateCartProductQuantity(state, payload) {
      const item = state.cartData.find((cartItem) => cartItem.productId === payload.productId);
      if (item) item.quantity = payload.quantity;
    },
    deleteCartProduct(state, payload) {
      state.cartData = state.cartData.filter((item) => item.productId !== payload.productId);
    },
    resetCart(state) {
      state.cartProductsData = [];
      state.cartData = [];
    },
    updateOrderInfo(state, payload) {
      state.orderInfo = payload;
    },
    updateOrderError(state, payload) {
      state.orderErrorInfo = payload;
    },
    resetOrderError(state) {
      state.orderErrorInfo = null;
    },
    resetFormErrorMessage(state) {
      state.formErrorMessage = null;
    },
    updateOrderErrorMessage(state, payload) {
      state.orderErrorMessage = payload;
    }
  },
  actions: {
    async loadProducts(context, payload) {
      context.state.isLoading = true;
      context.state.isLoadingFailed = false;
      try {
        const { data } = await axios.get(`${API_URL}/products`, { params: payload });
        context.commit('setProducts', data);
      } catch (err) {
        context.state.isLoadingFailed = true;
        context.state.isLoading = false;
      } finally {
        context.state.isLoading = false;
      }
    },
    async loadFilters(context) {
      context.state.areFiltersLoading = true;
      context.state.areFiltersLoadingFailed = false;
      try {
        const categoriesData = await axios.get(`${API_URL}/productCategories`);
        context.commit('setCategories', categoriesData.data.items);
        const colorsData = await axios.get(`${API_URL}/colors`);
        context.commit('setColors', colorsData.data.items);
        const materialsData = await axios.get(`${API_URL}/materials`);
        context.commit('setMaterials', materialsData.data.items);
        const seasonsData = await axios.get(`${API_URL}/seasons`);
        context.commit('setSeasons', seasonsData.data.items);
      } catch (err) {
        context.state.areFiltersLoadingFailed = true;
      } finally {
        context.state.areFiltersLoading = false;
      }
    },
    async loadDeliveries(context) {
      const { data } = await axios.get(`${API_URL}/deliveries`);
      context.commit('setDeliveries', data);
    },
    async loadPayments(context, payload) {
      context.state.isLoading = true;
      context.state.isLoadingFailed = false;
      try {
        const { data } = await axios.get(`${API_URL}/payments`, { params: payload });
        context.commit('setPayments', data);
      } catch (err) {
        context.state.isLoadingFailed = true;
      } finally {
        context.state.isLoading = false;
      }
    },
    async addToCart(context, payload) {
      context.state.isSending = true;
      context.state.isSendingFailed = false;
      context.state.isAdded = false;
      try {
        const { data } = await axios.post(`${API_URL}/baskets/products`, payload, { params: { userAccessKey: context.state.userAccessKey } });
        context.commit('updateCart', data.items);
        context.commit('syncCartProducts');
      } catch (err) {
        context.state.isSendingFailed = true;
      }
      context.state.isSending = false;
      context.state.isAdded = true;
    },
    async loadCart(context) {
      context.state.isCartLoading = true;
      context.state.isCartLoadingFailed = false;
      try {
        const { data } = await axios.get(`${API_URL}/baskets`, { params: { userAccessKey: context.state.userAccessKey } });
        if (!context.state.userAccessKey) {
          localStorage.setItem('userAccessKey', data.user.accessKey);
          context.commit('updateAccessKey', data.user.accessKey);
        }
        context.commit('updateCart', data.items);
        context.commit('syncCartProducts');
      } catch (err) {
        context.state.isCartLoadingFailed = true;
      } finally {
        context.state.isCartLoading = false;
      }
    },
    async deleteFromCart(context, payload) {
      context.commit('deleteCartProduct', { productId: payload.productId });
      try {
        const { data } = await axios.delete(`${API_URL}/baskets/products`, {
          params: { userAccessKey: context.state.userAccessKey },
          data: payload
        });
        context.commit('updateCart', data.items);
      } catch (err) {
        context.commit('syncCartProducts');
      }
    },
    async sendOrder(context, payload) {
      context.state.isSending = true;
      context.state.isSendingFailed = false;
      try {
        context.commit('resetOrderError');
        context.commit('resetFormErrorMessage');
        const { data } = await axios.post(`${API_URL}/orders`, payload, { params: { userAccessKey: context.state.userAccessKey } });
        context.commit('updateOrderInfo', data);
        context.commit('resetCart');
        router.push({ name: 'orderInfo', params: { id: data.id } });
      } catch (err) {
        context.state.isSendingFailed = true;
        context.commit('updateOrderError', err.response.data.error.request);
        context.commit('updateOrderErrorMessage', err.response.data.error.message);
      } finally {
        context.state.isSending = false;
      }
    },
    async loadOrderInfo(context, payload) {
      context.state.isLoading = true;
      context.state.isLoadingFailed = false;
      try {
        const { data } = await axios.get(`${API_URL}/orders/${payload}`, { params: { userAccessKey: context.state.userAccessKey } });
        context.commit('updateOrderInfo', data);
      } catch (err) {
        context.state.isLoadingFailed = true;
      } finally {
        context.state.isLoading = false;
      }
    }
  }
})
