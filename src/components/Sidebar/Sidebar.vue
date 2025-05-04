<template>
  <aside
      class="flex flex-col justify-between w-64 h-screen
           bg-white dark:bg-gray-800
           border-r border-gray-200 dark:border-gray-700
           transition-colors duration-150"
  >
    <div>
      <!-- Поисковый ввод -->
      <SearchInput />
      <!-- Навигационное меню -->
      <NavMenu />
    </div>

    <!-- Профиль пользователя -->
    <UserProfile />
  </aside>
</template>

<script setup>
import SearchInput from '@/components/Sidebar/SearchInput.vue'
import NavMenu from '@/components/Sidebar/NavMenu.vue'
import ThemeSwitcher from '@/components/Sidebar/ThemeSwitcher.vue'
import UserProfile from '@/components/Sidebar/UserProfile.vue'
</script>

<style scoped>
/* Нет дополнительных локальных стилей */
</style>