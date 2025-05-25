<template>
  <nav class="hidden md:flex flex-1 justify-center">
    <ul class="flex space-x-6">
      <li v-for="item in menuItems" :key="item.to" class="relative group">
        <router-link
            :to="item.to"
            class="flex items-center px-2 py-1 rounded
                   text-gray-700 dark:text-gray-200
                   hover:text-indigo-500 dark:hover:text-white"
        >
          <component :is="item.icon" class="w-5 h-5 mr-2 text-current" />
          <span>{{ item.label }}</span>
        </router-link>
        <!-- Псевдоэлемент для анимации фона -->
        <span class="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
      </li>
    </ul>
  </nav>
</template>

<script setup>
import {
  HomeIcon,
  HeartIcon,
  BuildingLibraryIcon,
} from '@heroicons/vue/24/outline';
import WrenchScrewdriverIcon from '@/components/icons/WrenchScrewdriverIcon.vue';

const menuItems = [
  { to: '/', label: 'Главная', icon: HomeIcon },
  { to: '/restoration', label: 'Реставратор', icon: WrenchScrewdriverIcon },
  { to: '/library', label: 'Библиотека', icon: BuildingLibraryIcon },
  { to: '/collection', label: 'Коллекция', icon: HeartIcon },
];
</script>

<style scoped>
/* Стили для анимации навигации */
li {
  position: relative;
}

li .absolute {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #6366f1;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease-in-out;
}

.group:hover .absolute {
  transform: scaleX(1);
}
</style>