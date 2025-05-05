<template>
  <!-- Контент страницы "Коллекция"; Sidebar и MusicBar уже в MainLayout -->
  <div class="flex-1 flex flex-col min-h-0">
    <div class="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-150">
      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Коллекция</h1>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 2xl:grid-cols-8 gap-4">
        <TrackCard
            v-for="track in tracks"
            :key="track.id"
            :track="track"
            @changeVersion="onVersionChange"
        />
      </div>
    </div>
  </div>
</template>


<script setup>
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import MusicBar from '@/components/MusicBar.vue'
import TrackCard from '@/components/TrackCard.vue'
import { ref } from 'vue'

// Sample data — замените реальными метаданными
const tracks = ref([
  { id: 1, title: 'Трек 1', artist: 'Исполнитель A', imageUrl: 'https://via.placeholder.com/300x300' },
  { id: 2, title: 'Трек 2', artist: 'Исполнитель B', imageUrl: 'https://via.placeholder.com/300x300' },
  { id: 3, title: 'Трек 3', artist: 'Исполнитель B', imageUrl: 'https://via.placeholder.com/300x300' },
  { id: 4, title: 'Трек 4', artist: 'Исполнитель B', imageUrl: 'https://via.placeholder.com/300x300' },
  { id: 5, title: 'Трек 5', artist: 'Исполнитель B', imageUrl: 'https://via.placeholder.com/300x300' },
  { id: 6, title: 'Трек 6', artist: 'Исполнитель B', imageUrl: 'https://via.placeholder.com/300x300' },
  { id: 7, title: 'Трек 7', artist: 'Исполнитель B', imageUrl: 'https://via.placeholder.com/300x300' },
  { id: 8, title: 'Трек 8', artist: 'Исполнитель B', imageUrl: 'https://via.placeholder.com/300x300' },
  // …
])

function onVersionChange({ id, version }) {
  console.log(`Track ${id} switched to ${version}`)
  // TODO: реагировать на изменение версии
}
</script>

<style scoped>

</style>