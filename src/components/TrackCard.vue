<template>
  <div
      class="bg-light-surface dark:bg-dark-surface shadow-lg rounded p-3 overflow-visible group relative"
      @mouseleave="handleCardMouseLeave"
  >
    <!-- Обложка -->
    <div class="w-full aspect-square overflow-hidden rounded">
      <img
          :src="avatarUrl"
          :alt="track.title"
          class="w-full h-full object-cover"
      />
    </div>

    <!-- Overlay -->
    <div
        class="absolute inset-0 rounded opacity-0 group-hover:opacity-60 flex items-center justify-evenly
           bg-black transition-opacity duration-200 z-10"
    >
      <!-- Play/Pause -->
      <button
          @click.stop="onPlay"
          class="p-1 hover:scale-110 text-white transition-transform duration-200"
      >
        <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-8 h-8" />
      </button>

      <!-- More menu toggle -->
      <div class="relative">
        <button
            @mouseenter="openMenu"
            class="p-1 hover:scale-110 text-white transition-transform duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Options popover -->
    <div
        v-show="showMenu"
        ref="menuRef"
        class="absolute left-full top-1/2 transform -translate-y-1/2 z-100"
        @mouseleave="closeMenuWithDelay"
    >
      <div class="bg-white dark:bg-dark-surface shadow-xl rounded-md w-40 overflow-hidden">
        <button
            @click="addNext"
            class="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
        >
          Добавить следующим
        </button>
        <button
            @click="addToQueue"
            class="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-primary dark:hover:bg-dark-primary transition-colors"
        >
          Добавить в очередь
        </button>
      </div>
    </div>

    <!-- Title and artist -->
    <div class="p-5">
      <h3 class="text-light-text dark:text-dark-text text-lg truncate">{{ track.title }}</h3>
      <p class="text-light-text-muted dark:text-dark-text-muted truncate">{{ track.artist }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/store/player'
import { getTrackAvatar } from '@/services/avatarService.js'
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline'

const props = defineProps({ track: { type: Object, required: true } })
const player = usePlayerStore()
const showMenu = ref(false)
const menuRef = ref(null)
const menuTimeout = ref(null)



const isCurrent = computed(() => player.currentTrack === props.track.id)
const isPlaying = computed(() => player.isPlaying && isCurrent.value)

function onPlay() {
  if (!isCurrent.value) {
    player.playTrack(props.track)
  } else {
    player.togglePlay()
  }
}

function openMenu() {
  clearTimeout(menuTimeout.value)
  showMenu.value = true
}

function closeMenu() {
  showMenu.value = false
}

function closeMenuWithDelay() {
  menuTimeout.value = setTimeout(() => {
    closeMenu()
  }, 300)
}

function handleCardMouseLeave(e) {
  if (!menuRef.value || !menuRef.value.contains(e.relatedTarget)) {
    closeMenu()
  }
}

function addToQueue() {
  player.enqueue(props.track)
  closeMenu()
}

function addNext() {
  player.enqueueNext(props.track)
  closeMenu()
}

const avatarUrl = computed(() => getTrackAvatar(props.track))

// Закрытие меню при клике вне его
function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(menuTimeout.value)
})
</script>

<style scoped>
/* Плавное появление/исчезновение меню */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-10px) translateX(0);
}
</style>