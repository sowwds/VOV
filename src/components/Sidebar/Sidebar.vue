<template>
  <div class="w-full bg-light-bg dark:bg-dark-bg p-4">
    <NavMenu />
  </div>
</template>

<script setup>
import NavMenu from '@/components/Sidebar/NavMenu.vue';
</script>

<style scoped>
/* Убедимся, что содержимое не выходит за границы */
div {
  max-height: calc(100vh - 4rem); /* Учитываем высоту хедера (h-16) */
  overflow-y: auto;
}
</style>