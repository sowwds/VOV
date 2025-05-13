import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Layouts
import MainLayout from '@/components/Layout/MainLayout.vue'
import BlankLayout from '@/components/Layout/BlankLayout.vue'

// Pages
import Home from '@/views/Home.vue'
import Restoration from '@/views/Restorator.vue'
import Collection from '@/views/Collection.vue'
import ProfileSettings from '@/views/ProfileSettings.vue'
import Library from '@/views/Library.vue'
import WW2Map from '@/views/WW2Map.vue'

import Login from '@/views/Login.vue'
import Callback from '@/views/Callback.vue'

const routes = [
  // Все страницы с шапкой / сайдбаром / футером
  {
    path: '/',
    component: MainLayout,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (!authStore.token) return next('/login')
      next()
    },
    children: [
      { path: '',              name: 'Главная',           component: Home },
      { path: 'restoration',   name: 'Реставратор',       component: Restoration },
      { path: 'collection',    name: 'Коллекция',         component: Collection },
      { path: 'profile-settings', name: 'Настройки профиля', component: ProfileSettings },
      { path: 'library',       name: 'Library',            component: Library },
      { path: 'map',           name: 'WW2Map',             component: WW2Map },
    ]
  },

  // Страницы без лейаута
  {
    path: '/login',
    component: BlankLayout,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (authStore.token) return next('/')
      next()
    },
    children: [
      { path: '', name: 'Login', component: Login }
    ]
  },
  {
    path: '/callback',
    component: BlankLayout,
    children: [
      { path: '', name: 'Callback', component: Callback }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
