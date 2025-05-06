<!-- ProfileSettings.vue -->
<template>
    <div class="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Настройки профиля</h1>

      <form @submit.prevent="submitForm">
        <div class="space-y-4">
          <!-- Имя и фамилия -->
          <div class="flex space-x-4">
            <div class="flex-1">
              <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Имя</label>
              <input
                  id="firstName"
                  v-model="firstName"
                  type="text"
                  class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:text-gray-100"
                  required
              />
            </div>
            <div class="flex-1">
              <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Фамилия</label>
              <input
                  id="lastName"
                  v-model="lastName"
                  type="text"
                  class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:text-gray-100"
                  required
              />
            </div>
          </div>

          <!-- Почта -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Электронная почта</label>
            <input
                id="email"
                v-model="email"
                type="email"
                class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:text-gray-100"
                required
            />
          </div>

          <!-- Аватарка -->
          <div>
            <label for="avatar" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Аватарка</label>
            <input
                id="avatar"
                type="file"
                @change="handleAvatarChange"
                class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <!-- Пароль -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Новый пароль</label>
            <input
                id="password"
                v-model="password"
                type="password"
                class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:text-gray-100"
                required
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Подтвердите новый пароль</label>
            <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:text-gray-100"
                required
            />
          </div>

          <!-- Кнопки -->
          <div class="flex justify-between items-center">
            <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg">Сохранить изменения</button>
            <button
                @click="handleLogout"
                class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 border-2 border-red-500 transition-colors"
                type="button"
            >
              Выйти
            </button>
          </div>
        </div>
      </form>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { logout } from '@/services/authservice';

  const router = useRouter();

  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const avatar = ref(null);

  function handleAvatarChange(event) {
    avatar.value = event.target.files[0];
  }

  function submitForm() {
    if (password.value !== confirmPassword.value) {
      alert('Пароли не совпадают');
      return;
    }

    // Здесь ваш код для отправки данных на сервер
    alert('Профиль обновлен!');
  }

  function handleLogout() {
    logout();
    router.push('/login');
  }
  </script>

  <style scoped>
  /* Стили для формы */
  </style>
