<template>
  <!-- Floating window mode -->
  <div
      v-if="isFloating"
      ref="floatingWindow"
      class="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden z-50"
      :style="windowStyle"
      @mousedown="startDrag"
  >
    <div class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 cursor-move">
      <div class="flex items-center space-x-2">
        <img :src="coverUrl" alt="Cover" class="w-6 h-6 object-cover rounded">
        <span class="text-sm font-medium">{{ trackTitle }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="toggleFloatMode" class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
          <ArrowDownIcon class="w-4 h-4" />
        </button>
        <button @click="toggleWindowSize" class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
          <component :is="isExpanded ? MinusIcon : PlusIcon" class="w-4 h-4" />
        </button>
        <button @click="closeWindow" class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="p-3" :class="{'hidden': !isExpanded}">
      <!-- Compact player content -->
      <div class="flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <p class="text-sm font-semibold">{{ trackTitle }}</p>
            <p class="text-xs text-gray-500">{{ artistName }}</p>
          </div>
          <button @click="toggleLike" class="p-1">
            <component :is="isLiked ? HeartSolid : HeartOutline" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex items-center justify-center space-x-4">
          <button @click="prevTrack" class="p-1">
            <ChevronLeftIcon class="w-5 h-5" />
          </button>
          <button @click="togglePlay" class="p-1 bg-gray-200 dark:bg-gray-700 rounded-full">
            <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-5 h-5" />
          </button>
          <button @click="nextTrack" class="p-1">
            <ChevronRightIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-xs">{{ formatTime(currentTime) }}</span>
          <input type="range" min="0" :max="duration" v-model="currentTime" class="flex-1">
          <span class="text-xs">{{ formatTime(duration) }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Standard music bar mode -->
  <div
      v-else
      class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 flex items-center justify-between h-20"
  >
    <!-- Left section -->
    <div class="flex items-center space-x-3">
      <img :src="coverUrl" alt="Cover" class="w-12 h-12 object-cover rounded bg-gray-100 dark:bg-gray-700">
      <div class="flex flex-col">
        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ trackTitle }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ artistName }}</p>
      </div>
      <button @click="toggleLike" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        <component :is="isLiked ? HeartSolid : HeartOutline" class="w-5 h-5" />
      </button>
      <button @click="toggleFloatMode" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        <ArrowsPointingOutIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Center section -->
    <div class="flex flex-col items-center space-y-1 flex-1 px-4">
      <div class="flex items-center space-x-4">
        <button @click="prevTrack" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <button @click="togglePlay" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-5 h-5" />
        </button>
        <button @click="nextTrack" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
      <div class="flex items-center space-x-2 w-full">
        <span class="text-xs">{{ formatTime(currentTime) }}</span>
        <input type="range" min="0" :max="duration" v-model="currentTime" class="w-full">
        <span class="text-xs">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- Right section -->
    <div class="flex items-center space-x-3">
      <input type="range" min="0" max="100" v-model="volume" class="w-20">
      <button @click="openInfo" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        <InformationCircleIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  HeartIcon as HeartOutline,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  InformationCircleIcon,
  ArrowsPointingOutIcon,
  ArrowDownIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid'

// Player state
const coverUrl = ref('https://via.placeholder.com/150')
const trackTitle = ref('Название трека')
const artistName = ref('Исполнитель')
const isLiked = ref(false)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(240)
const volume = ref(50)

// Floating window state
const isFloating = ref(false)
const isExpanded = ref(true)
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })
const windowPos = ref({ x: 20, y: 20 })
const floatingWindow = ref(null)

const windowStyle = computed(() => ({
  left: `${windowPos.value.x}px`,
  top: `${windowPos.value.y}px`,
  width: isExpanded.value ? '300px' : 'auto',
  minWidth: '200px'
}))

function toggleFloatMode() {
  isFloating.value = !isFloating.value
  if (!isFloating.value) {
    // Reset position when returning to bar mode
    windowPos.value = { x: 20, y: 20 }
  }
}

function toggleWindowSize() {
  isExpanded.value = !isExpanded.value
}

function closeWindow() {
  isFloating.value = false
}

function startDrag(e) {
  if (e.target.closest('button')) return // Ignore if clicked on a button

  isDragging.value = true
  startPos.value = {
    x: e.clientX - windowPos.value.x,
    y: e.clientY - windowPos.value.y
  }

  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

function drag(e) {
  if (!isDragging.value) return

  windowPos.value = {
    x: e.clientX - startPos.value.x,
    y: e.clientY - startPos.value.y
  }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}

// Player controls
function toggleLike()       { isLiked.value = !isLiked.value }
function prevTrack()        { /* ... */ }
function nextTrack()        { /* ... */ }
function togglePlay()       { isPlaying.value = !isPlaying.value }
function openInfo()         { /* ... */ }

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(Math.floor(sec % 60)).padStart(2, '0')
  return `${m}:${s}`
}
</script>

<style scoped>
/* Draggable window header */
.cursor-move {
  cursor: move;
  user-select: none;
}

/* Range input styling */
input[type="range"] {
  @apply appearance-none h-[1px] rounded-full;
}
input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-[3] h-[3] rounded-full  cursor-pointer;
}
</style>