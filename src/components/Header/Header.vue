<template>
  <header
      class="fixed top-0 left-0 right-0 h-16 bg-light-bg dark:bg-dark-bg flex items-center px-6 z-10"
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

    <!-- Компенсация для ПК (ширина TopUserProfile) -->
    <div class="hidden md:block w-64"></div>

    <!-- Logo (раскомментировать при необходимости) -->
    <!-- <div class="hidden md:block mr-6">
      <img src="/path/to/logo.png" alt="Logo" class="h-10 w-auto" />
    </div> -->

    <!-- Desktop navigation -->
    <div class="flex-1 flex justify-center">
      <DesktopNav />
    </div>

    <!-- UserInfoPanel (Avatar only on mobile) -->
    <div class="flex items-center">
      <TopUserProfile :showAvatarOnly="isMobile" />
    </div>
  </header>
</template>

<script setup>
import { defineEmits, ref, onMounted, onUnmounted } from 'vue';
import DesktopNav from '@/components/Header/DesktopNav.vue';
import TopUserProfile from '/src/components/Header/TopUserProfile.vue';

const emit = defineEmits(['toggleDrawer']);
const isMobile = ref(false);

function updateIsMobile() {
  isMobile.value = window.innerWidth < 768;
}

// Проверяем размер экрана при загрузке
onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

// Удаляем слушатель при размонтировании
onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
});
</script>

<style scoped>
/* Ничего дополнительно */
</style>