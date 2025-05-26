<template>
    <!-- Compact animation toggle switch with play/pause icons -->
    <div
        :class="[
        'relative flex items-center justify-between rounded-full overflow-hidden p-0.5 cursor-pointer transition-colors duration-150',
        bgClass,
        sizeClass
      ]"
        @click="toggleAnimation"
    >
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
  import { computed } from 'vue';
  import { useVisualizerStore } from '@/store/visualizer';
  import { PlayIcon, PauseIcon } from '@heroicons/vue/24/outline';

  // Prop for custom size classes (width and height)
  const props = defineProps({
    size: { type: String, default: 'w-12 h-6' }
  });

  const visualizerStore = useVisualizerStore();

  // Determine animation state
  const isAnimationEnabled = computed(() => visualizerStore.isAnimationEnabled);

  // Background based on animation state
  const bgClass = computed(() =>
    isAnimationEnabled.value ? 'bg-light-primary dark:bg-dark-primary' : 'bg-gray-200 dark:bg-gray-700'
  );

  // Size from prop
  const sizeClass = computed(() => props.size);

  // Knob position class: left-1/2 for enabled, left-0 for disabled
  const knobPositionClass = computed(() =>
    isAnimationEnabled.value ? 'left-1/2' : 'left-0'
  );

  // Toggle animation state
  function toggleAnimation() {
    visualizerStore.toggleAnimation();
  }
  </script>

  <style scoped>
  /* No extra styles */
  </style>
