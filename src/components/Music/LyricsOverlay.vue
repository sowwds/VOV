<template>
  <div
      v-if="isVisible"
      class="fixed bottom-0 left-0 right-0 top-[80px] z-60 rounded-t-lg shadow-lg overflow-y-auto overlay-enter"
      :style="backgroundStyle"
      @touchstart="onOverlayTouchStart"
      @touchmove="onOverlayTouchMove"
      @touchend="onOverlayTouchEnd"
  >
    <div class="flex justify-between items-center px-4 py-3">
      <h2 class="text-lg font-semibold text-white">Текст песни</h2>
      <button
          @click="$emit('close')"
          class="p-2 rounded hover:scale-110 active:scale-95 transition-transform duration-200"
          aria-label="Close lyrics"
      >
        <ChevronDownIcon class="w-6 h-6 text-white"/>
      </button>
    </div>

    <div class="px-4 pb-4">
      <p class="text-white text-center">
        Текст песни будет загружен позже.
      </p>
      <!-- Placeholder for lyrics content -->
      <div class="mt-4 text-white/80 text-sm leading-relaxed">
        <p>Здесь будет отображаться текст песни, синхронизированный с воспроизведением.</p>
        <p>Вы сможете прокручивать текст и, возможно, редактировать его.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  dominantColor: {
    type: Array,
    default: () => [0, 0, 0],
  },
  secondaryColor: {
    type: Array,
    default: () => [0, 0, 0],
  },
});

const emit = defineEmits(['close']);
const isVisible = ref(true);

// Swipe handling for overlay
const overlayTouchStartY = ref(0);
const overlayTouchCurrentY = ref(0);
const isOverlaySwiping = ref(false);

function onOverlayTouchStart(e) {
  overlayTouchStartY.value = e.touches[0].clientY;
  overlayTouchCurrentY.value = overlayTouchStartY.value;
  isOverlaySwiping.value = true;
}

function onOverlayTouchMove(e) {
  if (!isOverlaySwiping.value) return;
  overlayTouchCurrentY.value = e.touches[0].clientY;
  const deltaY = overlayTouchCurrentY.value - overlayTouchStartY.value;
  if (deltaY > 0) {
    e.currentTarget.style.transform = `translateY(${deltaY}px)`;
    e.currentTarget.style.opacity = 1 - Math.min(deltaY / 300, 1);
  }
}

function onOverlayTouchEnd(e) {
  if (!isOverlaySwiping.value) return;
  const deltaY = overlayTouchCurrentY.value - overlayTouchStartY.value;
  if (deltaY > 100) { // Threshold for closing overlay
    emit('close');
  }
  isOverlaySwiping.value = false;
  e.currentTarget.style.transform = '';
  e.currentTarget.style.opacity = '';
}

const backgroundStyle = computed(() => {
  const [r1 = 0, g1 = 0, b1 = 0] = props.dominantColor || [0, 0, 0];
  const [r2 = 0, g2 = 0, b2 = 0] = props.secondaryColor || [0, 0, 0];
  return {
    background: `linear-gradient(to bottom, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`,
  };
});
</script>

<style scoped>
.overlay-enter {
  animation: slide-up 0.3s ease;
}
.overlay-exit {
  animation: slide-up 0.3s ease reverse;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
</style>