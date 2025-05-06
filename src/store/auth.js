import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  actions: {
    async fetchUser() {
      try {
        const response = await api.get('/auth/profile'); // Укажите правильный эндпоинт
        console.log('пользователь получен')
        this.user = response.data.user;
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        this.user = null;
      }
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});
