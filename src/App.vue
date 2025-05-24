<template>
  <!-- Рендерим основной лейаут со всеми компонентами -->
  <router-view />
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const TrackCardLibrary = defineAsyncComponent(() =>
    import('./components/TrackLayout/TrackCardLibrary.vue')
);
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
