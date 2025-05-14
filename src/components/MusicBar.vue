<template>
  <div
      class="bg-light-surface dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border py-4 px-6 flex items-center justify-between h-20"
  >
    <!-- ЛЕВАЯ СЕКЦИЯ: обложка + название + автор -->
    <div class="flex items-center space-x-3 w-1/4 min-w-[200px]">
      <img
          :src="coverUrl"
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
          <ArrowsRightLeftIcon class="w-6 h-6" />
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
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-6 h-6" />
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
            @click="cycleLoopMode"
            :class="loopClass"
            class="p-2 rounded hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <!-- контейнер размером под иконку -->
          <div class="relative w-6 h-6">
            <!-- сама иконка -->
            <ArrowPathRoundedSquareIcon class="w-full h-full" />

            <!-- бейдж «1» строго в углу -->
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
      <div class="flex items-center space-x-2 w-full max-w-2xl mt-2">
        <span class="text-xs text-light-text dark:text-dark-text">{{ formatTime(currentTime) }}</span>
        <input
            type="range"
            min="0"
            :max="duration"
            v-model.number="currentTime"
            @input="seek"
            class="flex-1"
        />
        <span class="text-xs text-light-text dark:text-dark-text">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- ПРАВАЯ СЕКЦИЯ: доп. функции + громкость -->
    <div class="flex items-center space-x-4 w-1/4 justify-end min-w-[200px]">
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
        <ArrowsUpDownIcon class="w-5 h-5" />
      </button>

      <!-- Лайк -->
      <button
          @click="toggleLike"
          class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <component :is="isLiked ? HeartSolid : HeartOutline" class="w-5 h-5" />
      </button>

      <!-- Mute -->
      <button
          @click="toggleMute"
          class="p-2 rounded text-light-text dark:text-dark-text hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <component :is="isMuted ? SpeakerXMarkIcon : SpeakerWaveIcon" class="w-5 h-5" />
      </button>

      <!-- Громкость -->
      <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model.number="volume"
          @input="updateVolume"
          class="w-20"
      />

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
import { ref, watch, computed } from 'vue';
import { usePlayerStore } from '@/store/player';
import {
  HeartIcon as HeartOutline,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowsRightLeftIcon,
  ArrowPathRoundedSquareIcon,
  MicrophoneIcon,
  ArrowsUpDownIcon,
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/vue/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid';

// Хранилище Pinia
const playerStore = usePlayerStore();

// Данные трека из Pinia
const coverUrl = computed(() => playerStore.currentTrack?.imageUrl || 'https://via.placeholder.com/150');
const trackTitle = computed(() => playerStore.currentTrack?.title || 'Трек');
const artistName = computed(() => playerStore.currentTrack?.artist || 'Исполнитель');
const isPlaying = computed(() => playerStore.isPlaying);

// Состояние плеера
const isLiked = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const audio = ref(null);
const volume = ref(1);
const isMuted = ref(false);
const shuffleActive = ref(false);
const loopOne = ref(false);
const loopAll = ref(false);

// Инициализация Audio при смене трека
watch(
    () => playerStore.currentTrack,
    (newTrack) => {
      if (newTrack?.file) {
        if (audio.value) {
          audio.value.pause();
          audio.value = null;
        }
        audio.value = new Audio(URL.createObjectURL(newTrack.file));
        audio.value.volume = volume.value;
        audio.value.onloadedmetadata = () => {
          duration.value = audio.value.duration || 240;
          currentTime.value = 0;
        };
        audio.value.ontimeupdate = () => {
          currentTime.value = audio.value.currentTime;
        };
        audio.value.onended = () => {
          if (loopOne.value) {
            audio.value.currentTime = 0;
            audio.value.play();
          } else if (loopAll.value) {
            nextTrack();
          } else {
            playerStore.togglePlay();
          }
        };
        if (playerStore.isPlaying) {
          audio.value.play();
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

function prevTrack() {
  // Логика для предыдущего трека
  console.log('Previous track');
}

function nextTrack() {
  // Логика для следующего трека
  console.log('Next track');
}

function toggleLike() {
  isLiked.value = !isLiked.value;
  if (playerStore.currentTrack) {
    playerStore.currentTrack.isLiked = isLiked.value;
  }
}

function toggleShuffle() {
  shuffleActive.value = !shuffleActive.value;
}

const loopMode = ref('none')  // 'none' | 'all' | 'one'

// При клике перебираем режимы
function cycleLoopMode() {
  if (loopMode.value === 'none')       loopMode.value = 'all'
  else if (loopMode.value === 'all')   loopMode.value = 'one'
  else /* one */                       loopMode.value = 'none'
}

// Класс для цвета: активный цвет для all и one, дефолтный для none
const loopClass = computed(() => {
  if (loopMode.value === 'none') return 'text-light-text dark:text-dark-text'
  // для both all и one используем primary
  return 'text-light-primary dark:text-dark-primary'
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
    isMuted.value = volume.value === 0;
  }
}

function toggleMute() {
  if (audio.value) {
    isMuted.value = !isMuted.value;
    audio.value.volume = isMuted.value ? 0 : volume.value;
  }
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(Math.floor(sec % 60)).padStart(2, '0');
  return `${m}:${s}`;
}
</script>

<style scoped>
input[type="range"] {
  appearance: none; /* Убирает стандартный стиль браузера */
  border-radius: 9999px; /* Полностью закруглённые края (аналог rounded-full) */
  height: 0.25rem; /* Аналог h-1 */
  background-color: #d1d5db; /* Аналог bg-gray-300 */
}

/* Тёмная тема через класс .dark */
.dark input[type="range"] {
  background-color: #4b5563; /* Аналог dark:bg-gray-600 */
}

/* Webkit (Chrome, Safari) */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  border-radius: 9999px;
  height: 0.75rem; /* Аналог h-3 */
  width: 0.75rem; /* Аналог w-3 */
  background-color: #6366f1; /* Аналог bg-light-primary */
  cursor: pointer;
}

.dark input[type="range"]::-webkit-slider-thumb {
  background-color: #8b5cf6; /* Аналог dark:bg-dark-primary */
}

/* Firefox */
input[type="range"]::-moz-range-thumb {
  border-radius: 9999px;
  height: 0.75rem; /* Аналог h-3 */
  width: 0.75rem; /* Аналог w-3 */
  background-color: #6366f1; /* Аналог bg-light-primary */
  cursor: pointer;
  border: none; /* Firefox добавляет границу по умолчанию, убираем */
}

.dark input[type="range"]::-moz-range-thumb {
  background-color: #8b5cf6; /* Аналог dark:bg-dark-primary */
}
</style>