<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Overlay for mobile when sidebar is open -->
    <div
        v-if="drawerOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        @click="drawerOpen = false"
    />

    <!-- Sidebar (drawer on mobile) -->
    <aside
        :class="[
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 flex-shrink-0 transition-transform duration-200 z-30',
        drawerOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:flex'
      ]"
        class="fixed inset-y-0 left-0"
    >
      <Sidebar />
    </aside>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col h-full">
      <!-- Mobile header with hamburger -->
      <header class="md:hidden flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <button @click="drawerOpen = true" aria-label="Open sidebar">
          <svg class="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div />
      </header>

      <!-- Scrollable page content -->
      <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-150">
        <router-view />
      </main>

      <!-- MusicBar fixed at bottom -->
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

const drawerOpen = ref(false)
</script>

<style scoped>
/* Ensure sidebar covers full height when fixed */
aside { top: 0; bottom: 0; }
</style>
