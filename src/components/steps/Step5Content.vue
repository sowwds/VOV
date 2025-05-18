<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRestorationStore } from '@/store/restoration';
import { useAuthStore } from '@/store/auth';
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue';
import axios from 'axios';

defineProps({
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
const authStore = useAuthStore();
const error = ref('');

onMounted(async () => {
  await authStore.initialize();
});

const metadata = computed(() => ({
  title: restorationStore.title || 'Sample Title',
  author: restorationStore.author || 'Sample Author',
  year: restorationStore.year || 'Не указан',
  album: restorationStore.album || 'Не указан',
  country: restorationStore.country || 'Не указана',
  cover: restorationStore.coverUrl || 'https://via.placeholder.com/150',
  streamUrl: restorationStore.trackId ? `http://localhost:5000/restoration/stream/${restorationStore.trackId}` : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  downloadUrl: restorationStore.trackId ? `http://localhost:5000/restoration/download/${restorationStore.trackId}` : null,
}));

const addToCollection = async () => {
  if (!authStore.user || !authStore.user.id) {
    error.value = 'Пользователь не авторизован. Пожалуйста, войдите в систему.';
    return;
  }

  try {
    await axios.post('http://localhost:5000/users/library', {
      userId: parseInt(authStore.user.id),
      trackId: restorationStore.trackId,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
    });
    alert('Трек добавлен в вашу коллекцию!');
  } catch (err) {
    console.error('Failed to add to collection:', err);
    error.value = 'Не удалось добавить трек в коллекцию.';
  }
};

const publishTrack = async () => {
  if (!restorationStore.trackId) {
    error.value = 'ID трека отсутствует.';
    return;
  }

  try {
    await axios.post('http://localhost:5000/public-library', {
      trackId: restorationStore.trackId,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
      },
    });
    alert('Трек опубликован!');
  } catch (err) {
    console.error('Failed to publish track:', err);
    if (err.response) {
      if (err.response.status === 400) {
        error.value = 'Ошибка: отсутствует ID трека или метаданные не найдены.';
      } else if (err.response.status === 409) {
        error.value = 'Трек уже опубликован.';
      } else if (err.response.status === 500) {
        error.value = 'Внутренняя ошибка сервера. Попробуйте позже.';
      } else {
        error.value = 'Не удалось опубликовать трек.';
      }
    } else {
      error.value = 'Не удалось опубликовать трек. Проверьте соединение.';
    }
  }
};

const downloadAudio = () => {
  if (metadata.value.downloadUrl) {
    window.open(metadata.value.downloadUrl, '_blank');
  } else {
    error.value = 'URL для скачивания недоступен.';
  }
};

const restart = () => {
  restorationStore.reset();
};
</script>

<template>
  <div class="relative h-full flex flex-col items-center justify-center p-4">
    <div class="flex justify-start w-full max-w-md mb-4">
      <button
        v-if="showBackButton"
        class="flex items-center text-light-text dark:text-dark-text px-2 py-2 rounded cursor-pointer"
        @click="goToPreviousStep"
      >
        <IconArrowLeft class="h-5 w-5" />
      </button>
      <button
        class="flex items-center text-light-text dark:text-dark-text px-2 py-2 rounded cursor-pointer"
        @click="restart"
      >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
      </svg>
      </button>
    </div>
    <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Реставрация завершена</h1>
    <div class="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow-lg w-full max-w-md text-left">
      <div v-if="error" class="text-sm text-red-500 mb-4">
        {{ error }}
      </div>
      <div class="flex flex-wrap justify-around mb-4">
        <img :src="metadata.cover" alt="Cover" class="w-32 h-32 rounded" />
        <div class="flex flex-col text-left justify-center">
          <div class="flex flex-row">
            <p class="text-lg text-light-text-muted dark:text-dark-text-muted mr-4">Название:</p>
            <p class="text-lg text-light-text dark:text-dark-text">{{ metadata.title }}</p>
          </div>
          <div class="flex flex-row">
            <p class="text-lg text-light-text-muted dark:text-dark-text-muted mr-4">Автор:</p>
            <p class="text-lg text-light-text dark:text-dark-text">{{ metadata.author }}</p>
          </div>
          <div class="flex flex-row">
            <p class="text-lg text-light-text-muted dark:text-dark-text-muted mr-4">Год:</p>
            <p class="text-lg text-light-text dark:text-dark-text">{{ metadata.year }}</p>
          </div>
          <div class="flex flex-row">
            <p class="text-lg text-light-text-muted dark:text-dark-text-muted mr-4">Альбом:</p>
            <p class="text-lg text-light-text dark:text-dark-text">{{ metadata.album }}</p>
          </div>
          <div class="flex flex-row">
            <p class="text-lg text-light-text-muted dark:text-dark-text-muted mr-4">Страна:</p>
            <p class="text-lg text-light-text dark:text-dark-text">{{ metadata.country }}</p>
          </div>
        </div>
      </div>
      <audio :src="metadata.streamUrl" controls class="w-full mb-4"></audio>
      <div class="flex justify-center gap-3 flex-wrap">
        <button
          class="flex items-center text-light-text dark:text-dark-text px-4 py-2 rounded cursor-pointer bg-light-primary dark:bg-dark-primary hover:bg-light-secondary dark:hover:bg-dark-secondary"
          @click="downloadAudio"
        >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
        </button>
        <button
          class="flex items-center text-light-text dark:text-dark-text px-4 py-2 rounded cursor-pointer bg-light-primary dark:bg-dark-primary hover:bg-light-secondary dark:hover:bg-dark-secondary"
          @click="addToCollection"
        >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        </button>
        <button
          class="px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-dark-text hover:bg-light-secondary dark:hover:bg-dark-secondary"
          @click="publishTrack"
        >
          Опубликовать
        </button>
      </div>
    </div>
  </div>
</template>
