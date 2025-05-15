<template>
  <div
      class="bg-light-surface dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border py-4 px-6 flex flex-wrap items-center justify-between h-20
         gap-y-2 md:gap-y-0"
  >
    <!-- ЛЕВАЯ СЕКЦИЯ: обложка + название + автор -->
    <div class="flex items-center space-x-3 w-1/4 min-w-[200px]">
      <img
          :src="currentAvatar"
          alt="Cover"
          class="w-12 h-12 object-cover rounded bg-gray-100 dark:bg-gray-700"
      />
      <div class="flex flex-col truncate">
        <p class="text-sm font-semibold text-light-text dark:text-dark-text truncate">
          {{ trackTitle }}
        </p>
        <p class="text-xs text-light-text-muted dark:text-dark-text-muted truncate">
          {{ artistName }}
        </p>
      </div>
      <!-- Лайк -->
      <button
          @click="toggleLike"
          class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <component :is="isLiked ? HeartSolid : HeartOutline" class="w-5 h-5" />
      </button>

      <button
        class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
        >
        <InformationCircleIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- ЦЕНТРАЛЬНАЯ СЕКЦИЯ: управление воспроизведением + прогресс -->
    <div class="flex flex-col items-center flex-1">
      <div class="flex items-center space-x-4">
        <!-- Shuffle -->
        <button
            @click="toggleShuffle"
            :class="shuffleActive ? 'text-light-primary dark:text-dark-primary' : 'text-light-text dark:text-dark-text'"
            class="p-2 rounded hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 bi bi-shuffle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"/>
            <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/>
          </svg>
        </button>

        <!-- Назад -->
        <button
            @click="prevTrack"
            class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <ChevronLeftIcon class="w-6 h-6" />
        </button>

        <!-- Play / Pause -->
        <button
            @click="togglePlay"
            class="p-2 rounded-full bg-light-primary dark:bg-dark-primary text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-6 h-6"
          :class="{'icon-offset': !isPlaying }"
          />
        </button>

        <!-- Вперёд -->
        <button
            @click="nextTrack"
            class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <ChevronRightIcon class="w-6 h-6" />
        </button>

        <!-- Loop: трек -->
        <button
            @click="toggleLoopMode"
            :class="loopClass"
            class="p-2 rounded hover:scale-110 active:scale-95 transition-transform duration-200"
            title="Режим повтора"
        >
          <div class="relative w-6 h-6">
            <ArrowPathRoundedSquareIcon class="w-full h-full" />
            <span
                v-if="loopMode === 'one'"
                class="absolute bottom-0 right-0 bg-light-primary dark:bg-dark-primary
               text-white text-[10px] font-bold rounded-full w-3 h-3
               flex items-center justify-center"
            >1</span>
          </div>
        </button>

      </div>

      <!-- Прогресс-бар -->
      <div class="flex items-center space-x-2 w-full max-w-2xl mt-1">
        <span class="text-xs text-light-text dark:text-dark-text">{{ formatTime(currentTime) }}</span>
        <input
            type="range"
            min="0"
            :max="duration"
            v-model.number="currentTime"
            @input="seek"
            class="flex-1 progress-bar-time"
            :style="{'--progress': `${(currentTime / duration) * 100}%`}"
        />
        <span class="text-xs text-light-text dark:text-dark-text">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- ПРАВАЯ СЕКЦИЯ: доп. функции + громкость -->
    <div class="flex items-center space-x-4 w-1/4 justify-end min-w-[200px] relative ">
      <!-- Speech to text -->
      <button
          @click="onSpeechToText"
          class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <MicrophoneIcon class="w-5 h-5" />
      </button>

      <!-- Переключатель версии -->
      <button
          @click="toggleVersion"
          class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
      >

        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-light-primary dark:text-dark-primary hover:scale-110 active:scale-95">
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"></circle>
          <path d="M7.40381 16.5967C4.8654 14.0583 4.8654 9.94271 7.40381 7.4043M16.5962 7.4043C17.6103 8.41836 18.2192 9.68413 18.4231 11.0005M16.5962 16.5967C17.0785 16.1144 17.4692 15.5751 17.7682 15.0005" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
          <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
        </svg>
      </button>

      <button @click="toggleQueue" class="p-2 rounded …">
        <QueueListIcon class="w-5 h-5 text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"/>
      </button>
      <QueuePopOver v-if="showQueue" @close="showQueue = false" />

      <!-- Mute -->
      <button
          @click="toggleMute"
          class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <component :is="isMuted ? SpeakerXMarkIcon : SpeakerWaveIcon" class="w-5 h-5" />
      </button>

      <!-- Громкость -->
      <div class="flex items-center space-x-2">
        <div class="relative w-20 h-6 flex items-center">
          <!-- Ползунок громкости -->
          <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="volume"
              @input="updateVolume"
              @mouseenter="showVolumeHint = true"
              @mouseleave="showVolumeHint = false"
              @touchstart="showVolumeHint = true"
              @touchend="setTimeout(() => showVolumeHint = false, 1000)"
              class="w-full h-full progress-bar-volume"
              :style="{'--progress': `${volume * 100}%`}"
          />

          <!-- Подсказка с процентом -->
          <transition name="fade">
      <span
          v-if="showVolumeHint"
          class="absolute text-xs text-light-primary dark:text-dark-primary bg-light-surface dark:bg-dark-surface px-1 rounded shadow-sm whitespace-nowrap"
          :style="{
          left: `calc(${volume * 100}% + 0.375rem - 0.75rem * ${volume})`,
          transform: 'translateX(-50%)',
          top: '-1rem'
        }"
      >
        {{ Math.round(volume * 100) }}%
      </span>
          </transition>
        </div>
      </div>

      <!-- Оконный режим -->
      <button
          @click="toggleFloatMode"
          class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <ArrowsPointingOutIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import QueuePopOver from "@/components/Music/QueuePopOver.vue";
import { ref, watch, computed } from 'vue';
import { usePlayerStore } from '@/store/player.js';
import {
  HeartIcon as HeartOutline,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathRoundedSquareIcon,
  MicrophoneIcon,
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  QueueListIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid';

// Хранилище Pinia
const playerStore = usePlayerStore();

// Данные трека из Pinia
const currentAvatar = computed(() => playerStore.currentTrackObj?.avatarUrl);
const trackTitle = computed(() => playerStore.currentTrackObj?.title || 'Трек');
const artistName = computed(() => playerStore.currentTrackObj?.artist || 'Исполнитель');
const isPlaying = computed(() => playerStore.isPlaying);

// Состояние плеера
const isLiked = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const audio = ref(null);
const volume = ref(0.5);
const isMuted = ref(false);

const loopMode = computed(() => playerStore.loopMode)
const shuffleActive = computed(() => playerStore.shuffleActive)

const showVolumeHint = ref(false);


const toggleLoopMode = () => playerStore.toggleLoopMode()
const nextTrack = () => playerStore.nextTrack()
const prevTrack = () => playerStore.prevTrack()
const toggleShuffle = () => playerStore.toggleShuffle()
const showQueue = ref(false)
function toggleQueue() { showQueue.value = !showQueue.value }

// Инициализация Audio при смене трека
watch(
    () => playerStore.currentTrackObj,
    (newTrackObj) => {
      if (newTrackObj?.file) {
        if (audio.value) {
          audio.value.pause()
          audio.value = null
        }
        audio.value = new Audio(URL.createObjectURL(newTrackObj.file))
        audio.value.volume = isMuted.value ? 0 : volume.value

        audio.value.onloadedmetadata = () => {
          duration.value = audio.value.duration || 240
          currentTime.value = 0
        }

        audio.value.ontimeupdate = () => {
          currentTime.value = audio.value.currentTime
        }

        audio.value.onended = () => {
          if (playerStore.loopMode === 'one') {
            // Повтор текущего трека
            audio.value.currentTime = 0
            audio.value.play()
          } else {
            // Переход к следующему треку (учитывает режим зацикливания очереди)
            playerStore.nextTrack()
          }
        }

        if (playerStore.isPlaying) {
          audio.value.play()
        }
      }
    }
);

// Синхронизация воспроизведения
watch(
    () => playerStore.isPlaying,
    (playing) => {
      if (audio.value) {
        if (playing) {
          audio.value.play();
        } else {
          audio.value.pause();
        }
      }
    }
);

// Методы
function togglePlay() {
  playerStore.togglePlay();
}

function toggleLike() {
  isLiked.value = !isLiked.value;
  if (playerStore.currentTrack) {
    playerStore.currentTrack.isLiked = isLiked.value;
  }
}

const loopClass = computed(() => {
  return loopMode.value === 'none'
      ? 'text-light-text dark:text-dark-text'
      : 'text-light-primary dark:text-dark-primary'
})


function onSpeechToText() {
  console.log('Speech to text');
}

function toggleVersion() {
  console.log('Toggle version');
}

function toggleFloatMode() {
  console.log('Toggle float mode');
}

function seek() {
  if (audio.value) {
    audio.value.currentTime = currentTime.value;
  }
}

function updateVolume() {
  if (audio.value) {
    audio.value.volume = volume.value;
    // Если громкость больше 0 - выключаем мут
    if (volume.value > 0 && isMuted.value) {
      isMuted.value = false;
    }
    // Если громкость 0 - включаем мут
    if (volume.value === 0 && !isMuted.value) {
      isMuted.value = true;
    }
  }
}

function toggleMute() {
  if (audio.value) {
    isMuted.value = !isMuted.value;
    audio.value.volume = isMuted.value ? 0 : volume.value;
    // Сохраняем volume при выключении мута
    if (!isMuted.value && volume.value === 0) {
      volume.value = 0.5; // или любое другое значение по умолчанию
    }
  }
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(Math.floor(sec % 60)).padStart(2, '0');
  return `${m}:${s}`;
}
</script>

<style scoped>
:root {
  --progress: 0%;
  --thumb-position: 0%;
}
input[type="range"] {
  appearance: none;
  border-radius: 9999px;
  height: 0.25rem;
  background-color: #d1d5db;
  background-image: linear-gradient(to right, #6366f1 var(--progress, 0%), transparent 0);
  background-repeat: no-repeat;
}

.dark input[type="range"] {
  background-color: #4b5563;
  background-image: linear-gradient(to right, #8b5cf6 var(--progress, 0%), transparent 0);
}

/* Webkit (Chrome, Safari) */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  border-radius: 9999px;
  height: 0.75rem;
  width: 0.75rem;
  background-color: #6366f1;
  cursor: pointer;
  position: relative;
}

.dark input[type="range"]::-webkit-slider-thumb {
  background-color: #8b5cf6;
}

/* Firefox */
input[type="range"]::-moz-range-thumb {
  border-radius: 9999px;
  height: 0.75rem;
  width: 0.75rem;
  background-color: #6366f1;
  cursor: pointer;
  border: none;
}

.dark input[type="range"]::-moz-range-thumb {
  background-color: #8b5cf6;
}

/* Для Firefox - альтернативный способ закрашивания */
input[type="range"]::-moz-range-progress {
  background-color: #6366f1;
  border-radius: 9999px;
  height: 0.25rem;
}

.dark input[type="range"]::-moz-range-progress {
  background-color: #8b5cf6;
}

.progress-bar-volume {
  appearance: none;
  height: 0.25rem;
  background-color: #d1d5db;
  background-image: linear-gradient(to right, #6366f1 var(--progress), transparent 0);
  border-radius: 9999px;
}

.dark .progress-bar-volume {
  background-color: #4b5563;
  background-image: linear-gradient(to right, #8b5cf6 var(--progress), transparent 0);
}

.progress-bar-volume::-webkit-slider-thumb {
  appearance: none;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background-color: #6366f1;
  cursor: pointer;
}

.dark .progress-bar-volume::-webkit-slider-thumb {
  background-color: #8b5cf6;
}

/* Анимация подсказки */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(2px) translateX(-50%);
}
.icon-offset {
  transform: translateX(1px);
}
</style>