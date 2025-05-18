<template>
  <div
      class="flex items-center p-2 bg-light-surface dark:bg-dark-surface rounded hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 cursor-pointer"
      @click="playTrack"
  >
    <!-- Обложка с оверлеем -->
    <div class="relative w-16 h-16 mr-4">
      <img
          :src="track.coverUrl || defaultCover"
          :alt="track.title || 'Трек'"
          class="w-full h-full object-cover rounded"
      />
      <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
        <button @click.stop="playTrack" class="text-white">
          <PlayIcon class="w-8 h-8" />
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
      <button @click.stop="$emit('add-to-library', track.trackId)" class="text-light-text dark:text-dark-text">
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
import { ref, computed } from 'vue';
import { usePlayerStore } from '@/store/player';
import { useTrackStore } from '@/store/track';
import { PlayIcon, HeartIcon, QueueListIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

defineProps({ track: { type: Object, required: true } });
defineEmits(['add-to-library']);

const player = usePlayerStore();
const trackStore = useTrackStore();

// Проверка, находится ли трек в коллекции
const isInLibrary = computed(() => {
  return trackStore.userLibrary.some(t => t.trackId === track.trackId);
});

// Заглушка для обложки
const defaultCover = 'https://via.placeholder.com/48';

function playTrack() {
  player.playTrack(track.trackId);
}

function addToQueue() {
  player.enqueue(track.trackId);
}

function addNext() {
  player.enqueueNext(track.trackId);
}
</script>

<style scoped>
.text-light-text-muted {
  font-size: 0.75rem; /* Меньший шрифт для автора */
  color: #6b7280; /* Muted цвет для светлой темы */
}
.dark .text-dark-text-muted {
  color: #9ca3af; /* Muted цвет для тёмной темы */
}
</style>