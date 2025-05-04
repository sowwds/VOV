<template>
  <div
      class="bg-white dark:bg-gray-800
           border-t border-gray-200 dark:border-gray-700
           py-4 px-4 flex items-center justify-between h-20"
  >
    <!-- Левая часть: обложка, название, действия -->
    <div class="flex items-center space-x-3">
      <img
          :src="coverUrl"
          alt="Cover"
          class="w-12 h-12 object-cover rounded
               bg-gray-100 dark:bg-gray-700"
      />
      <div class="flex flex-col">
        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {{ trackTitle }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ artistName }}
        </p>
      </div>
      <button
          @click="toggleLike"
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label="Like"
      >
        <component :is="isLiked ? HeartSolid : HeartOutline" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>
      <button
          @click="reportTrack"
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label="Report"
      >
        <ExclamationTriangleIcon class="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>
    </div>

    <!-- Центральная часть: управление воспроизведением и таймер -->
    <div class="flex flex-col items-center space-y-1 flex-1 px-4">
      <div class="flex items-center space-x-4">
        <button
            @click="prevTrack"
            class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            aria-label="Previous"
        >
          <ChevronLeftIcon class="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <button
            @click="togglePlay"
            class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
            aria-label="Play/Pause"
        >
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
        <button
            @click="nextTrack"
            class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            aria-label="Next"
        >
          <ChevronRightIcon class="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
      <div class="flex items-center space-x-2 w-full">
        <span class="text-xs text-gray-700 dark:text-gray-200">
          {{ formatTime(currentTime) }}
        </span>
        <input
            type="range"
            min="0"
            :max="duration"
            v-model="currentTime"
            class="w-full"
        />
        <span class="text-xs text-gray-700 dark:text-gray-200">
          {{ formatTime(duration) }}
        </span>
      </div>
    </div>

    <!-- Правая часть: громкость и доп. кнопки -->
    <div class="flex items-center space-x-3">
      <input
          type="range"
          min="0"
          max="100"
          v-model="volume"
          class="w-20"
          aria-label="Volume"
      />
      <button
          @click="openInfo"
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label="Info"
      >
        <InformationCircleIcon class="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>
      <button
          @click="openEq"
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label="Equalizer"
      >
        <AdjustmentsHorizontalIcon class="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>
      <button
          @click="showLyrics"
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          aria-label="Lyrics"
      >
        <MicrophoneIcon class="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HeartIcon as HeartOutline } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid'
import { ExclamationTriangleIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, InformationCircleIcon, AdjustmentsHorizontalIcon, MicrophoneIcon } from '@heroicons/vue/24/outline'

const coverUrl = ref('https://via.placeholder.com/150')
const trackTitle = ref('Название трека')
const artistName = ref('Исполнитель')
const isLiked = ref(false)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(240)
const volume = ref(50)

function toggleLike()       { isLiked.value = !isLiked.value }
function reportTrack()      { /* … */ }
function prevTrack()        { /* … */ }
function nextTrack()        { /* … */ }
function togglePlay()       { isPlaying.value = !isPlaying.value }
function openInfo()         { /* … */ }
function openEq()           { /* … */ }
function showLyrics()       { /* … */ }

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(Math.floor(sec % 60)).padStart(2, '0')
  return `${m}:${s}`
}
</script>

<style scoped>
/* дополнительные стили, если нужны */
</style>