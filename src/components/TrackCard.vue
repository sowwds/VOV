<template>
  <!-- Компактная карточка трека с выпадающим меню -->
  <div
      class="relative w-36 bg-white dark:bg-gray-800
           border border-gray-200 dark:border-gray-700
           rounded-lg shadow-sm transition-colors duration-150
           overflow-visible"
  >
    <!-- Обложка -->
    <img
        :src="track.imageUrl"
        alt="Cover"
        class="w-full h-28 object-cover"
    />

    <!-- Заголовок, исполнитель и кнопка меню -->
    <div class="px-2 py-1 flex items-center justify-between">
      <div class="flex flex-col">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {{ track.title }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {{ track.artist }}
        </p>
      </div>
      <button
          @click="toggleMenu"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
      >
        <ChevronDownIcon class="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>
    </div>

    <!-- Выпадающее меню выбора версии -->
    <div
        v-if="menuOpen"
        class="absolute top-full right-1 mt-1 w-28
             bg-white dark:bg-gray-700
             border border-gray-200 dark:border-gray-600
             rounded shadow-lg z-10 overflow-visible"
    >
      <button
          class="w-full text-left px-2 py-1 text-xs text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
          :class="{ 'font-semibold': selectedVersion === 'original' }"
          @click="selectVersion('original')"
      >
        Оригинал
      </button>
      <button
          class="w-full text-left px-2 py-1 text-xs text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
          :class="{ 'font-semibold': selectedVersion === 'restored' }"
          @click="selectVersion('restored')"
      >
        Реставрированная
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  track: { type: Object, required: true }
})
const emit = defineEmits(['changeVersion'])

const selectedVersion = ref('original')
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function selectVersion(version) {
  selectedVersion.value = version
  emit('changeVersion', { id: props.track.id, version })
  menuOpen.value = false
}
</script>

<style scoped>
/* Контейнер теперь overflow-visible, чтобы меню не обрезалось */
</style>