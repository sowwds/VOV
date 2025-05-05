<template>
  <nav class="px-4 bg-white dark:bg-gray-800 transition-colors duration-150">
    <ul class="space-y-2">
      <li v-for="item in menuItems" :key="item.to">
        <router-link
            :to="item.to"
            class="block w-full flex items-center p-2 rounded
                 bg-gray-50 dark:bg-gray-900
                 text-gray-700 dark:text-gray-200
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-colors duration-150"
        >
          <component :is="item.icon" class="w-5 h-5 mr-2 text-current" />
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import {
  HomeIcon,
  HeartIcon,
} from '@heroicons/vue/24/outline'
import WrenchScrewdriverIcon from '@/components/icons/WrenchScrewdriverIcon.vue'

const menuItems = [
  { to: '/',           label: 'Главная',     icon: HomeIcon },
  { to: '/restorator', label: 'Реставратор', icon: WrenchScrewdriverIcon },
  { to: '/collection', label: 'Коллекция',   icon: HeartIcon },
]
</script>

<style scoped>
/* Локальные стили, если понадобятся */
</style>
