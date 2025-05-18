<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import SearchInput from '@/components/Sidebar/SearchInput.vue';
import TrackCard from '@/components/TrackCard.vue';
import TrackRow from '@/components/TrackRow.vue';

// State for search
const searchQuery = ref('');

// State for popular tracks tab
const popularTab = ref('listens'); // Default: by listens

// State for tracks
const topPlays = ref([]);
const topLikes = ref([]);
const newTracks = ref([]);

// Fetch data from API
const fetchData = async () => {
  try {
    const [playsResponse, likesResponse, newResponse] = await Promise.all([
      api.get('/public-library/top-plays', { params: { limit: 10 } }),
      api.get('/public-library/top-likes', { params: { limit: 10 } }),
      api.get('/public-library', { params: { limit: 10 } }), // Placeholder for new tracks
    ]);
    topPlays.value = playsResponse.data.tracks;
    topLikes.value = likesResponse.data.tracks;
    newTracks.value = newResponse.data.tracks;
    console.log(topPlays.value);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    // TODO: Add user-facing error notification
  }
};

// Computed property for popular tracks
const popularTracks = computed(() => {
  if (popularTab.value === 'listens') {
    return topPlays.value;
  } else if (popularTab.value === 'likes') {
    return topLikes.value;
  }
  return [];
});

// Load data on mount
onMounted(fetchData);
</script>

<template>
  <div class="ml-auto mr-auto w-full max-w-screen-lg text-light-text dark:text-dark-text">
    <!-- Search -->
    <div class="flex flex-wrap justify-center mb-10 align-center">
      <span class="mr-4 my-6">Поиск по трекам</span>
      <SearchInput v-model="searchQuery" class="max-w-screen-sm w-full" placeholder="Введите название трека" />
    </div>

    <!-- Popular tracks with horizontal scroll -->
    <div class="flex flex-wrap">
      <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Слушайте популярное</h1>
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
          <TrackCard :track="track" />
        </div>
      </div>
    </div>

    <!-- New tracks -->
    <div class="mt-8">
      <h3 class="text-lg mb-4">Новые треки</h3>
      <div class="flex flex-col space-y-2">
        <TrackRow v-for="track in newTracks" :key="track.trackId" :track="track" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar customization */
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
