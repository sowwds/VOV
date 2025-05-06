import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Restorator from '@/views/Restorator.vue'
import Collection from '@/views/Collection.vue'
import Login from '../views/Login.vue';
import Callback from '../views/Callback.vue';
import { useAuthStore } from '@/store/auth';

const routes = [
    { path: '/', component: Home, name: 'Главная' },
    { path: '/restorator', component: Restorator, name: 'Реставратор' },
    { path: '/collection', component: Collection, name: 'Коллекция' },
    { path: '/login', name: 'Login', component: Login, },
    { path: '/callback', name: 'Callback', component: Callback, },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !authStore.token) {
      next('/login');
    } else {
      next();
    }
  });

export default router
