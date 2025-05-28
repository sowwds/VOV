<template>
  <div class="flex min-h-screen h-full overflow-auto flex-col custom-scroll">
    <!-- AudioVisualizer показываем только если hideMusic не true -->
    <AudioVisualizer v-show="!route.meta.hideMusic" />
    <Header @toggleDrawer="toggleDrawer" :drawerOpen="drawerOpen" />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col relative mt-3">
      <!-- Mobile overlay -->
      <transition name="fade">
        <div
            v-if="drawerOpen && isMobile"
            class="fixed inset-0 bg-black/80 z-20 pointer-events-auto"
            style="top: 4rem;"
            @click="toggleDrawer"
        />
      </transition>

      <!-- Sidebar with fixed animation -->
      <transition name="slide">
        <aside
            v-if="drawerOpen && isMobile"
            class="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 w-full z-30 shadow-xl overflow-y-auto"
            style="max-height: calc(100vh - 4rem);"
        >
          <Sidebar />
        </aside>
      </transition>

      <!-- Page content -->
      <main
          class="flex-1 px-8 md:px-12 lg:px-16"
          @click="closeSidebarOnMobile"
      >
        <router-view />
      </main>

      <!-- Music player -->
      <footer
          v-show="!route.meta.hideMusic && !musicStore.isSidebarVisible && !isMobile"
          class="fixed inset-x-0 bottom-0 flex-shrink-0 h-16 z-50 mb-4"
      >
        <MusicBar />
      </footer>

      <!-- Мобильная версия -->
      <footer
          v-show="isMobile && !route.meta.hideMusic"
          class="fixed inset-x-0 bottom-0 flex-shrink-0 h-16 z-150"
      >
        <MobileMusicBar :audioElement="audio" />
      </footer>

      <Teleport to="body">
        <MusicSidebar v-show="!isMobile && musicStore.isSidebarVisible && !route.meta.hideMusic" />
      </Teleport>
    </div>

    <audio
        ref="audio"
        crossorigin="anonymous"
        preload="metadata"
        class="hidden"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide, watch } from 'vue';
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import MusicBar from '@/components/Music/MusicBar.vue';
import MobileMusicBar from '@/components/Music/MobileMusicBar.vue';
import MusicSidebar from '@/components/MusicSidebar/MusicSidebar.vue';
import Header from '@/components/Header/Header.vue';
import AudioVisualizer from '@/components/AudioVisualizer/AudioVisualizer.vue';
import { useMusicStore } from '@/store/music';
import { usePlayerStore } from '@/store/player';
import { useRoute } from 'vue-router';

const route = useRoute();
const musicStore = useMusicStore();
const playerStore = usePlayerStore();
const drawerOpen = ref(false);
const audio = ref(null);
const isMobile = ref(false);

function updateIsMobile() {
  isMobile.value = window.innerWidth < 768;
}

function toggleDrawer() {
  if (isMobile.value) {
    drawerOpen.value = !drawerOpen.value;
  }
}

function closeSidebarOnMobile() {
  if (isMobile.value && drawerOpen.value) {
    drawerOpen.value = false;
  }
}

function closeSidebar() {
  if (isMobile.value) {
    drawerOpen.value = false;
  }
}

provide('closeSidebar', closeSidebar);
provide('audioElement', audio);

onMounted(() => {
  console.log('MainLayout mounted, setting audio element:', audio.value);
  if (audio.value) {
    playerStore.setAudioElement(audio.value);
  }
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

// Восстанавливаем audioElement при смене маршрута
watch(
    () => route.path,
    (newPath) => {
      console.log('Route changed:', newPath, 'hideMusic:', route.meta.hideMusic);
      if (audio.value && !playerStore.audioElement) {
        console.warn('Audio element lost, resetting in playerStore');
        playerStore.setAudioElement(audio.value);
      }
    },
    { immediate: true }
);

onUnmounted(() => {
  console.log('MainLayout unmounted, removing resize listener');
  window.removeEventListener('resize', updateIsMobile);
  // НЕ сбрасываем audioElement, чтобы сохранить воспроизведение
});
</script>

<style scoped>
/* Плавная анимация выезжания Sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Анимация для оверлея */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Стили для скроллбара */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: var(--color-light-bg, #fafafc);
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: var(--color-light-surface, #ffffff);
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-light-surface, #ffffff);
  opacity: 0.8;
}

.dark .custom-scroll::-webkit-scrollbar-track {
  background: var(--color-dark-bg, #17181c);
}

.dark .custom-scroll::-webkit-scrollbar-thumb {
  background: var(--color-dark-surface, #26272c);
}

.dark .custom-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-dark-surface, #26272c);
  opacity: 0.8;
}
</style>
