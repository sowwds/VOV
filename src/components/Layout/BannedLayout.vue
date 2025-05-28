<template>
  <div class="flex min-h-screen h-full overflow-auto flex-col custom-scroll">
    <BannedHeader />
    <!-- Page content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import BannedHeader from '@/components/Header/BannedHeader.vue';
</script>

<style scoped>
/* Стили для скроллбара, скопированы из MainLayout.vue */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: var(--color-light-bg, #fafafc);
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: var(--color-light-surface, #ffffff);
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-light-surface, #ffffff);
  opacity: 0.8;
}

.dark .custom-scroll::-webkit-scrollbar-track {
  background: var(--color-dark-bg, #17181c);
}

.dark .custom-scroll::-webkit-scrollbar-thumb {
  background: var(--color-dark-surface, #26272c);
}

.dark .custom-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-dark-surface, #26272c);
  opacity: 0.8;
}
</style>