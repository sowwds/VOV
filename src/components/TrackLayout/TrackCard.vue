<!-- src/components/TrackLayout/TrackCard.vue -->
<template>
  <div
      class="bg-light-surface dark:bg-dark-surface shadow-lg rounded p-3 overflow-visible group relative"
      @mouseleave="handleCardMouseLeave"
  >
    <!-- Обложка -->
    <div class="w-full aspect-square overflow-hidden rounded">
      <img
          :src="track.coverUrl || defaultCover"
          :alt="track.title || 'Трек'"
          class="w-full h-full object-cover"
      />
    </div>

    <!-- Overlay -->
    <div
        class="absolute inset-0 rounded opacity-0 group-hover:opacity-60 flex items-center justify-evenly
             bg-black transition-opacity duration-200 z-10"
    >
      <!-- Play/Pause -->
      <button @click.stop="onPlay" class="p-1 hover:scale-110 text-white transition-transform duration-200">
        <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-8 h-8" />
      </button>

      <!-- Меню -->
      <div class="relative">
        <button
            ref="triggerRef"
            @click="toggleMenu"
            @mouseenter="openMenu"
            class="p-1 hover:scale-110 text-white transition-transform duration-200"
        >
          <!-- три точки -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
               viewBox="0 0 16 16">
            <path
                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0
                 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3
                 1.5 1.5 0 0 1 0 3z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Options popover -->
    <div
        v-show="showMenu"
        ref="menuRef"
        class="fixed z-[100]"
        :style="menuPosition"
        @mouseleave="closeMenuWithDelay"
    >
      <div class="bg-white dark:bg-dark-surface shadow-xl rounded-md w-40 overflow-hidden">
        <button @click="onAddNext" class="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-primary dark:hover:bg-dark-primary">
          Добавить следующим
        </button>
        <button @click="onAddToQueue" class="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-primary dark:hover:bg-dark-primary">
          Добавить в очередь
        </button>
        <button @click="onRemoveFromLibrary" class="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-primary dark:hover:bg-dark-primary">
          Удалить из коллекции
        </button>
      </div>
    </div>

    <!-- Название и автор -->
    <div class="p-3">
      <h3 class="text-light-text dark:text-dark-text text-base font-semibold truncate">
        {{ track.title || 'Без названия' }}
      </h3>
      <p class="text-light-text-muted dark:text-dark-text-muted text-sm truncate">
        {{ track.author || 'Неизвестный исполнитель' }}
        <span v-if="track.year"> - {{ track.year }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/store/player'
import { PlayIcon, PauseIcon, HeartIcon, PlayCircleIcon } from '@heroicons/vue/24/outline'

// Props
const { track, section } = defineProps({
  track:   { type: Object, required: true },
  section: { type: String, default: 'userLibrary' }
})

// Emits
const emit = defineEmits([
  'play-track',
  'toggle-play',
  'add-to-queue',
  'add-next',
  'remove-from-library'
])

// Player
const player = usePlayerStore()

// Menu state
const showMenu = ref(false)
const menuRef = ref(null)
const triggerRef = ref(null)
let menuTimeout = null

const defaultCover = 'https://via.placeholder.com/256'

// Is this the current track?
const isCurrent = computed(() => player.currentTrackId === track.trackId)
const isPlaying = computed(() => player.isPlaying && isCurrent.value)

function onPlay() {
  if (isCurrent.value) {
    emit('toggle-play')
  } else {
    emit('play-track', track.trackId, section)
  }
}

function onAddToQueue() {
  emit('add-to-queue', track.trackId)
  closeMenu()
}

function onAddNext() {
  emit('add-next', track.trackId)
  closeMenu()
}

function onRemoveFromLibrary() {
  emit('remove-from-library', track.trackId)
  closeMenu()
}
function handleCardMouseLeave(e) {
  if (!menuRef.value?.contains(e.relatedTarget)) closeMenu()
}

// Menu helpers
function toggleMenu() { showMenu.value = !showMenu.value }
function openMenu() { clearTimeout(menuTimeout); showMenu.value = true }
function closeMenu() { showMenu.value = false }
function closeMenuWithDelay() { menuTimeout = setTimeout(closeMenu, 200) }
function handleClickOutside(e) {
  if ( showMenu.value &&
      !menuRef.value?.contains(e.target) &&
      !triggerRef.value?.contains(e.target)
  ) {
    closeMenu()
  }
}

const windowWidth  = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
const menuPosition = computed(() => {
  if (!triggerRef.value || !menuRef.value || !showMenu.value) return {}
  const rect = triggerRef.value.getBoundingClientRect()
  const menuW = 160, menuH = 120, pad = 8, off = 4
  const right  = windowWidth.value  - rect.right >= menuW + pad
  const bottom = windowHeight.value - rect.bottom >= menuH + pad + off
  const left  = right ? rect.left : Math.max(pad, rect.right - menuW)
  const top   = bottom ? rect.bottom + off : Math.max(pad, rect.top - menuH - off)
  return { left: `${left}px`, top: `${top}px` }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', () => {
    windowWidth.value  = window.innerWidth
    windowHeight.value = window.innerHeight
  })
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleClickOutside)
  clearTimeout(menuTimeout)
})
</script>

<style scoped>
.text-light-text-muted { font-size: .875rem; color: #6b7280; }
.dark .text-dark-text-muted { color: #9ca3af; }
.v-enter-active, .v-leave-active { transition: opacity .2s, transform .2s; }
.v-enter-from, .v-leave-to   { opacity: 0; transform: translateY(-10px); }
</style>
