<!-- src/components/Layout/MainLayout.vue -->
<template>
  <div class="app flex h-screen">
    <!-- Сайдбар -->
    <Sidebar />

    <!-- Основная область -->
    <div class="main flex-1 flex flex-col min-h-0">
      <!-- Заглушка вместо карты -->
      <div class="flex-1 w-full bg-gray-100 dark:bg-gray-800 transition-colors duration-150"></div>

      <!-- Музыкальная панель -->
      <div class="w-full flex-shrink-0">
        <MusicBar />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import MusicBar from '@/components/MusicBar.vue'
</script>

<style scoped>
/* Локальные стили для Layout, при необходимости */
</style>