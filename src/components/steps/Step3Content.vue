<script setup>
import { onMounted, ref } from 'vue';
import { useRestorationStore } from '@/store/restoration';
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue';

const props = defineProps({
  goToPreviousStep: {
    type: Function,
    default: () => {},
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
});

const restorationStore = useRestorationStore();
const timerId = ref(null);

onMounted(() => {
  timerId.value = setTimeout(() => {
    restorationStore.setCurrentStep(4);
  }, 5000);
});

const clearTimer = () => {
  if (timerId.value) {
    clearTimeout(timerId.value);
    timerId.value = null;
  }
};

// Вызываем пропс напрямую с проверкой
const goBack = () => {
  clearTimer();
  if (typeof props.goToPreviousStep === 'function') {
    props.goToPreviousStep();
  } else {
    console.warn('goToPreviousStep is not a function:', props.goToPreviousStep);
  }
};
</script>

<template>
  <div class="relative h-full flex flex-col items-center justify-center p-4">
    <div class="flex justify-start w-full max-w-md mb-4">
      <button
        v-if="props.showBackButton"
        class="flex items-center text-light-text dark:text-dark-text px-4 py-2 rounded cursor-pointer"
        @click="goBack"
      >
        <IconArrowLeft class="h-5 w-5 mr-2" />
      </button>
    </div>
    <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Реставрация аудио</h1>
    <div class="bg-light-surface dark:bg-dark-surface p-6 pb-16 rounded-lg shadow-lg w-full max-w-md text-left">
      <p class="text-lg text-light-text dark:text-dark-text mb-4">Пожалуйста, подождите, пока мы обрабатываем ваше аудио...</p>
      <div class="spinner mx-auto"></div>
    </div>
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
