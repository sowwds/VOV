<script setup>
import StepIndicator from '@/components/StepIndicator.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push('/restoration/step4');
  }, 5000); // Имитация 5-секундной обработки
});
</script>

<template>
  <div class=" relative h-full flex flex-col items-center justify-center p-4">
    <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Реставрация аудио</h1>
    <div class="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow-lg w-full max-w-md text-left">
      <p class="text-lg text-light-text dark:text-dark-text mb-4">Пожалуйста, подождите, пока мы обрабатываем ваше аудио...</p>
      <div class="spinner mx-auto"></div>
    </div>
    <StepIndicator />
  </div>
</template>

<style scoped>
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
