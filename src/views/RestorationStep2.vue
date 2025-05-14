<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRestorationStore } from '@/store/restoration';
import StepIndicator from '@/components/StepIndicator.vue';

const router = useRouter();
const restorationStore = useRestorationStore();
const isDragging = ref(false);

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
    restorationStore.setFiles(Array.from(files));
    console.log('Dropped files:', restorationStore.files);
  }
};

// Обработчик выбора файлов
const onFileSelect = (event) => {
  const files = event.target.files;
  if (files.length) {
    restorationStore.setFiles(Array.from(files));
    console.log('Selected files:', restorationStore.files);
  }
};

// Обработчик загрузки
const uploadFiles = async () => {
  if (restorationStore.files.length) {
    const formData = new FormData();
    restorationStore.files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    try {
      console.log('Uploading files:', restorationStore.files);
      // В будущем заменить на fetch
      router.push('/restoration/step3');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }
};
</script>

<template>
  <div class=" relative h-full flex flex-col items-center justify-center p-4">

    <h1 class="text-3xl font-bold text-light-text dark:text-dark-text mb-6">Загрузка аудио</h1>
    <div class="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow-lg w-full max-w-md">
      <div
        class="p-6 border-2 border-dashed rounded-lg text-center"
        :class="isDragging ? 'border-light-primary bg-light-primary/20 dark:border-dark-primary dark:bg-dark-primary/20' : 'border-gray-500 dark:border-gray-400'"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <div class="text-lg font-medium mb-2 text-light-text dark:text-dark-text">Перетащите файлы сюда</div>
        <div class="text-sm text-light-text-muted dark:text-dark-text-muted mb-4">или выберите файл</div>
        <label class="bg-light-secondary text-dark-text px-4 py-2 rounded hover:bg-light-primary hovercursor-pointer
        dark:text-dark-text dark:bg-dark-secondary hover:bg-dark-primary">
          <span>Выбрать файл</span>
          <input type="file" multiple class="hidden" @change="onFileSelect" />
        </label>
        <div v-if="restorationStore.files.length" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Файл выбран
        </div>
      </div>
      <button
        class="mt-4 w-full px-4 py-2 rounded
        bg-light-primary dark:bg-dark-primary
        text-dark-text
        hover:bg-light-secondary dark:hover:bg-dark-secondary
        disabled:bg-gray-500 disabled:cursor-not-allowed"
        :disabled="restorationStore.files.length === 0"
        @click="uploadFiles"
      >
        Загрузить
      </button>
    </div>

  <StepIndicator />
  </div>
</template>
