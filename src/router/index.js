import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Layouts
import MainLayout from '@/components/Layout/MainLayout.vue';
import BlankLayout from '@/components/Layout/BlankLayout.vue';
import BannedLayout from "@/components/Layout/BannedLayout.vue";

// Pages
import Home from '@/views/Home.vue';
import Restoration from '@/views/Restoration.vue';
import Collection from '@/views/Collection.vue';
import Library from '@/views/Library.vue';
import Login from '@/views/Login.vue';
import Callback from "@/views/Callback.vue";
import BannedPage from "@/views/Banned.vue";

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Главная', component: Home, meta: { hideMusic: true } },
      { path: 'restoration', name: 'Реставрация', component: Restoration, meta: { requiresAuth: true } },
      { path: 'collection', name: 'Коллекция', component: Collection, meta: { requiresAuth: true, keepAlive: true } },
      { path: 'library', name: 'Library', component: Library, meta: { requiresAuth: true, keepAlive: true } },
    ],
  },
  {
    path: '/login',
    component: BlankLayout,
    children: [
      { path: '', name: 'Login', component: Login },
    ],
  },
  {
    path: '/callback',
    component: BlankLayout,
    children: [
      { path: '', name: 'Callback', component: Callback },
    ],
  },
  {
    path: '/banned',
    component: BannedLayout,
    children: [
        { path: '', name: 'Banned', component: BannedPage },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Загружаем данные пользователя, если есть токен и user еще не загружен
  if (authStore.token && !authStore.user) {
    await authStore.initialize(); // Предполагается, что initialize вызывает fetchUser
  }

  // Если маршрут требует авторизации и пользователь не авторизован
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  }
  // Если пользователь авторизован и пытается зайти на страницу логина
  else if (to.path === '/login' && authStore.user) {
    next('/');
  }
  // В остальных случаях пропускаем
  else {
    next();
  }
});

export default router;
