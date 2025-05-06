<template>
    <div>Обработка...</div>
  </template>

  <script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/auth';
  import { onMounted } from 'vue';

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();

  onMounted(() => {
    const token = route.query.token;
    if (token) {
      authStore.setToken(token);
      console.log('токен поставлен', token);
      authStore.fetchUser().then(() => {
        router.push('/');
      });
    } else {
      router.push('/login');
    }
  });
  </script>
