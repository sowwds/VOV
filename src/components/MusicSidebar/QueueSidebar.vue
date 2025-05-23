<template>
  <div class="w-full h-full flex flex-col">
    <!-- ─── «Сейчас играет» ─────────────────────────────────────── -->
    <transition name="track-slide" mode="out-in">
      <div v-if="currentTrack" :key="currentTrack.trackId" class="mb-4 shrink-0">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Сейчас играет
        </h4>
        <div
            class="flex items-center p-2 rounded-lg bg-light-primary/40 dark:bg-dark-primary/50"
            :class="{ 'current-playing': isCurrentPlaying(currentTrack) }"
        >
          <img
              :src="currentTrack.coverUrl"
              class="w-10 h-10 mr-3 rounded object-cover bg-gray-100 dark:bg-gray-700"
              alt="Cover"
          />
          <div class="flex-1">
            <p
                class="text-sm font-medium truncate text-light-text dark:text-dark-text"
            >
              {{ currentTrack.title }}
            </p>
            <p
                class="text-xs truncate text-light-text-muted dark:text-dark-text-muted"
            >
              {{ currentTrack.author }}
            </p>
          </div>
          <button
              @click.stop="handlePlayClick(currentTrack)"
              class="ml-2 text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
          >
            <component
                :is="isCurrentPlaying(currentTrack) ? PauseIcon : PlayIcon"
                class="h-5 w-5"
            />
          </button>
        </div>
      </div>
    </transition>

    <!-- ─── Блок очередей (заполняет всё свободное пространство с прокруткой) ─── -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <!-- Custom Queue: auto-размер по контенту -->
      <div v-if="customTracks.length" class="flex flex-col mb-4">
        <h4 class="shrink-0 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Добавлено мной
        </h4>
        <draggable
            v-model="customTracks"
            item-key="trackId"
            tag="ul"
            class="min-h-0"
            animation="300"
            handle=".draggable-item"
            :group="'queue'"
            :key="'custom-tracks'"
        >
          <template #item="{ element: track, index: idx }">
            <li
                class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-move draggable-item"
                :class="{
                'bg-green-100 dark:bg-green-900/50 ring-2 ring-green-400 dark:ring-green-600':
                  isCurrentPlaying(track),
              }"
            >
              <span class="w-5 mr-1 text-xs text-gray-500 dark:text-gray-400">
                {{ idx + 1 }}
              </span>
              <img
                  :src="track.coverUrl"
                  class="w-8 h-8 mr-3 rounded-full object-cover bg-gray-100 dark:bg-gray-700"
              />
              <div class="flex-1">
                <p class="truncate text-sm text-light-text dark:text-dark-text">
                  {{ track.title }}
                </p>
                <p class="truncate text-xs text-light-text-muted dark:text-dark-text-muted">
                  {{ track.author }}
                </p>
              </div>
              <button
                  @click.stop="handlePlayClick(track)"
                  class="text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
              >
                <component
                    :is="isCurrentPlaying(track) ? PauseIcon : PlayIcon"
                    class="h-5 w-5"
                />
              </button>
            </li>
          </template>
        </draggable>
      </div>

      <!-- Upcoming Queue: auto-размер по контенту -->
      <div v-if="upcomingTracks.length" class="flex flex-col">
        <h4 class="shrink-0 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Далее в очереди
        </h4>
        <draggable
            v-model="upcomingTracks"
            item-key="trackId"
            tag="ul"
            class="min-h-0"
            animation="300"
            handle=".draggable-item"
            :group="'queue'"
            :key="'upcoming-tracks'"
        >
          <template #item="{ element: track, index: idx }">
            <li
                class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-move draggable-item"
                :class="{
                'bg-green-100 dark:bg-green-900/50 ring-2 ring-green-400 dark:ring-green-600':
                  isCurrentPlaying(track),
              }"
            >
              <span class="w-5 mr-1 text-xs text-gray-500 dark:text-gray-400">
                {{ idx + 1 }}
              </span>
              <img
                  :src="track.coverUrl"
                  class="w-8 h-8 mr-3 rounded-full object-cover bg-gray-100 dark:bg-gray-700"
              />
              <div class="flex-1">
                <p class="truncate text-sm text-light-text dark:text-dark-text">
                  {{ track.title }}
                </p>
                <p class="truncate text-xs text-light-text-muted dark:text-dark-text-muted">
                  {{ track.author }}
                </p>
              </div>
              <button
                  @click.stop="handlePlayClick(track)"
                  class="text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
              >
                <component
                    :is="isCurrentPlaying(track) ? PauseIcon : PlayIcon"
                    class="h-5 w-5"
                />
              </button>
            </li>
          </template>
        </draggable>
      </div>
    </div>

    <!-- ─── Кнопка «Очистить все» всегда прижатая к низу ─────── -->
    <div
        v-if="queueTracks.length"
        class="shrink-0 sticky bottom-0 z-10 border-t border-gray-200 dark:border-gray-700 pt-3 bg-light-surface dark:bg-dark-surface"
    >
      <div class="flex justify-between items-center">
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
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePlayerStore } from '@/store/player.js';
import { useTrackStore } from '@/store/track.js';
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline';
import { trackService } from '@/services/trackService.js';
import draggable from 'vuedraggable';

const player = usePlayerStore();
const trackStore = useTrackStore();

const trackMap = computed(() => {
  const m = new Map();
  [
    ...trackStore.userLibrary,
    ...trackStore.topPlays,
    ...trackStore.topLikes,
    ...trackStore.newTracks,
    ...trackStore.searchResults,
  ].forEach((t) => m.set(t.trackId, t));
  return m;
});

const queueTracks = computed(() =>
    player.queueTracks.map((id) => {
      const t = trackMap.value.get(id);
      return t
          ? { ...t, streamUrl: trackService.getStreamUrl(id) || '' }
          : { trackId: id, title: '…', author: '', coverUrl: '', streamUrl: '' };
    }),
);

const currentTrack = computed(
    () => queueTracks.value.find((t) => t.trackId === player.currentTrackId) || null
);

const customTracks = computed({
  get: () =>
      queueTracks.value
          .filter((t) => player.customQueue.includes(t.trackId))
          .filter((t) => t.trackId !== player.currentTrackId),
  set(tracks) {
    if (!Array.isArray(tracks)) return;
    const ids = tracks.map((t) => t.trackId);
    player.customQueue = ids;
    player.queueTracks = [
      ...(player.currentTrackId ? [player.currentTrackId] : []),
      ...ids,
      ...player.baseQueue.filter((id) => !ids.includes(id)),
    ];
  },
});

const upcomingTracks = computed({
  get: () =>
      queueTracks.value.filter(
          (t) =>
              t.trackId !== player.currentTrackId &&
              !player.customQueue.includes(t.trackId)
      ),
  set(tracks) {
    if (!Array.isArray(tracks)) return;
    const ids = tracks.map((t) => t.trackId);
    player.baseQueue = ids;
    player.queueTracks = [
      ...(player.currentTrackId ? [player.currentTrackId] : []),
      ...player.customQueue,
      ...ids,
    ];
  },
});

const isCurrentPlaying = (t) =>
    player.currentTrackId === t.trackId && player.isPlaying;
const handlePlayClick = (t) =>
    isCurrentPlaying(t) ? player.pause() : player.playTrack(t.trackId);
const clearAll = () => player.clearQueue();
</script>

<style scoped>
/* Анимации для «Сейчас играет» */
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

/* Подсветка текущего трека */
.bg-light-primary\/40,
:where(.dark) .bg-dark-primary\/50 {
  transition: background-color 0.3s, box-shadow 0.3s;
}
.bg-light-primary\/40.current-playing {
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
}
:where(.dark) .bg-dark-primary\/50.current-playing {
  box-shadow: 0 0 10px rgba(20, 184, 166, 0.7) !important;
}

/* Переходы для перемещения в списках */
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

/* Дрэг-айтем */
.draggable-item {
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.draggable-item:hover {
  cursor: grab;
}
.draggable-item:active {
  cursor: grabbing;
}

/* Скроллбары */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-track {
  background: #26272c
}
.dark ::-webkit-scrollbar-thumb {
  background: #3a3d46;
}

/* Ensure the container takes full viewport height */
:where(.dark) .bg-inherit {
  background-color: #1a202c; /* Match dark mode background */
}

/* Ensure queue container doesn't overflow */
.queue-container {
  flex: 1 1 auto;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}
.dark .queue-container {
  scrollbar-color: #26272c #26272c;
}
.queue-container::-webkit-scrollbar {
  width: 6px;
}
.queue-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.queue-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.dark .queue-container::-webkit-scrollbar-track {
  background: #26272c;
}
.dark .queue-container::-webkit-scrollbar-thumb {
  background: #3a3d46;
}
</style>