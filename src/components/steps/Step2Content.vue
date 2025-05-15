<script setup>
import { ref, computed } from 'vue';
import { useRestorationStore } from '@/store/restoration';
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue';

defineProps({
  goToPreviousStep: {
    type: Function,
    default: () => {},
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
});

const restorationStore = useRestorationStore();
const isDragging = ref(false);
const fileError = ref('');

// Проверка файла на формат и размер
const validateFiles = (files) => {
  const maxSizeMB = 70;
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // 70 MB в байтах
  const allowedType = 'audio/mpeg'; // MIME-тип для MP3

  for (const file of files) {
    if (file.type !== allowedType) {
      return 'Файл должен быть в формате MP3.';
    }
    if (file.size > maxSizeBytes) {
      return `Файл должен быть меньше ${maxSizeMB} МБ.`;
    }
  }
  return '';
};

// Проверка, есть ли валидные файлы
const hasValidFiles = computed(() => {
  return restorationStore.files.length > 0 && !fileError.value;
});

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
    fileError.value = validateFiles(files);
    if (!fileError.value) {
      restorationStore.setFiles(Array.from(files));
      console.log('Dropped files:', restorationStore.files);
    } else {
      restorationStore.setFiles([]); // Сбрасываем файлы, если есть ошибка
    }
  }
};

const onFileSelect = (event) => {
  const files = event.target.files;
  if (files.length) {
    fileError.value = validateFiles(files);
    if (!fileError.value) {
      restorationStore.setFiles(Array.from(files));
      console.log('Selected files:', restorationStore.files);
    } else {
      restorationStore.setFiles([]); // Сбрасываем файлы, если есть ошибка
    }
  }
};

const uploadFiles = async () => {
  if (hasValidFiles.value) {
    const formData = new FormData();
    restorationStore.files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    try {
      console.log('Uploading files:', restorationStore.files);
      restorationStore.setCurrentStep(3);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }
};
</script>

<template>
  <div class="relative h-full flex flex-col items-center justify-center p-4">
    <div class="flex justify-start w-full max-w-md mb-4">
      <button
        v-if="showBackButton"
        class="flex items-center text-light-text dark:text-dark-text px-4 py-2 rounded cursor-pointer"
        @click="goToPreviousStep"
      >
        <IconArrowLeft class="h-5 w-5 mr-2" />
      </button>
    </div>
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
        <label class="bg-light-secondary text-dark-text px-4 py-2 rounded hover:bg-light-primary hovercursor-pointer dark:text-dark-text dark:bg-dark-secondary hover:bg-dark-primary">
          <span>Выбрать файл</span>
          <input type="file" multiple accept=".mp3,audio/mpeg" class="hidden" @change="onFileSelect" />
        </label>
        <div v-if="fileError" class="mt-4 text-sm text-red-500">
          {{ fileError }}
        </div>
        <div v-else-if="restorationStore.files.length" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Файл выбран
        </div>
      </div>
      <button
        class="mt-4 w-full px-4 py-2 rounded bg-light-primary dark:bg-dark-primary text-dark-text hover:bg-light-secondary dark:hover:bg-dark-secondary disabled:bg-gray-500 disabled:cursor-not-allowed"
        :disabled="!hasValidFiles"
        @click="uploadFiles"
      >
        Загрузить
      </button>
    </div>
  </div>
</template>
