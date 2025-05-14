<script setup>
import { useRestorationStore } from '@/store/restoration';

const restorationStore = useRestorationStore();
const steps = [
  { number: 1, name: 'Демо', namemobile: '1' },
  { number: 2, name: 'Загрузка', namemobile: '2' },
  { number: 3, name: 'Реставрация', namemobile: '3' },
  { number: 4, name: 'Редактирование', namemobile: '4' },
  { number: 5, name: 'Готово', namemobile: '5' },
];

const isActive = (step) => restorationStore.currentStep === step.number;
</script>

<template>
  <div class="absolute bottom-0 w-full rounded">
    <div class="flex justify-around items-center bg-light-bg dark:bg-dark-bg p-2">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex-1 text-center py-2"


        :class="{
          'text-gray-500 dark:text-gray-400': !isActive(step),
          'text-white bg-gray-500 rounded': isActive(step)
        }"
      >
        <div class="hidden sm:block">{{ step.name }}</div>
        <div class="block sm:hidden">{{ step.namemobile }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-colors {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
