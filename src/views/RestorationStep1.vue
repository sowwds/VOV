<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRestored = ref(false);

// Заглушки для аудиофайлов (заменить на реальные URL)
const unrestoredAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const restoredAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';

const currentAudioUrl = computed(() => (isRestored.value ? restoredAudioUrl : unrestoredAudioUrl));

const toggleAudio = () => {
  isRestored.value = !isRestored.value;
};

const goToStep2 = () => {
  router.push('/restoration/step2');
};
</script>

<template>
  <div class=" relative h-full flex flex-col items-center justify-center p-4">
    <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Попробуйте реставратор</h1>
    <div class="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow-lg w-full max-w-md">
      <audio :src="currentAudioUrl" controls class="w-full mb-4"></audio>
      <div class="flex flex-wrap justify-between mb-4">
        <span class="text-light-text dark:text-dark-text py-4">
          {{ isRestored ? 'Отреставрированное' : 'Неотреставрированное' }}
        </span>
        <button
          class="text-dark-text px-4 py-2 rounded
          bg-light-secondary hover:bg-light-primary
          dark:bg-dark-secondary dark:hover:bg-dark-primary"
          @click="toggleAudio"
        >
          Переключить
        </button>
      </div>
      <button
        class="w-full text-dark-text px-4 py-2 rounded
        bg-light-primary hover:bg-light-secondary
        dark:bg-dark-primary dark:hover:bg-dark-secondary"
        @click="goToStep2"
      >
        Попробовать
      </button>
    </div>
  </div>
</template>
