<template>
  <div class="p-4">
    <div class="relative">
      <input
          type="text"
          placeholder="Поиск"
          class="w-full pl-3 pr-10 py-2 rounded
               bg-white dark:bg-gray-800
               text-gray-900 dark:text-gray-100
               border border-gray-300 dark:border-gray-700
               placeholder-gray-500 dark:placeholder-gray-400
               focus:outline-none focus:ring focus:ring-indigo-500 dark:focus:ring-indigo-400
               transition-colors duration-150"
      />
      <!-- SVG icon inside the input field at the end -->
      <MagnifyingGlassIcon class="absolute inset-y-0 right-3 my-auto w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
/* Локальные стили при необходимости */
</style>