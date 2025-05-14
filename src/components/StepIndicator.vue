<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const steps = [
  { path: '/restoration/step2', name: 'Загрузка', namemobile: '1' },
  { path: '/restoration/step3', name: 'Реставрация', namemobile: '2' },
  { path: '/restoration/step4', name: 'Редактирование', namemobile: '3' },
  { path: '/restoration/step5', name: 'Готово', namemobile: '4' },
];

const isActive = (stepPath) => route.path === stepPath;
</script>

<template>
  <div class="absolute bottom-0 w-full rounded">
    <div class="flex justify-around items-center">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex-1 text-center py-2"
        :class="{
          'text-gray-500 dark:text-gray-400': !isActive(step.path),
          'text-white bg-gray-500 rounded': isActive(step.path)
        }"
      > <div class="hidden sm:block">{{ step.name }}</div>
        <div class="block sm:hidden">{{ step.namemobile }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Дополнительные стили для плавности (опционально) */
.transition-colors {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
