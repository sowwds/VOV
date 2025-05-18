<template>
    <div
      class="flex items-center p-2 bg-light-surface dark:bg-dark-surface rounded hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 cursor-pointer"
      @click="playTrack"
    >
      <!-- Обложка с оверлеем -->
      <div class="relative w-16 h-16 mr-4">
        <img :src="avatarUrl" :alt="track.title" class="w-full h-full object-cover rounded" />
        <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
          <button @click.stop="playTrack" class="text-white">
            <PlayIcon class="w-8 h-8" />
          </button>
        </div>
      </div>

      <!-- Название и артист -->
      <div class="flex-1">
        <h4 class="text-light-text dark:text-dark-text">{{ track.title }}</h4>
        <p class="text-light-text-muted dark:text-dark-text-muted">{{ track.artist }}</p>
      </div>

      <!-- Кнопки управления -->
      <div class="flex space-x-2">
        <button @click.stop="toggleLike" class="text-light-text dark:text-dark-text">
          <HeartIcon class="w-5 h-5" :class="{ 'text-red-500': isLiked }" />
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
  import { getTrackAvatar } from '@/services/avatarService.js';
  import { PlayIcon, HeartIcon, QueueListIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

  const props = defineProps({
    track: { type: Object, required: true },
  });

  const player = usePlayerStore();
  const isLiked = ref(false); // Мок-состояние для лайков

  const avatarUrl = computed(() => getTrackAvatar(props.track));

  function playTrack() {
    player.playTrack(props.track);
  }

  function toggleLike() {
    isLiked.value = !isLiked.value;
    // В будущем: вызов API для лайка/анлайка
  }

  function addToQueue() {
    player.enqueue(props.track);
  }

  function addNext() {
    player.enqueueNext(props.track);
  }
  </script>

  <style scoped>
  /* Дополнительные стили, если нужны */
  </style>
