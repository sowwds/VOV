<template>
  <div class="flex h-screen overflow-hidden flex-col">
    <AudioVisualizer />
    <Header @toggleDrawer="toggleDrawer" :drawerOpen="drawerOpen" />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col h-full overflow-auto relative mt-3">
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
          class="flex-1 overflow-auto px-8 md:px-12 lg:px-16 pb-6 pt-15"
          @click="closeSidebarOnMobile"
      >
        <router-view />
      </main>

      <!-- Music player -->
      <footer v-if="!isMobile && !musicStore.isSidebarVisible" class="flex-shrink-0">
        <MusicBar :audioElement="audio" />
      </footer>
      <footer v-if="isMobile" class="flex-shrink-0">
        <MobileMusicBar :audioElement="audio" />
      </footer>

      <Teleport to="body">
        <MusicSidebar v-if="!isMobile && musicStore.isSidebarVisible" />
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
import { ref, onMounted, onUnmounted, provide } from 'vue';
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import MusicBar from '@/components/Music/MusicBar.vue';
import MobileMusicBar from '@/components/Music/MobileMusicBar.vue';
import MusicSidebar from '@/components/MusicSidebar/MusicSidebar.vue';
import Header from '@/components/Header/Header.vue';
import AudioVisualizer from '@/components/AudioVisualizer/AudioVisualizer.vue';
import { useMusicStore } from '@/store/music';
import { usePlayerStore } from '@/store/player';

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
  if (audio.value) {
    playerStore.setAudioElement(audio.value);
  }
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

onUnmounted(() => {
  playerStore.setAudioElement(null);
  window.removeEventListener('resize', updateIsMobile);
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
main::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

main::-webkit-scrollbar-track {
  background: var(--color-light-bg, #fafafc);
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb {
  background: var(--color-light-surface, #ffffff);
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: var(--color-light-surface, #ffffff);
  opacity: 0.8;
}

.dark main::-webkit-scrollbar-track {
  background: var(--color-dark-bg, #17181c);
}

.dark main::-webkit-scrollbar-thumb {
  background: var(--color-dark-surface, #26272c);
}

.dark main::-webkit-scrollbar-thumb:hover {
  background: var(--color-dark-surface, #26272c);
  opacity: 0.8;
}
</style>