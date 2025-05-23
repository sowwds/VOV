<template>
  <div class="relative h-10 w-64">
    <!-- Единый блок - плашка с динамической высотой -->
    <div
        ref="dropdown"
        class="absolute top-0 right-0 left-0 bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-sm shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-1000 ease-in-out z-10 box-border"
        :style="{ maxHeight: isExpanded ? '340px' : '40px', transitionProperty: 'max-height' }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="toggleExpanded"
    >
      <!-- Контейнер для контента -->
      <div>
        <!-- Основной контент плашки (виден, когда не расширено) -->
        <div v-show="!isExpanded" class="flex items-center gap-3 px-4 h-9">
          <img
              v-if="avatarUrl"
              :src="avatarUrl"
              class="w-8 h-8 rounded-full object-cover"
              alt="User avatar"
          >
          <div
              v-else
              class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium"
          >
            {{ fullName && fullName.length > 0 ? fullName.charAt(0) : 'A' }}
          </div>
          <span class="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[calc(100%-4rem)]">
            {{ fullName || 'Аноним' }}
          </span>
        </div>

        <!-- Расширенный контент (виден, когда расширено) -->
        <div v-show="isExpanded" class="p-4 space-y-3">
          <!-- Информация о пользователе -->
          <div class="space-y-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">Аккаунт</p>
            <div class="flex items-center gap-3">
              <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  class="w-10 h-10 rounded-full object-cover"
                  alt="User avatar"
              >
              <div
                  v-else
                  class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium"
              >
                {{ fullName && fullName.length > 0 ? fullName.charAt(0) : 'A' }}
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-200">
                  {{ fullName }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {{ email }}
                </p>
              </div>
            </div>
          </div>
          <!-- Тёмная/светлая тема -->
          <div class="flex items-center justify-between px-3 py-2">
            <span class="text-gray-700 dark:text-gray-300">Тема</span>
            <ThemeSwitcher size="w-12 h-6" />
          </div>

          <!-- Разделитель -->
          <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          <!-- Кнопка выхода -->
          <button
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-3 py-2 justify-center text-red-400 hover:scale-105 active:scale-95 transition-transform duration-200 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/services/authservice.js';
import { useAuthStore } from '@/store/auth.js';
import { storeToRefs } from 'pinia';
import ThemeSwitcher from '@/components/Header/ThemeSwitcher.vue';

const router = useRouter();
const authStore = useAuthStore();
const { avatarUrl, fullName, email } = storeToRefs(authStore);
const isExpanded = ref(false);
const dropdown = ref(null);

// Функция для переключения меню на мобильных устройствах
function toggleExpanded() {
  if (window.innerWidth < 768) {
    isExpanded.value = !isExpanded.value;
  }
}

function onMouseEnter() {
  if (window.innerWidth >= 768) {
    isExpanded.value = true;
  }
}

function onMouseLeave() {
  if (window.innerWidth >= 768) {
    isExpanded.value = false;
  }
}

function handleLogout() {
  logout();
  router.push('/login');
}

// Закрытие меню при клике вне плашки на мобильных
function handleClickOutside(event) {
  if (window.innerWidth < 768 && isExpanded.value && dropdown.value && !dropdown.value.contains(event.target)) {
    isExpanded.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.box-border {
  box-sizing: border-box;
}
</style>