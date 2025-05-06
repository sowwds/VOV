<template>
    <div>
      <h1>Вход</h1>
      <button @click="loginWithYandex">Войти через Yandex</button>
      <button @click="loginWithGoogle">Войти через Google</button>
    </div>
  </template>

  <script setup>
  import { startLogin } from '@/services/authservice';

  const loginWithYandex = () => {
    startLogin('yandex');
  };

  const loginWithGoogle = () => {
    startLogin('google');
  };
  </script>
