<!-- src/components/TrackRow.vue -->
<template>
    <div
        class="flex items-center p-2 bg-light-surface dark:bg-dark-surface rounded hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 cursor-pointer"
    >
      <!-- Обложка -->
      <div class="relative w-16 h-16 mr-4">
        <img
            :src="track.coverUrl || defaultCover"
            :alt="track.title"
            class="w-full h-full object-cover rounded"
        />
        <div
            class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity"
        >
          <button @click.stop="onPlay" class="p-1 hover:scale-110 text-white transition-transform duration-200">
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
        <button @click.stop="onToggleLibrary" class="text-light-text dark:text-dark-text">
          <HeartIcon :class="['w-5 h-5', isInLibrary ? 'dark:text-dark-primary text-light-primary fill-current' : '']" />
        </button>

        <button @click.stop="onAddToQueue" class="text-light-text dark:text-dark-text">
          <QueueListIcon class="w-5 h-5" />
        </button>
        <button @click.stop="onAddNext" class="text-light-text dark:text-dark-text">
          <ArrowRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </template>

  <script setup>
  import { computed } from 'vue';
  import { usePlayerStore } from '@/store/player';
  import { useTrackStore } from '@/store/track';
  import {
    PlayIcon,
    PauseIcon,
    HeartIcon,
    QueueListIcon,
    ArrowRightIcon,
  } from '@heroicons/vue/24/outline';

  // Props
  const { track, section } = defineProps({
    track:   { type: Object, required: true },
    section: { type: String, default: 'userLibrary' }
  });

  const emit = defineEmits([
    'play-track',
    'toggle-play',
    'add-to-queue',
    'add-next',
    'add-to-library',
    'remove-from-library',
  ]);

  // Player
  const playerStore = usePlayerStore();

  // Track Store
  const trackStore = useTrackStore();

  // Computed: Check if track is in library
  const isInLibrary = computed(() => trackStore.userLibrary.some(t => t.trackId === track.trackId));

  // Player flags
  const isCurrent = computed(() => playerStore.currentTrackId === track.trackId);
  const isPlaying = computed(() => playerStore.isPlaying && isCurrent.value);

  // Default cover
  const defaultCover = 'https://via.placeholder.com/48';

  // Methods
  function onPlay() {
    if (isCurrent.value) {
      emit('toggle-play');
    } else {
      emit('play-track', track.trackId, section);
    }
  }

  function onAddToQueue() {
    emit('add-to-queue', track.trackId);
  }

  function onAddNext() {
    emit('add-next', track.trackId);
  }

  function onToggleLibrary() {
    if (isInLibrary.value) {
      emit('remove-from-library', track.trackId);
    } else {
      emit('add-to-library', track.trackId);
    }
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
