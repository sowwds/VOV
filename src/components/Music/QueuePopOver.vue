<template>
  <div class="fixed bottom-20 right-4 w-96 bg-light-surface dark:bg-dark-surface shadow-xl rounded-lg p-4 z-50 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Очередь воспроизведения</h3>
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <ul
        class="space-y-2 max-h-96 overflow-y-auto"
        ref="queueList"
    >
      <li
          v-for="(track, idx) in queueTracks"
          :key="track.id"
          draggable="true"
          @dragstart="handleDragStart($event, idx)"
          @dragover.prevent="handleDragOver($event, idx)"
          @drop="handleDrop($event, idx)"
          @dragenter.prevent
          class="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-move transition-colors"
          :class="{
          'bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-gray-600': draggedItemIndex === idx,
          'border border-transparent': draggedItemIndex !== idx,
          'bg-light-primary/40 dark:bg-dark-primary/50': isCurrentTrack(track)  // Добавляем этот класс
        }"
      >
        <!-- Номер трека в очереди -->
        <span class="text-xs text-gray-500 dark:text-gray-400 w-5 mr-1">{{ idx + 1 }}</span>

        <!-- Аватарка автора -->
        <img
            v-if="track.avatarUrl"
            :src="track.avatarUrl"
            class="w-8 h-8 rounded-full object-cover mr-3"
            alt="Artist"
        >
        <div v-else class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <!-- Информация о треке -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate text-light-text dark:text-dark-text">{{ track.title }}</p>
          <p class="text-xs truncate text-light-text-muted dark:text-dark-text-muted">{{ track.artist || 'Неизвестный исполнитель' }}</p>
        </div>

        <!-- Кнопки управления -->
        <div class="flex items-center space-x-2 ml-3">
          <button
              @click.stop="handlePlayClick(track)"
              class="p-1.5 text-green-600 hover:text-green-800 dark:hover:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30"
              :title="isCurrentPlaying(track) ? 'Пауза' : 'Воспроизвести'"
          >
            <svg v-if="!isCurrentPlaying(track)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
              @click.stop="remove(track)"
              class="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
              title="Удалить из очереди"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </li>
      <li v-if="!queueTracks.length" class="text-center py-4 text-gray-500 dark:text-gray-400">
        Очередь пуста
      </li>
    </ul>

    <div v-if="queueTracks.length" class="mt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Всего треков: {{ queueTracks.length }}
      </span>
      <button
          @click="clearAll"
          class="px-3 py-1 text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
      >
        Очистить все
      </button>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '@/store/player'
import { computed, ref } from 'vue'

const emit = defineEmits(['close'])
const player = usePlayerStore()
const draggedItemIndex = ref(null)

// Список объектов треков в очереди
const queueTracks = computed(() => player.queueTracks)

// Проверка, является ли трек текущим (независимо от состояния воспроизведения)
const isCurrentTrack = (track) => {
  return player.currentTrack === track.id
}

// Проверка, играет ли текущий трек
const isCurrentPlaying = (track) => {
  return player.currentTrack === track.id && player.isPlaying
}

function handleDragStart(event, index) {
  event.dataTransfer.setData('text/plain', index)
  draggedItemIndex.value = index
  event.currentTarget.style.opacity = '0.4'
}

function handleDragOver(event, index) {
  event.preventDefault()
  // Подсветка элемента над которым перетаскиваем
  const targetElement = event.currentTarget
  targetElement.classList.add('bg-blue-50', 'dark:bg-gray-700', 'border', 'border-blue-200', 'dark:border-gray-600')
}

function handleDrop(event, newIndex) {
  event.preventDefault()
  const oldIndex = parseInt(event.dataTransfer.getData('text/plain'))

  // Убираем подсветку
  const elements = document.querySelectorAll('li[draggable="true"]')
  elements.forEach(el => {
    el.classList.remove('bg-blue-50', 'dark:bg-gray-700', 'border', 'border-blue-200', 'dark:border-gray-600')
    el.style.opacity = '1'
  })

  if (oldIndex !== newIndex) {
    player.moveInQueue(oldIndex, newIndex)
  }

  draggedItemIndex.value = null
}

function handlePlayClick(track) {
  if (player.currentTrack === track.id) {
    // Если кликаем по текущему треку - toggle play/pause
    player.togglePlay()
  } else {
    // Если по другому треку - начинаем его воспроизведение
    player.playTrack(track)
  }
}

function remove(track) {
  player.dequeue(track)
}

function clearAll() {
  player.clearQueue()
}
</script>

<style scoped>
/* Плавные переходы для drag and drop */
li {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

/* Стиль при перетаскивании */
li[draggable="true"]:active {
  cursor: grabbing;
}

/* Кастомный скроллбар */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-track {
  background: #2d3748;
}
.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}
.bg-green-50 {
  background-color: rgba(240, 253, 244, 0.8);
}
.dark .dark\:bg-green-900\/30 {
  background-color: rgba(20, 83, 45, 0.3);
}
</style>