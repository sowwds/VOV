<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRestorationStore } from '@/store/restoration';
import StepIndicator from '@/components/StepIndicator.vue';

const router = useRouter();
const restorationStore = useRestorationStore();

const metadata = computed(() => ({
  title: restorationStore.title || 'Sample Title',
  author: restorationStore.author || 'Sample Author',
  cover: restorationStore.coverFile ? URL.createObjectURL(restorationStore.coverFile) : 'https://via.placeholder.com/150',
  restoredAudioUrl: restorationStore.restoredAudioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
}));

const downloadAudio = () => {
  console.log('Downloading', metadata.value.restoredAudioUrl);
  // В будущем: window.location.href = metadata.value.restoredAudioUrl;
};

const addToCollection = () => {
  console.log('Adding to collection:', metadata.value);
};
</script>

<template>
  <div class=" relative h-full flex flex-col items-center justify-center p-4">
    <StepIndicator />
    <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Реставрация завершена</h1>
    <div class="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow-lg w-full max-w-md text-left">
        <div class="flex flex-wrap justify-around mb-4">
            <!--Обложка-->
            <img :src="metadata.cover" alt="Cover" class="w-32 h-32 rounded" />
            <div class = "flex flex-col text-left justify-center">
                <div class="flex flex-row">
                    <p class="text-lg text-light-text-muted dark:text-dark-text-muted mr-4 ">Название: </p>
                    <p class="text-lg text-light-text dark:text-dark-text">{{ metadata.title }}</p>
                </div>
                <div class="flex flex-row">
                    <p class="text-lg text-light-text-muted dark:text-dark-text-muted mr-4 ">Автор: </p>
                    <p class="text-lg text-light-text dark:text-dark-text">{{ metadata.author }}</p>
                </div>
            </div>
        </div>

      <audio :src="metadata.restoredAudioUrl" controls class="w-full mb-4"></audio>
      <div class="flex justify-center gap-3">
        <button
          class="px-4 py-2 rounded
          text-dark-text bg-light-primary hover:bg-light-secondary
        dark:bg-dark-primary dark:hover:bg-dark-secondary"
          @click="downloadAudio"
        >
          Скачать
        </button>
        <button
          class="px-4 py-2 rounded
          text-dark-text bg-light-primary hover:bg-light-secondary
        dark:bg-dark-primary dark:hover:bg-dark-secondary"
          @click="addToCollection"
        >
          Добавить в коллекцию
        </button>
      </div>
    </div>
  </div>
</template>
