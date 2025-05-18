<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTrackStore } from '@/store/track';
import { usePlayerStore } from '@/store/player';
import { useToast } from 'vue-toastification';
import SearchInput from '@/components/Sidebar/SearchInput.vue';
import TrackCard from '@/components/TrackCard.vue';
import TrackRow from '@/components/TrackRow.vue';

// Хранилища
const trackStore = useTrackStore();
const playerStore = usePlayerStore();
const toast = useToast();

// Состояние коллекции
const collection = trackStore.fetchUserLibrary();

// Состояние поиска
const searchQuery = ref('');

// Состояние вкладки популярных треков
const popularTab = ref('listens'); // listens | likes

// Вычисляемые свойства
const popularTracks = computed(() => {
  if (popularTab.value === 'listens') {
    return trackStore.topPlays;
  } else if (popularTab.value === 'likes') {
    return trackStore.topLikes;
  }
  return [];
});

// Загрузка данных
const fetchData = async () => {
  try {
    await Promise.all([
      trackStore.fetchTopPlays(10),
      trackStore.fetchTopLikes(10),
      trackStore.fetchNewTracks(10),
    ]);
  } catch (error) {
    console.error('Ошибка загрузки треков:', error);
    toast.error('Не удалось загрузить треки');
  }
};

// Обработка поиска
const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    try {
      await trackStore.searchTracks(searchQuery.value);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      toast.error('Ошибка при поиске треков');
    }
  } else {
    trackStore.searchResults = [];
  }
};

// Обработка событий от TrackCard и TrackRow
const addToLibrary = async (trackId) => {
  try {
    await trackStore.addToLibrary(trackId);
    toast.success('Трек добавлен в коллекцию!');
  } catch (error) {
    console.error('Ошибка добавления в коллекцию:', error);
    toast.error('Не удалось добавить трек в коллекцию');
  }
};

const addToQueue = async (trackId) => {
  try {
    await playerStore.enqueue(trackId);
    toast.success('Трек добавлен в очередь!');
  } catch (error) {
    console.error('Ошибка добавления в очередь:', error);
    toast.error('Не удалось добавить трек в очередь');
  }
};

const playTrack = (trackId) => {
  try {
    playerStore.playTrack(trackId);
  } catch (error) {
    console.error('Ошибка воспроизведения:', error);
    toast.error('Не удалось воспроизвести трек');
  }
};

// Загрузка данных при монтировании
onMounted(fetchData);
</script>

<template>
  <div class="ml-auto mr-auto w-full max-w-screen-lg text-light-text dark:text-dark-text">
    <!-- Поиск -->
    <div class="flex flex-wrap justify-center mb-10 align-center">
      <span class="mr-4 my-6">Поиск по трекам</span>
      <SearchInput
          v-model="searchQuery"
          @input="handleSearch"
          class="max-w-screen-sm w-full"
          placeholder="Введите название трека"
      />
    </div>

    <!-- Результаты поиска -->
    <div v-if="trackStore.searchResults.length" class="mt-8">
      <h3 class="text-lg mb-4">Результаты поиска</h3>
      <div class="flex flex-col space-y-2">
        <TrackRow
            v-for="track in trackStore.searchResults"
            :key="track.trackId"
            :track="track"
            @add-to-library="addToLibrary"
            @add-to-queue="addToQueue"
            @play-track="playTrack"
        />
      </div>
    </div>

    <!-- Популярные треки -->
    <div class="flex flex-wrap">
      <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6 w-full">
        Слушайте популярное
      </h1>
      <div class="flex space-x-4 mb-4">
        <button
            @click="popularTab = 'listens'"
            class="px-4 py-2 text-light-text dark:text-dark-text"
            :class="{ 'border-b border-light-primary dark:border-dark-primary': popularTab === 'listens' }"
        >
          По прослушиваниям
        </button>
        <button
            @click="popularTab = 'likes'"
            class="px-4 py-2 text-light-text dark:text-dark-text"
            :class="{ 'border-b border-light-primary dark:border-dark-primary': popularTab === 'likes' }"
        >
          По лайкам
        </button>
      </div>
      <div
          class="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-light-primary dark:scrollbar-thumb-dark-primary"
      >
        <div v-for="track in popularTracks" :key="track.trackId" class="flex-none w-64">
          <TrackCard
              :track="track"
              @add-to-library="addToLibrary"
              @add-to-queue="addToQueue"
              @play-track="playTrack"
          />
        </div>
      </div>
    </div>

    <!-- Новые треки -->
    <div class="mt-8">
      <h3 class="text-lg mb-4">Новые треки</h3>
      <div class="flex flex-col space-y-2">
        <TrackRow
            v-for="track in trackStore.newTracks"
            :key="track.trackId"
            :track="track"
            @add-to-library="addToLibrary"
            @add-to-queue="addToQueue"
            @play-track="playTrack"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thumb-light-primary {
  scrollbar-color: var(--color-light-primary) var(--color-light-surface);
}
.dark .scrollbar-thumb-dark-primary {
  scrollbar-color: var(--color-dark-primary) var(--color-dark-surface);
}
.scrollbar-track-light-surface {
  background: var(--color-light-surface);
}
.dark .scrollbar-track-dark-surface {
  background: var(--color-dark-surface);
}
</style>
