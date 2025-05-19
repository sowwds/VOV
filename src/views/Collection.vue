<!-- src/views/Collection.vue -->
<template>
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 overflow-auto p-6 transition-colors duration-150">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Коллекция</h1>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <TrackCard
              v-for="track in userLibrary"
              :key="track.trackId"
              :track="track"
              @play="onPlay"
              @remove-from-library="removeFromLibrary"
          />
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { usePlayerStore } from '@/store/player';
  import { useTrackStore } from '@/store/track';
  import { useToast } from 'vue-toastification';
  import TrackCard from '@/components/TrackLayout/TrackCard.vue';

  const playerStore = usePlayerStore();
  const trackStore = useTrackStore();
  const toast = useToast();
  const userLibrary = ref([]);

  onMounted(async () => {
    await trackStore.fetchUserLibrary();
    userLibrary.value = trackStore.userLibrary;
  });

  function onPlay(trackId) {
    playerStore.playTrack(trackId);
  }

  async function removeFromLibrary(trackId) {
    try {
      await trackStore.removeFromLibrary(trackId);
      userLibrary.value = trackStore.userLibrary; // Sync local state
      toast.success('Трек удален из коллекции!');
    } catch (err) {
      console.error('Ошибка удаления из коллекции:', err);
      toast.error('Не удалось удалить трек из коллекции');
    }
  }
  </script>

  <style scoped>
  /* Стили аналогичны предыдущим */
  </style>
