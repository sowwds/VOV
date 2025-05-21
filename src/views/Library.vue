<!-- src/views/Library.vue -->
<template>
    <div class="ml-auto mr-auto w-full max-w-screen-lg text-light-text dark:text-dark-text">
      <!-- Поиск -->
      <div class="flex flex-wrap justify-center mb-10 align-center">
        <span class="mr-4 my-2">Поиск по трекам</span>
        <SearchInput
          v-model="searchQuery"
          @search="handleSearch"
          class="max-w-screen-sm w-full"
          placeholder="Введите название трека"
        />
      </div>

      <!-- Результаты поиска -->
      <div v-if="trackStore.searchResults.length" class="mt-8">
        <h3 class="text-lg mb-4">Результаты поиска ({{ trackStore.searchTotal }} треков)</h3>
        <div class="flex flex-col space-y-2">
          <TrackRow
            v-for="t in trackStore.searchResults"
            :key="t.trackId"
            :track="t"
            section="searchResults"
            @add-to-library="addToLibrary"
            @remove-from-library="removeFromLibrary"
            @add-to-queue="addToQueue"
            @play-track="playTrack"
            @toggle-play="togglePlay"
            @add-next="addToNext"
          />
        </div>
        <!-- Pagination -->
        <div v-if="trackStore.searchResults.length < trackStore.searchTotal" class="mt-4 text-center">
          <button
            @click="loadMore"
            class="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded hover:bg-opacity-90 transition"
          >
            Загрузить еще
          </button>
        </div>
      </div>
      <div v-else-if="searchQuery && !trackStore.searchResults.length" class="mt-8 text-center">
        <p>Треки не найдены</p>
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
          class="flex w-full overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-light-primary scrollbar-thumb-dark-primary"
        >
          <div v-for="t in popularTracks" :key="t.trackId" class="flex-none w-64">
            <TrackCardLibrary
              :track="t"
              :section="popularTab === 'listens' ? 'topPlays' : 'topLikes'"
              @add-to-library="addToLibrary"
              @remove-from-library="removeFromLibrary"
              @add-to-queue="addToQueue"
              @play-track="playTrack"
              @toggle-play="togglePlay"
              @add-next="addToNext"
            />
          </div>
        </div>
      </div>

      <!-- Новые треки -->
      <div class="mt-8">
        <h3 class="text-lg mb-4">Новые треки</h3>
        <div class="flex flex-col space-y-2">
          <TrackRow
            v-for="t in trackStore.newTracks"
            :key="t.trackId"
            :track="t"
            section="newTracks"
            @add-to-library="addToLibrary"
            @remove-from-library="removeFromLibrary"
            @add-to-queue="addToQueue"
            @play-track="playTrack"
            @toggle-play="togglePlay"
            @add-next="addToNext"
          />
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useTrackStore } from '@/store/track';
  import { usePlayerStore } from '@/store/player';
  import { useToast } from 'vue-toastification';
  import { useAuthStore } from '@/store/auth';
  import { debounce } from 'lodash';

  import SearchInput from '@/components/Sidebar/SearchInput.vue';
  import TrackCardLibrary from '@/components/TrackLayout/TrackCardLibrary.vue';
  import TrackRow from '@/components/TrackLayout/TrackRow.vue';

  const trackStore = useTrackStore();
  const playerStore = usePlayerStore();
  const authStore = useAuthStore();
  const toast = useToast();

  // Поисковый запрос
  const searchQuery = ref('');
  const handleSearch = debounce(async (query) => {
    if (query && query.trim()) {
      try {
        // Reset pagination for new search
        await trackStore.searchTracks(query, 0, trackStore.searchSize, 'relevance');
      } catch (err) {
        console.error('Ошибка поиска:', err);
        toast.error('Ошибка при поиске треков');
      }
    } else {
      trackStore.searchResults = [];
      trackStore.searchTotal = 0;
      trackStore.searchFrom = 0;
    }
  }, 300);

  // Загрузка дополнительных результатов
  const loadMore = async () => {
    try {
      const nextFrom = trackStore.searchFrom + trackStore.searchSize;
      await trackStore.searchTracks(searchQuery.value, nextFrom, trackStore.searchSize, 'relevance');
    } catch (err) {
      console.error('Ошибка загрузки дополнительных треков:', err);
      toast.error('Не удалось загрузить дополнительные треки');
    }
  };

  // Популярная вкладка
  const popularTab = ref('listens'); // 'listens' | 'likes'
  const popularTracks = computed(() =>
    popularTab.value === 'listens' ? trackStore.topPlays : trackStore.topLikes
  );

  // Предзагрузка данных
  onMounted(async () => {
    try {
      const fetches = [
        trackStore.fetchTopPlays(10),
        trackStore.fetchTopLikes(10),
        trackStore.fetchNewTracks(10),
      ];
      // Fetch user library only if user is logged in
      if (authStore.userId) {
        fetches.push(trackStore.fetchUserLibrary());
      }
      await Promise.all(fetches);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      toast.error('Не удалось загрузить данные');
    }
  });

  // Обработчики событий
  const addToLibrary = async trackId => {
    try {
      await trackStore.addToLibrary(trackId);
      toast.success('Трек добавлен в коллекцию!');
    } catch (err) {
      console.error('Ошибка добавления в коллекцию:', err);
      toast.error('Не удалось добавить трек в коллекцию');
    }
  };

  const removeFromLibrary = async trackId => {
    try {
      await trackStore.removeFromLibrary(trackId);
      toast.success('Трек удален из коллекции!');
    } catch (err) {
      console.error('Ошибка удаления из коллекции:', err);
      toast.error('Не удалось удалить трек из коллекции');
    }
  };

  const addToQueue = trackId => {
    playerStore.enqueue(trackId);
    toast.success('Трек добавлен в очередь!');
  };

  const addToNext = trackId => {
    playerStore.enqueueNext(trackId);
    toast.success('Трек добавлен первым в очередь!');
  };

  const playTrack = trackId => {
    playerStore.playTrack(trackId, undefined, { skipQueue: true });
  };

  const togglePlay = trackId => {
    playerStore.togglePlay(trackId);
  };
  </script>

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
