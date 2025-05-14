<template>
  <div class="flex h-screen overflow-hidden flex-col">

    <Header @toggleDrawer="toggleDrawer" :drawerOpen="drawerOpen" />
    <!-- Mobile overlay -->
    <transition name="fade">
      <div
          v-if="drawerOpen"
          class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          @click="toggleDrawer"
      />
    </transition>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col h-full overflow-auto relative">
      <!-- Glowing indigo half-circle trigger -->
      <div
          class="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 z-10 h-40 w-10 overflow-visible"
          @mouseenter="drawerOpen = true"
      >
        <div class="relative h-full w-full">
          <!-- Glowing effect -->
          <div
              class="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-10 rounded-r-full transition-all duration-500"
              :class="{
              'w-12': drawerOpen,
              'opacity-100': drawerOpen,
              'opacity-70': !drawerOpen
            }"
          >
            <div class="relative h-full w-full">
              <!-- Gradient circle -->
              <div class="absolute inset-0 rounded-r-full bg-gradient-to-r from-indigo-500 to-indigo-300 opacity-80"></div>
              <!-- Glow effect with animation -->
              <div
                  class="absolute inset-0 rounded-r-full bg-indigo-400 opacity-20 blur-sm transition-all duration-300"
                  :class="{
                  'opacity-30': drawerOpen,
                  'w-full': drawerOpen,
                  'w-8': !drawerOpen
                }"
              ></div>
            </div>

            <!-- Burger icon -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <svg
                  class="w-5 h-5 text-white transition-transform duration-500"
                  :class="{ 'rotate-90': drawerOpen }"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </div>
        </div>
      </div>



      <!-- Sidebar -->
      <transition name="slide">
        <aside
            v-if="drawerOpen"
            class="fixed inset-y-0 left-0 bg-white dark:bg-gray-900 w-64 z-20 shadow-xl"
            @mouseleave="closeSidebar"
        >
          <Sidebar />
        </aside>
      </transition>

      <!-- Page content with larger padding -->
      <main
          class="pt-16 flex-1 overflow-auto bg-light-bg dark:bg-dark-bg
          px-8 md:px-12 lg:px-16 pb-6 transition-all duration-500"
          :class="{ 'md:pl-16': drawerOpen }"
          @click="closeSidebarOnMobile"
      >
        <router-view />
      </main>


      <!-- Music player -->
      <footer class="flex-shrink-0">
        <MusicBar />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import MusicBar from '@/components/MusicBar.vue'
import Header from "@/components/Header/Header.vue";

const drawerOpen = ref(false)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function closeSidebar() {
  if (window.innerWidth >= 768) {
    drawerOpen.value = false
  }
}

function closeSidebarOnMobile() {
  if (window.innerWidth < 768 && drawerOpen.value) {
    drawerOpen.value = false
  }
}
</script>

<style scoped>
/* Ripple animation */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 1s ease-out infinite;
}

/* Glow animation */
@keyframes glow-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.9; }
}

.glow-effect {
  animation: glow-pulse 2s infinite;
}

/* Slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth content movement */
main {
  transition: padding 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Prevent scrolling when sidebar is open */
body:has(.fixed.inset-0.bg-black.bg-opacity-50) {
  overflow: hidden;
}
</style>
