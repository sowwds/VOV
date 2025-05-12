import { defineStore } from 'pinia';
import api from '@/services/api';
import avatarPlaceholder from '@/assets/avatar-placeholder.png'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  getters: {
    avatarUrl: (state) => state.user?.avatar_url || avatarPlaceholder,
    fullName: (state) => state.user?.name || 'Неизвестный пользователь',
    email: (state) => state.user?.email || 'user@example.com',
  },
  actions: {
    async fetchUser() {
      try {
        const response = await api.get('/auth/profile');
        console.log(response);
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
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});
