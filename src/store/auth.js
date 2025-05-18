import { defineStore } from 'pinia';
import api from '@/services/api';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  getters: {
    avatarUrl: (state) => state.user?.avatar_url || avatarPlaceholder,
    fullName: (state) => state.user?.name || 'Неизвестный пользователь',
    email: (state) => state.user?.email || 'user@example.com',
    userId: (state) => state.user?.id || null,
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    async fetchUser() {
      try {
        const response = await api.get('/auth/profile');
        console.log('Данные пользователя:', response.data);
        this.user = response.data;
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        this.user = null;
        this.logout();
      }
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
      // Запускаем fetchUser после установки токена
      if (token) {
        this.fetchUser();
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    // Новая action для инициализации стора
    async initialize() {
      if (this.token && !this.user) {
        await this.fetchUser();
      }
    },
  },
});
