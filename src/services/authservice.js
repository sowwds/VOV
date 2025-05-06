import { useAuthStore } from '@/store/auth';

export const startLogin = (provider) => {
  const authUrl = `http://localhost:5000/auth/${provider}`; // Формируем URL для провайдера
  window.location.href = authUrl;
};

export const getUser = async () => {
  const authStore = useAuthStore();
  await authStore.fetchUser();
  return authStore.user;
};

export const logout = () => {
  const authStore = useAuthStore();
  authStore.logout();
};
