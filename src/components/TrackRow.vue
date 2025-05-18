<template>
  <div
      class="flex items-center p-2 bg-light-surface dark:bg-dark-surface rounded hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 cursor-pointer"
      @click="playTrack"
  >
    <!-- Обложка -->
    <div class="relative w-16 h-16 mr-4">
      <img
          :src="track.coverUrl ? fullCoverUrl(track.coverUrl) : defaultCover"
          :alt="track.title"
          class="w-full h-full object-cover rounded"
      />
      <div
          class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity"
      >
        <button @click.stop="playTrack" class="p-1 hover:scale-110 text-white transition-transform duration-200">
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-8 h-8" />
        </button>
      </div>
    </div>

    <!-- Название и автор -->
    <div class="flex-1">
      <h4 class="text-light-text dark:text-dark-text text-sm font-semibold truncate">
        {{ track.title }}
      </h4>
      <p class="text-light-text-muted dark:text-dark-text-muted text-xs truncate">
        {{ track.author }}<span v-if="track.year"> – {{ track.year }}</span>
      </p>
    </div>

    <!-- Кнопки -->
    <div class="flex space-x-2">
      <!-- Добавить/убрать из библиотеки -->
      <button @click.stop="onToggleLibrary" class="text-light-text dark:text-dark-text">
        <HeartIcon :class="['w-5 h-5', isInLibrary ? 'text-red-500' : '']" />
      </button>
      <!-- В очередь -->
      <button @click.stop="enqueue" class="text-light-text dark:text-dark-text">
        <QueueListIcon class="w-5 h-5" />
      </button>
      <!-- Следующим -->
      <button @click.stop="enqueueNext" class="text-light-text dark:text-dark-text">
        <ArrowRightIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/store/player'
import { useTrackStore } from '@/store/track'
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  QueueListIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'

// props
const { track } = defineProps({
  track: { type: Object, required: true }
})

// сторы
const playerStore = usePlayerStore()
const trackStore  = useTrackStore()

// локальное состояние: находится ли трек в библиотеке
const isInLibrary = ref(false)

watch(
    () => track.trackId,
    async id => {
      // при смене входного track.trackId проверяем
      isInLibrary.value = trackStore.userLibrary.some(t => t.trackId === id)
    },
    { immediate: true }
)

// вычисляемые флаги для плеера
const isCurrent = computed(() => playerStore.currentTrackId === track.trackId)
const isPlaying = computed(() => playerStore.isPlaying && isCurrent.value)

// дефолтная обложка
const defaultCover = 'https://via.placeholder.com/48'

// методы плеера
function playTrack() {
  if (!isCurrent.value) {
    playerStore.playTrack(track.trackId)
  } else {
    playerStore.togglePlay()
  }
}

function enqueue() {
  playerStore.enqueue(track.trackId)
}

function enqueueNext() {
  playerStore.enqueueNext(track.trackId)
}

// метод добавления/удаления из библиотеки
async function onToggleLibrary() {
  try {
    if (isInLibrary.value) {
      // можно реализовать удаление, если есть роут в API
      // await trackStore.removeFromLibrary(track.trackId)
    } else {
      await trackStore.addToLibrary(track.trackId)
    }
    // обновляем флаг
    isInLibrary.value = !isInLibrary.value
  } catch (e) {
    console.error('Не удалось обновить библиотеку:', e)
  }
}

// собираем полный URL обложки из относительного пути
function fullCoverUrl(path) {
  return `${import.meta.env.VITE_S3_BASE_URL}/${path}`
}
</script>

<style scoped>
.text-light-text-muted {
  font-size: 0.75rem;
  color: #6b7280;
}
.dark .text-dark-text-muted {
  color: #9ca3af;
}
</style>
