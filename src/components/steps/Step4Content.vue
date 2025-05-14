<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useRestorationStore } from '@/store/restoration';
import StepIndicator from '@/components/StepIndicator.vue';

const router = useRouter();
const restorationStore = useRestorationStore();
const isDragging = ref(false);

// Синхронизация данных с store
watch(() => restorationStore.title, (newTitle) => {
  restorationStore.setTitle(newTitle);
});
watch(() => restorationStore.author, (newAuthor) => {
  restorationStore.setAuthor(newAuthor);
});

// Предварительный просмотр обложки
const coverPreview = computed(() => restorationStore.coverFile ? URL.createObjectURL(restorationStore.coverFile) : null);

// Обработчики drag-and-drop
const onDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length) {
    restorationStore.setCoverFile(files[0]);
  }
};

const onCoverSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    restorationStore.setCoverFile(file);
  }
};

// Переход на следующий шаг
const goToStep5 = () => {
    restorationStore.setCurrentStep(5);
};
</script>

<template>
  <div class=" relative h-full flex flex-col items-center justify-center p-4">

    <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Редактирование метаданных</h1>
    <div class="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow-lg w-full max-w-md">
        <div class="flex flex-wrap justify-around">
            <!-- Обложка -->
            <div class="">
                <h2 class="text-xl mb-2 text-light-text dark:text-dark-text">Обложка</h2>
                <div
                class="relative w-32 h-32 mx-auto border-2 border-dashed rounded-lg text-center"
                :class="isDragging ? 'border-light-primary bg-light-primary/20 dark:border-dark-primary dark:bg-dark-primary/20' : 'border-gray-500 dark:border-gray-400'"
                @dragover="onDragOver"
                @dragleave="onDragLeave"
                @drop="onDrop"
                >
                <img
                    v-if="coverPreview"
                    :src="coverPreview"
                    alt="Cover"
                    class="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                />
                <div v-else class="flex items-center justify-center h-full text-sm text-light-text-muted dark:text-dark-text-muted">
                    Перетащите обложку
                </div>
                <label class="absolute bottom-2 left-1/2 transform -translate-x-1/2
                bg-light-secondary hover:bg-light-primary
                text-white px-2 py-1 rounded
                dark:bg-dark-secondary dark:hover:bg-dark-primary
                cursor-pointer text-sm">
                    <span>Выбрать</span>
                    <input type="file" accept="image/*" @change="onCoverSelect" class="hidden" />
                </label>
                </div>
          </div>
          <div class = "flex flex-col">
            <!-- Название -->
            <div class="mb-6">
                <h2 class="text-xl mb-2 text-light-text dark:text-dark-text">Название</h2>
                <input
                type="text"
                v-model="restorationStore.title"
                class="w-full p-2
                border border-light-text dark:border-dark-text rounded
                bg-light-bg text-light-text
                dark:bg-dark-bg dark:text-dark-text"
                placeholder="Введите название"
                />
            </div>

            <!-- Автор -->
            <div class="mb-6">
                <h2 class="text-xl mb-2 text-light-text dark:text-dark-text">Автор</h2>
                <input
                type="text"
                v-model="restorationStore.author"
                class="w-full p-2
                border border-light-text dark:border-dark-text rounded
                bg-light-bg text-light-text
                dark:bg-dark-bg dark:text-dark-text"
                placeholder="Введите автора"
                />
            </div>
          </div>
        </div>


      <!-- Кнопка продолжить -->
      <button
        class="w-full  px-4 py-2 rounded
        text-dark-text bg-light-primary hover:bg-light-secondary
        dark:bg-dark-primary dark:hover:bg-dark-secondary"
        @click="goToStep5"
      >
        Продолжить
      </button>
    </div>
  </div>
</template>
