import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Layouts
import MainLayout from '@/components/Layout/MainLayout.vue';
import BlankLayout from '@/components/Layout/BlankLayout.vue';

// Pages
import Home from '@/views/Home.vue';
import RestorationStep1 from '@/views/RestorationStep1.vue';
import RestorationStep2 from '@/views/RestorationStep2.vue';
import RestorationStep3 from '@/views/RestorationStep3.vue';
import RestorationStep4 from '@/views/RestorationStep4.vue';
import RestorationStep5 from '@/views/RestorationStep5.vue';
import Collection from '@/views/Collection.vue';
import ProfileSettings from '@/views/ProfileSettings.vue';
import Library from '@/views/Library.vue';
import WW2Map from '@/views/WW2Map.vue';
import Login from '@/views/Login.vue';
import Callback from '@/views/Callback.vue';

const routes = [
  // Все страницы с шапкой / сайдбаром / футером
  {
    path: '/',
    component: MainLayout,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (!authStore.token) return next('/login');
      next();
    },
    children: [
      { path: '', name: 'Главная', component: Home },
      {
        path: 'restoration',
        name: 'Реставрация',
        children: [
            { path: '', redirect: (to) => `/restoration/step1` }, // Исправлено с явным объектом пути
          { path: 'step1', name: 'Демо реставрации', component: RestorationStep1 },
          { path: 'step2', name: 'Загрузка аудио', component: RestorationStep2 },
          { path: 'step3', name: 'Реставрация аудио', component: RestorationStep3 },
          { path: 'step4', name: 'Редактирование метаданных', component: RestorationStep4 },
          { path: 'step5', name: 'Реставрация завершена', component: RestorationStep5 },
        ],
      },
      { path: 'collection', name: 'Коллекция', component: Collection },
      { path: 'profile-settings', name: 'Настройки профиля', component: ProfileSettings },
      { path: 'library', name: 'Library', component: Library },
      { path: 'map', name: 'WW2Map', component: WW2Map },
    ],
  },

  // Страницы без лейаута
  {
    path: '/login',
    component: BlankLayout,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (authStore.token) return next('/');
      next();
    },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Отладочная информация (удалить после теста)
router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path);
  next();
});

export default router;
