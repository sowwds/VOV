<template>
  <header
      class="fixed top-0 left-0 right-0 h-16 bg-light-bg dark:bg-dark-bg flex items-center px-6 z-50"
  >
    <!-- Компенсация для выравнивания TopUserProfile к правой стороне -->
    <div class="flex-1"></div>

    <!-- UserInfoPanel (Avatar only on mobile) -->
    <div class="flex items-center">
      <TopUserProfile :showAvatarOnly="isMobile" />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TopUserProfile from '/src/components/Header/TopUserProfile.vue';

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