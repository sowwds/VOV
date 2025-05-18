<template>
  <div
      class="fixed bottom-20 right-4 w-96 bg-light-surface dark:bg-dark-surface shadow-xl rounded-lg p-4 z-50 border border-gray-200 dark:border-gray-700"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Очередь воспроизведения</h3>
      <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <ul class="space-y-2 max-h-96 overflow-y-auto" ref="queueList">
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
          'bg-light-primary/40 dark:bg-dark-primary/50': isCurrentTrack(track)
        }"
      >
        <!-- Номер трека -->
        <span class="text-xs text-gray-500 dark:text-gray-400 w-5 mr-1">{{ idx + 1 }}</span>

        <!-- Обложка -->
        <img
            v-if="track.coverUrl"
            :src="track.coverUrl"
            class="w-8 h-8 rounded-full object-cover mr-3"
            alt="Cover"
        />
        <div
            v-else
            class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <!-- Информация о треке -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate text-light-text dark:text-dark-text">
            {{ track.title }}
          </p>
          <p class="text-xs truncate text-light-text-muted dark:text-dark-text-muted">
            {{ track.author || 'Неизвестный исполнитель' }}
          </p>
        </div>

        <!-- Кнопки управления -->
        <div class="flex items-center space-x-2 ml-3">
          <button
              @click.stop="handlePlayClick(track)"
              class="p-1.5 text-green-600 hover:text-green-800 dark:hover:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30"
              :title="isCurrentPlaying(track) ? 'Пауза' : 'Воспроизвести'"
          >
            <svg
                v-if="!isCurrentPlaying(track)"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
              @click.stop="toggleAddToLibrary(track.id)"
              class="p-1.5 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
              :title="isTrackInLibrary(track.id) ? 'В коллекции' : 'Добавить в коллекцию'"
          >
            <component
                :is="isTrackInLibrary(track.id) ? HeartSolid : HeartOutline"
                class="h-4 w-4"
            />
          </button>
          <button
              @click.stop="remove(track)"
              class="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
              title="Удалить из очереди"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </li>
      <li
          v-if="!queueTracks.length"
          class="text-center py-4 text-gray-500 dark:text-gray-400"
      >
        Очередь пуста
      </li>
    </ul>

    <div
        v-if="queueTracks.length"
        class="mt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3"
    >
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
import { computed, ref } from 'vue';
import { usePlayerStore } from '@/store/player';
import { useTrackStore } from '@/store/track';
import { trackService } from '@/services/trackService';
import { HeartIcon as HeartOutline } from '@heroicons/vue/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid';

const emit = defineEmits(['close']);
const playerStore = usePlayerStore();
const trackStore = useTrackStore();
const draggedItemIndex = ref(null);

// Список треков в очереди
const queueTracks = computed(() => playerStore.queueTracks);

// Проверка, является ли трек текущим
const isCurrentTrack = (track) => {
  return playerStore.currentTrackId === track.id;
};

// Проверка, играет ли трек
const isCurrentPlaying = (track) => {
  return playerStore.currentTrackId === track.id && playerStore.isPlaying;
};

// Проверка, находится ли трек в коллекции
const isTrackInLibrary = (trackId) => {
  return trackStore.userLibrary.some(t => t.trackId === trackId);
};

// Drag-and-drop
function handleDragStart(event, index) {
  event.dataTransfer.setData('text/plain', index);
  draggedItemIndex.value = index;
  event.currentTarget.style.opacity = '0.4';
}

function handleDragOver(event, index) {
  event.preventDefault();
  const targetElement = event.currentTarget;
  targetElement.classList.add(
      'bg-blue-50',
      'dark:bg-gray-700',
      'border',
      'border-blue-200',
      'dark:border-gray-600'
  );
}

function handleDrop(event, newIndex) {
  event.preventDefault();
  const oldIndex = parseInt(event.dataTransfer.getData('text/plain'));
  const elements = document.querySelectorAll('li[draggable="true"]');
  elements.forEach(el => {
    el.classList.remove(
        'bg-blue-50',
        'dark:bg-gray-700',
        'border',
        'border-blue-200',
        'dark:border-gray-600'
    );
    el.style.opacity = '1';
  });

  if (oldIndex !== newIndex) {
    playerStore.moveInQueue(oldIndex, newIndex);
  }

  draggedItemIndex.value = null;
}

// Воспроизведение/пауза
function handlePlayClick(track) {
  if (playerStore.currentTrackId === track.id) {
    playerStore.togglePlay();
  } else {
    playerStore.playTrack(track.id);
  }
}

// Добавление в коллекцию
async function toggleAddToLibrary(trackId) {
  await trackStore.addToLibrary(trackId);
}

// Удаление из очереди
function remove(track) {
  playerStore.dequeue(track.id);
}

// Очистка очереди
function clearAll() {
  playerStore.clearQueue();
}
</script>

<style scoped>
li {
  transition: background-color 0.2s ease, transform 0.2s ease;
}
li[draggable="true"]:active {
  cursor: grabbing;
}
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