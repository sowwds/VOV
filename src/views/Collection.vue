<!-- src/views/Collection.vue -->
<template>
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 overflow-auto p-6 transition-colors duration-150">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Коллекция</h1>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <TrackCard
              v-for="t in userLibrary"
              :key="t.trackId"
              :track="t"
              section="userLibrary"
              @play-track="playTrack"
              @toggle-play="togglePlay"
              @add-to-queue="addToQueue"
              @add-next="addToNext"
              @remove-from-library="removeFromLibrary"
          />
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTrackStore } from '@/store/track'
import { usePlayerStore } from '@/store/player'
import { useAuthStore } from '@/store/auth'
import { useToast } from 'vue-toastification'

import TrackCard from '@/components/TrackLayout/TrackCard.vue'

const trackStore  = useTrackStore()
const playerStore = usePlayerStore()
const authStore   = useAuthStore()
const toast       = useToast()

// локальный массив для рендера
const userLibrary = ref([])

onMounted(async () => {
  if (!authStore.userId) {
    // если не залогинен — сразу пусто
    userLibrary.value = []
    return
  }
  try {
    await trackStore.fetchUserLibrary()
    userLibrary.value = trackStore.userLibrary
  } catch (err) {
    console.error('Ошибка загрузки коллекции:', err)
    toast.error('Не удалось загрузить вашу коллекцию')
  }
})

// события от карточек:
const playTrack = trackId => {
  // пропускаем очередь, чтобы стартовал именно этот трек
  playerStore.playTrack(trackId, 'userLibrary', { skipQueue: true })
}
const togglePlay = trackId => {
  playerStore.togglePlay(trackId)
}
const addToQueue = trackId => {
  playerStore.enqueue(trackId)
  toast.success('Трек добавлен в очередь')
}
const addToNext = trackId => {
  playerStore.enqueueNext(trackId)
  toast.success('Трек добавлен следующим')
}
const removeFromLibrary = async trackId => {
  try {
    await trackStore.removeFromLibrary(trackId)
    // синхронизуем локальный список
    userLibrary.value = trackStore.userLibrary
    toast.success('Трек удалён из коллекции')
  } catch (err) {
    console.error('Ошибка удаления из коллекции:', err)
    toast.error('Не удалось удалить трек')
  }
}
</script>

  <style scoped>
  /* Стили аналогичны предыдущим */
  </style>
