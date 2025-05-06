import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Restorator from '@/views/Restorator.vue';
import Collection from '@/views/Collection.vue';
import Login from '@/views/Login.vue';
import Callback from '@/views/Callback.vue';
import ProfileSettings from '@/views/ProfileSettings.vue';
import { useAuthStore } from '@/store/auth';

const routes = [
  { path: '/', component: Home, name: 'Главная', meta: { requiresAuth: true } },
  { path: '/restorator', component: Restorator, name: 'Реставратор', meta: { requiresAuth: true } },
  { path: '/collection', component: Collection, name: 'Коллекция', meta: { requiresAuth: true } },
  { path: '/profile-settings', component: ProfileSettings, name: 'Настройки профиля', meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/callback', name: 'Callback', component: Callback },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Если маршрут требует аутентификации и нет токена, перенаправляем на /login
  if (requiresAuth && !authStore.token) {
    next('/login');
  }
  // Если пользователь аутентифицирован и пытается зайти на /login, перенаправляем на главную
  else if (to.path === '/login' && authStore.token) {
    next('/');
  }
  else {
    next();
  }
});

export default router;
