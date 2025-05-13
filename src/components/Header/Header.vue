<template>
  <header
      class="fixed top-0 left-0 right-0 h-16 flex items-center px-6 z-10 bg-transparent "
  >
  <!-- Mobile burger -->
  <button
      @click="$emit('toggleDrawer')"
      class="md:hidden p-2 rounded-full
             bg-light-primary dark:bg-dark-primary shadow-lg shadow-indigo-500/30
             text-white mr-4"
      aria-label="Toggle sidebar"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
         viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <!-- пустой спейс, чтобы «растянуть» до плашки -->
  <div class="flex-1"></div>

  <!-- UserInfoPanel -->
  <TopUserProfile />
  </header>
</template>

<script setup>
import { defineEmits } from 'vue'
import TopUserProfile from '/src/components/Header/TopUserProfile.vue'  // ваш компонент плашки
const emit = defineEmits(['toggleDrawer'])
</script>

<style scoped>
/* ничего дополнительно */
</style>
