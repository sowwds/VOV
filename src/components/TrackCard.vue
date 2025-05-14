<!-- TrackCard.vue -->
<template>
  <div class="bg-light-surface dark:bg-dark-surface shadow-lg rounded p-3 overflow-visible group relative">
    <!-- Обложка -->
    <div class="w-full aspect-square overflow-hidden rounded">
      <template v-if="track.imageUrl">
        <img
            :src="track.imageUrl"
            :alt="track.title"
            class="w-full h-full object-cover"
        />
      </template>
      <template v-else>
        <div
            class="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
            :style="{ backgroundColor: avatarBgColor }"
        >
          {{ avatarLetter }}
        </div>
      </template>
    </div>

    <!-- Overlay buttons -->
    <div class="absolute inset-0 bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-evenly opacity-0 group-hover:opacity-60 transition">
      <button
          @click="$emit('like', track.id)"
          class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition"
      >
        <!-- Heart Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
          <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg>
      </button>
      <button
          @click="$emit('play', track.id)"
          class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition"
      >
        <!-- Play Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
        </svg>
      </button>
      <button
          @click="$emit('more', track.id)"
          class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition"
      >
        <!-- More Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
        </svg>
      </button>
    </div>

    <!-- Title and artist -->
    <div class="p-5">
      <h3 class="text-light-text dark:text-dark-text text-lg truncate">{{ track.title }}</h3>
      <p class="text-light-text-muted dark:text-dark-text-muted truncate">{{ track.artist }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  track: { type: Object, required: true }
})

// Буква для аватара: первая буква названия, или артиста
const avatarLetter = computed(() => {
  const str = props.track.title || props.track.artist || ''
  return str.charAt(0).toUpperCase() || '?'
})

// Генерация фонового цвета по имени (можно любой хэш-функцией)
const avatarBgColor = computed(() => {
  // простая хэш-функция для получения 0–5 индекса
  const colors = ['#F87171','#FBBF24','#34D399','#60A5FA','#A78BFA','#F472B6']
  let hash = 0
  const key = props.track.title + props.track.artist
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff
  }
  return colors[Math.abs(hash) % colors.length]
})


</script>

<style scoped>
/* ничего дополнительного */
</style>