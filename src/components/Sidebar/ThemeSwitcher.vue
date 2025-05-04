<template>
  <!-- Compact theme toggle switch with sun/moon icons -->
  <div
      :class="[
      'relative flex items-center justify-between rounded-full overflow-hidden p-0.5 cursor-pointer transition-colors duration-150',
      bgClass,
      sizeClass
    ]"
      @click="toggleTheme"
  >
    <!-- Sun icon -->
    <span class="absolute left-1 text-yellow-500 text-xs">☀️</span>
    <!-- Moon icon -->
    <span class="absolute right-1 text-indigo-200 text-xs">🌙</span>
    <!-- Knob -->
    <div
        :class="[
        'absolute top-0 h-full w-1/2 bg-gray-100 dark:bg-gray-900 rounded-full shadow transition-left duration-200',
        knobPositionClass
      ]"
    ></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useThemeStore } from '@/store/theme'

// Prop for custom size classes (width and height)
const props = defineProps({
  size: { type: String, default: 'w-10 h-5' }
})

const themeStore = useThemeStore()
// Track system preference
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const systemPref = ref(mediaQuery.matches ? 'dark' : 'light')

onMounted(() => {
  mediaQuery.addEventListener('change', e => {
    systemPref.value = e.matches ? 'dark' : 'light'
  })
})

// Determine actual theme: use system if selected
const effective = computed(() =>
    themeStore.mode === 'system' ? systemPref.value : themeStore.mode
)

// Background based on effective theme
const bgClass = computed(() =>
    effective.value === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
)

// Size from prop
const sizeClass = computed(() => props.size)

// Knob position class: left-0 for light, left-1/2 for dark
const knobPositionClass = computed(() =>
    effective.value === 'dark' ? 'left-1/2' : 'left-0'
)

// Toggle between light and dark
function toggleTheme() {
  const next = effective.value === 'dark' ? 'light' : 'dark'
  themeStore.setMode(next)
}
</script>

<style scoped>
/* No extra styles */
</style>