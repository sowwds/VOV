<template>
    <div
        class="
        py-4 px-4 flex items-center space-x-3 h-20
        border-t border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-800
        transition-colors duration-150
      "
    >
      <img
          :src="avatarUrl"
          alt="Avatar"
          class="
          w-10 h-10 rounded-full object-cover
          bg-gray-200 dark:bg-gray-700
        "
      />
      <div class="flex flex-col">
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ fullName }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ email }}
        </span>
      </div>
      <!-- Компактный переключатель темы -->
      <div class="flex flex-col items-end space-y-2">
        <!-- Компактный переключатель темы -->
        <ThemeSwitcher class="w-10 h-5" />

        <!-- Кнопка настроек с иконкой шестеренки -->
        <router-link to="/profile-settings">
          <button
              class="p-1 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              aria-label="Настройки профиля"
          >
            <CogIcon class="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </router-link>
      </div>
    </div>
  </template>

  <script setup>
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/store/auth';
  import { onMounted } from 'vue';
  import ThemeSwitcher from '@/components/Header/ThemeSwitcher.vue';
  import { CogIcon } from '@heroicons/vue/24/outline';

  const authStore = useAuthStore();
  const { avatarUrl, fullName, email } = storeToRefs(authStore);

  onMounted(() => {
    if (authStore.token && !authStore.user) {
      authStore.fetchUser();
    }
  });
  </script>

  <style scoped>
  </style>
