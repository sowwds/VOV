<template>
  <div
      class="fixed bottom-20 right-4 w-96 bg-light-surface dark:bg-dark-surface shadow-xl rounded-lg p-4 z-50 border border-gray-200 dark:border-gray-700"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Очередь воспроизведения</h3>
      <button @click="clearAndClose" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Секция: Текущий трек -->
    <transition name="track-slide" mode="out-in">
      <div v-if="currentTrack" class="mb-4" :key="currentTrack.trackId">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Сейчас играет</h4>
        <div
            class="flex items-center p-2 rounded-lg bg-light-primary/40 dark:bg-dark-primary/50"
        >
          <img :src="currentTrack.coverUrl" class="w-10 h-10 rounded mr-3 object-cover" alt="Cover"/>
          <div class="flex-1">
            <p class="text-sm font-medium text-light-text dark:text-dark-text truncate">{{ currentTrack.title }}</p>
            <p class="text-xs text-light-text-muted dark:text-dark-text-muted truncate">{{ currentTrack.author }}</p>
          </div>
          <button @click.stop="handlePlayClick(currentTrack)" class="ml-2 text-green-600 hover:text-green-800">
            <component :is="isCurrentPlaying(currentTrack) ? PauseIcon : PlayIcon" class="h-5 w-5"/>
          </button>
        </div>
      </div>
    </transition>

    <!-- Секция: Пользовательская очередь -->
    <div v-if="customTracks.length" class="mb-4">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Добавлено мной</h4>
      <transition-group name="list" tag="ul" class="space-y-2 mb-4">
        <li
            v-for="track in customTracks"
            :key="track.trackId"
            class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span class="w-5 text-xs text-gray-500 dark:text-gray-400 mr-1">{{ customIndex(track) + 1 }}</span>
          <img :src="track.coverUrl" class="w-8 h-8 rounded-full mr-3 object-cover" />
          <div class="flex-1">
            <p class="text-sm text-light-text dark:text-dark-text truncate">{{ track.title }}</p>
            <p class="text-xs text-light-text-muted dark:text-dark-text-muted truncate">{{ track.author }}</p>
          </div>
          <button @click.stop="handlePlayClick(track)" class="text-green-600 hover:text-green-800">
            <component :is="isCurrentPlaying(track) ? PauseIcon : PlayIcon" class="h-5 w-5"/>
          </button>
        </li>
      </transition-group>
    </div>

    <!-- Секция: Остальная очередь -->
    <div v-if="upcomingTracks.length">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Далее в очереди</h4>
      <transition-group
          name="list"
          tag="ul"
          class="space-y-2 max-h-64 overflow-y-auto"
      >
        <li
            v-for="(track, idx) in upcomingTracks"
            :key="track.trackId"
            draggable="true"
            @dragstart="handleDragStart($event, idx)"
            @dragover.prevent="handleDragOver($event, idx)"
            @drop="handleDrop($event, idx)"
            @dragenter.prevent
            class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-move"
        >
          <span class="w-5 text-xs text-gray-500 dark:text-gray-400 mr-1">{{ idx + 1 }}</span>
          <img :src="track.coverUrl" class="w-8 h-8 rounded-full mr-3 object-cover" />
          <div class="flex-1">
            <p class="text-sm text-light-text dark:text-dark-text truncate">{{ track.title }}</p>
            <p class="text-xs text-light-text-muted dark:text-dark-text-muted truncate">{{ track.author }}</p>
          </div>
          <button @click.stop="handlePlayClick(track)" class="text-green-600 hover:text-green-800">
            <component :is="isCurrentPlaying(track) ? PauseIcon : PlayIcon" class="h-5 w-5"/>
          </button>
        </li>
      </transition-group>
    </div>

    <!-- Кнопка очистить -->
    <div v-if="queueTracks.length" class="mt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
      <span class="text-sm text-gray-500 dark:text-gray-400">Всего треков: {{ queueTracks.length }}</span>
      <button @click="clearAll" class="px-3 py-1 text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50">
        Очистить все
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch, onMounted, onBeforeUnmount} from 'vue';
import { usePlayerStore } from '@/store/player';
import { useTrackStore } from '@/store/track';
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline';
import { trackService } from '@/services/trackService';

const emit = defineEmits(['close']);
const player = usePlayerStore();
const trackStore = useTrackStore();

const queueTracks = computed(() =>
    player.queueTracks.map(id => {
      const t = [
        ...trackStore.userLibrary,
        ...trackStore.topPlays,
        ...trackStore.topLikes,
        ...trackStore.newTracks,
        ...trackStore.searchResults
      ].find(x => x.trackId === id);
      return t
          ? { ...t, streamUrl: trackService.getStreamUrl(t.trackId) }
          : { trackId: id, title: '…', author: '', coverUrl: '', streamUrl: trackService.getStreamUrl(id) };
    })
);

const currentTrack = computed(() =>
    queueTracks.value.find(t => t.trackId === player.currentTrackId) || null
);

const customTracks = computed(() =>
    queueTracks.value.filter(t => player.customQueue.includes(t.trackId))
        .filter(t => t.trackId !== player.currentTrackId)
);

const upcomingTracks = computed(() =>
    queueTracks.value.filter(t =>
        t.trackId !== player.currentTrackId && !player.customQueue.includes(t.trackId)
    )
);

const isCurrentPlaying = (t) => player.currentTrackId === t.trackId && player.isPlaying;
const handlePlayClick = (t) => {
  player.playTrack(t.trackId);
};
const clearAll = () => {
  player.clearQueue();
};
// объединённый метод
function clearAndClose() {
  clearAll();
  emit('close');
}
const customIndex = (t) => customTracks.value.findIndex(x => x.trackId === t.trackId);

function handleDragStart(e, idx) {
  e.dataTransfer.setData('text/plain', idx);
}
function handleDragOver(e, idx) {
  e.preventDefault();
}
function handleDrop(e, idx) {
  e.preventDefault();
  const fromIndex = e.dataTransfer.getData('text/plain');
  player.moveInQueue(parseInt(fromIndex), idx);
}




</script>

<style scoped>
/* Анимация для текущего трека */
.track-slide-enter-active,
.track-slide-leave-active {
  transition: all 0.3s ease;
}
.track-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.track-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Анимация для списков */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.list-leave-active {
  position: absolute;
}

/* Остальные стили */
li {
  transition: background-color 0.2s, transform 0.2s;
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
</style>