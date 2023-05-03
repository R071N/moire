import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductView from '@/views/ProductView.vue'
import CartView from '@/views/CartView.vue'
import OrderView from '@/views/OrderView.vue'
import OrderInfoView from '@/views/OrderInfoView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  { name: 'home', component: HomeView, path: '/' },
  { name: 'product', component: ProductView, path: '/product/:id' },
  { name: 'cart', component: CartView, path: '/cart' },
  { name: 'order', component: OrderView, path: '/order' },
  { name: 'orderInfo', component: OrderInfoView, path: '/order/:id' },
  { name: 'notFound', component: NotFoundView, path: '/:catchAll(.*)' },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
