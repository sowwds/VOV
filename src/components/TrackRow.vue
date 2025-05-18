<template>
  <div
      class="flex items-center p-2 bg-light-surface dark:bg-dark-surface rounded hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 cursor-pointer"
      @click="playTrack"
  >
    <!-- Обложка с оверлеем -->
    <div class="relative w-16 h-16 mr-4">
      <img
          :src="track.coverurl || defaultCover"
          :alt="track.title || 'Трек'"
          class="w-full h-full object-cover rounded"
      />
      <div
          class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity"
      >
        <button
            @click.stop="playTrack"
            class="p-1 hover:scale-110 text-white transition-transform duration-200"
        >
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-8 h-8" />
        </button>
      </div>
    </div>

    <!-- Название и автор -->
    <div class="flex-1">
      <h4 class="text-light-text dark:text-dark-text text-sm font-semibold truncate">
        {{ track.title || 'Без названия' }}
      </h4>
      <p class="text-light-text-muted dark:text-dark-text-muted text-xs truncate">
        {{ track.author || 'Неизвестный исполнитель' }}
        <span v-if="track.year"> - {{ track.year }}</span>
      </p>
    </div>

    <!-- Кнопки управления -->
    <div class="flex space-x-2">
      <button
          @click.stop="$emit('add-to-library', track.trackid)"
          class="text-light-text dark:text-dark-text"
      >
        <HeartIcon class="w-5 h-5" :class="{ 'text-red-500': isInLibrary }" />
      </button>
      <button @click.stop="addToQueue" class="text-light-text dark:text-dark-text">
        <QueueListIcon class="w-5 h-5" />
      </button>
      <button @click.stop="addNext" class="text-light-text dark:text-dark-text">
        <ArrowRightIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/store/player'
import { useTrackStore } from '@/store/track'
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  QueueListIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline'

const { track } = defineProps({
  track: { type: Object, required: true }
})
defineEmits(['add-to-library'])

const player = usePlayerStore()
const trackStore = useTrackStore()

const defaultCover = 'https://via.placeholder.com/48'

// Сравниваем с полем currentTrackId
const isCurrent = computed(() => player.currentTrackId === track.trackid)
const isPlaying = computed(() => player.isPlaying && isCurrent.value)

const isInLibrary = computed(() =>
    trackStore.userLibrary.some(t => t.trackid === track.trackid)
)

function playTrack() {
  if (!isCurrent.value) {
    player.playTrack(track.trackid)
  } else {
    player.togglePlay()
  }
}

function addToQueue() {
  player.enqueue(track.trackid)
}

function addNext() {
  player.enqueueNext(track.trackid)
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
