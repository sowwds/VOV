<template>
<div class="flex-1 flex flex-col min-h-0">
<div class="flex-1 overflow-auto p-6 transition-colors duration-150">
  <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Коллекция</h1>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 2xl:grid-cols-8 gap-4">
    <TrackCard
        v-for="track in tracks"
        :key="track.id"
        :track="track"
        @like="onLike"
        @play="onPlay"
        @more="onMore"
    />
  </div>
</div>
</div>
</template>

<script setup>
import TrackCard from '@/components/TrackCard.vue'
import { ref } from 'vue'

const tracks = ref([
  { id: 1, title: 'Epoch', artist: 'Tycho', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Tycho_-_Epoch.jpg' },
  { id: 2, title: 'Awake', artist: 'Tycho', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Tycho_-_Awake.png' },
  { id: 3, title: 'Dive', artist: 'Tycho', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/11/Dive_tycho_album.jpg' }
])

function onLike(id) {
  console.log(`Liked track ${id}`)
}
function onPlay(id) {
  console.log(`Play track ${id}`)
}
function onMore(id) {
  console.log(`More options for ${id}`)
}
</script>

<style scoped>
/* стили страницы */
</style>