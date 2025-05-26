import { defineStore } from 'pinia';

export const useVisualizerStore = defineStore('visualizer', {
  state: () => ({
    isAnimationEnabled: true, // Animation is enabled by default
  }),
  actions: {
    toggleAnimation() {
      this.isAnimationEnabled = !this.isAnimationEnabled;
    },
  },
});
