<template>
  <div ref="container" class="w-full h-full flex flex-col">
    <!-- Current Track Section -->
    <transition name="track-slide" mode="out-in">
      <div v-if="currentTrack" class="mb-4" :key="currentTrack.trackId">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Сейчас играет</h4>
        <div
            class="flex items-center p-2 rounded-lg bg-light-primary/40 dark:bg-dark-primary/50"
            :class="{ 'current-playing': isCurrentPlaying(currentTrack) }"
        >
          <img :src="currentTrack.coverUrl" class="w-10 h-10 rounded mr-3 object-cover bg-gray-100 dark:bg-gray-700" alt="Cover"/>
          <div class="flex-1">
            <p class="text-sm font-medium text-light-text dark:text-dark-text truncate">{{ currentTrack.title }}</p>
            <p class="text-xs text-light-text-muted dark:text-dark-text-muted truncate">{{ currentTrack.author }}</p>
          </div>
          <button @click.stop="handlePlayClick(currentTrack)" class="ml-2 text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200">
            <component :is="isCurrentPlaying(currentTrack) ? PauseIcon : PlayIcon" class="h-5 w-5"/>
          </button>
        </div>
      </div>
    </transition>

    <!-- Queues Container -->
    <div class="flex-1 overflow-y-auto space-y-4">
      <!-- Custom Queue Section -->
      <div v-if="customTracks.length" class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Добавлено мной</h4>
        <draggable
            v-model="customTracks"
            item-key="trackId"
            tag="ul"
            class="space-y-2 queue-list custom-queue"
            animation="300"
            handle=".draggable-item"
            :group="'queue'"
            :key="'custom-tracks'"
        >
          <template #item="{ element: track, index: idx }">
            <li
                class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-move draggable-item"
                :class="{ 'bg-green-100 dark:bg-green-900/50 ring-2 ring-green-400 dark:ring-green-600': isCurrentPlaying(track) }"
            >
              <span class="w-5 text-xs text-gray-500 dark:text-gray-400 mr-1">{{ idx + 1 }}</span>
              <img :src="track.coverUrl" class="w-8 h-8 rounded-full mr-3 object-cover bg-gray-100 dark:bg-gray-700" />
              <div class="flex-1">
                <p class="text-sm text-light-text dark:text-dark-text truncate">{{ track.title }}</p>
                <p class="text-xs text-light-text-muted dark:text-dark-text-muted truncate">{{ track.author }}</p>
              </div>
              <button @click.stop="handlePlayClick(track)" class="text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200">
                <component :is="isCurrentPlaying(track) ? PauseIcon : PlayIcon" class="h-5 w-5"/>
              </button>
            </li>
          </template>
        </draggable>
      </div>

      <!-- Upcoming Queue Section -->
      <div v-if="upcomingTracks.length">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Далее в очереди</h4>
        <draggable
            v-model="upcomingTracks"
            item-key="trackId"
            tag="ul"
            class="space-y-2 queue-list upcoming-queue"
            animation="300"
            handle=".draggable-item"
            :group="'queue'"
            :key="'upcoming-tracks'"
        >
          <template #item="{ element: track, index: idx }">
            <li
                class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-move draggable-item"
                :class="{ 'bg-green-100 dark:bg-green-900/50 ring-2 ring-green-400 dark:ring-green-600': isCurrentPlaying(track) }"
            >
              <span class="w-5 text-xs text-gray-500 dark:text-gray-400 mr-1">{{ idx + 1 }}</span>
              <img :src="track.coverUrl" class="w-8 h-8 rounded-full mr-3 object-cover bg-gray-100 dark:bg-gray-700" />
              <div class="flex-1">
                <p class="text-sm text-light-text dark:text-dark-text truncate">{{ track.title }}</p>
                <p class="text-xs text-light-text-muted dark:text-dark-text-muted truncate">{{ track.author }}</p>
              </div>
              <button @click.stop="handlePlayClick(track)" class="text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200">
                <component :is="isCurrentPlaying(track) ? PauseIcon : PlayIcon" class="h-5 w-5"/>
              </button>
            </li>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Clear Button -->
    <div v-if="queueTracks.length" class="mt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3 sticky bottom-0 bg-inherit">
      <span class="text-sm text-gray-500 dark:text-gray-400">Всего треков: {{ queueTracks.length }}</span>
      <button @click="clearAll" class="px-3 py-1 text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50">
        Очистить все
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, onMounted } from 'vue';
import { usePlayerStore } from '@/store/player';
import { useTrackStore } from '@/store/track';
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline';
import { trackService } from '@/services/trackService';
import draggable from 'vuedraggable';

const player = usePlayerStore();
const trackStore = useTrackStore();
const container = ref(null); // Ref для корневого div

// Кэширование треков для быстрого поиска
const trackMap = computed(() => {
  const map = new Map();
  [
    ...trackStore.userLibrary,
    ...trackStore.topPlays,
    ...trackStore.topLikes,
    ...trackStore.newTracks,
    ...trackStore.searchResults,
  ].forEach((track) => map.set(track.trackId, track));
  return map;
});

const queueTracks = computed(() =>
    player.queueTracks.map((id) => {
      const t = trackMap.value.get(id);
      return t
          ? { ...t, streamUrl: trackService.getStreamUrl(t.trackId) || '' }
          : { trackId: id, title: '…', author: '', coverUrl: '', streamUrl: '' };
    })
);

const currentTrack = computed(() =>
    queueTracks.value.find((t) => t.trackId === player.currentTrackId) || null
);

const customTracks = computed({
  get: () =>
      queueTracks.value
          .filter((t) => player.customQueue.includes(t.trackId))
          .filter((t) => t.trackId !== player.currentTrackId),
  set: (newTracks) => {
    if (!Array.isArray(newTracks) || newTracks.some((track) => !track || !track.trackId)) {
      console.error('Invalid customTracks:', newTracks);
      return;
    }
    const newCustomQueue = newTracks.map((track) => track.trackId);
    const newQueue = [
      ...(player.currentTrackId ? [player.currentTrackId] : []),
      ...newCustomQueue,
      ...player.baseQueue.filter((id) => !newCustomQueue.includes(id)),
    ];
    player.customQueue = newCustomQueue;
    player.queueTracks = newQueue;
  },
});

const upcomingTracks = computed({
  get: () =>
      queueTracks.value.filter(
          (t) =>
              t.trackId !== player.currentTrackId &&
              !player.customQueue.includes(t.trackId)
      ),
  set: (newTracks) => {
    if (!Array.isArray(newTracks) || newTracks.some((track) => !track || !track.trackId)) {
      console.error('Invalid upcomingTracks:', newTracks);
      return;
    }
    const newBaseQueue = newTracks.map((track) => track.trackId);
    const newQueue = [
      ...(player.currentTrackId ? [player.currentTrackId] : []),
      ...player.customQueue,
      ...newBaseQueue,
    ];
    player.baseQueue = newBaseQueue;
    player.queueTracks = newQueue;
  },
});

const isCurrentPlaying = (t) => player.currentTrackId === t.trackId && player.isPlaying;

const handlePlayClick = (track) => {
  if (isCurrentPlaying(track)) {
    player.pause();
  } else {
    player.playTrack(track.trackId);
  }
};

const clearAll = () => {
  player.clearQueue();
};

// Управление классами для динамической высоты
watch(
    () => customTracks.value.length,
    (length) => {
      if (!container.value) {
        console.warn('Контейнер не доступен');
        return;
      }
      try {
        container.value.classList.remove('custom-queue-inactive', 'custom-queue-single', 'custom-queue-active');
        if (length === 0) {
          container.value.classList.add('custom-queue-inactive');
        } else if (length === 1) {
          container.value.classList.add('custom-queue-single');
        } else {
          container.value.classList.add('custom-queue-active');
        }
      } catch (error) {
        console.error('Ошибка при обновлении классов контейнера:', error);
      }
    },
    { immediate: true }
);

// Установка начальных классов после монтирования
onMounted(() => {
  if (container.value) {
    const length = customTracks.value.length;
    container.value.classList.remove('custom-queue-inactive', 'custom-queue-single', 'custom-queue-active');
    if (length === 0) {
      container.value.classList.add('custom-queue-inactive');
    } else if (length === 1) {
      container.value.classList.add('custom-queue-single');
    } else {
      container.value.classList.add('custom-queue-active');
    }
  }
});
</script>

<style scoped>
/* Анимация для текущего трека */
.track-slide-enter-active,
.track-slide-leave-active {
  transition: all 0.5s ease;
}
.track-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.track-slide-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

/* Эффект свечения для текущего трека */
.bg-light-primary\/40 {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
.bg-light-primary\/40.current-playing {
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
}
:where(.dark) .bg-dark-primary\/50 {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
:where(.dark) .bg-dark-primary\/50.current-playing {
  box-shadow: 0 0 10px rgba(20, 184, 166, 0.7) !important; /* Темная тема (#14b8a6) */
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
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
  width: 100%;
}

/* Стили для перетаскивания */
.draggable-item {
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.draggable-item:hover {
  cursor: grab;
}
.draggable-item:active {
  cursor: grabbing;
}

/* Выделение текущего трека в списках */
.draggable-item.bg-green-100,
.draggable-item.dark\:bg-green-900\/50 {
  transition: background-color 0.3s ease, ring 0.3s ease;
}

/* Динамическая высота списков */
.queue-list.upcoming-queue {
  max-height: calc(5 * 48px + 16px); /* 5 треков по умолчанию */
  overflow-y: auto;
}
.queue-list.custom-queue {
  max-height: calc(2 * 48px + 16px); /* 2 трека для кастомной очереди */
  overflow-y: auto;
}
.custom-queue-single .queue-list.upcoming-queue {
  max-height: calc(3 * 48px + 16px); /* 3 трека, если 1 трек в кастомной очереди */
}
.custom-queue-active .queue-list.upcoming-queue {
  max-height: calc(2 * 48px + 16px); /* 2 трека, если 2+ трека в кастомной очереди */
}

/* Стили скроллбара */
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

/* Фон для секции с кнопкой очистки */
.sticky.bottom-0 {
  background: inherit;
}
</style>