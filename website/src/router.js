import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Validator from './pages/Validator.vue'
import Visualization from './pages/Visualization.vue'

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'validator', path: '/validator', component: Validator },
  { name: 'visualization', path: '/visualization', component: Visualization }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
