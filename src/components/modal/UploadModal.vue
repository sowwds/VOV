<script setup>
import { ref } from 'vue';
import { Dialog, DialogPanel } from '@headlessui/vue';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);
const isDragging = ref(false);
const selectedFiles = ref([]);
const urlInput = ref('');

// Обработчик закрытия модального окна
const closeModal = () => {
  console.log('Emitting close event');
  selectedFiles.value = [];
  urlInput.value = '';
  emit('close');
};

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
    selectedFiles.value = Array.from(files);
    console.log('Dropped files:', selectedFiles.value);
  }
};

// Обработчик выбора файлов через input
const onFileSelect = (event) => {
  const files = event.target.files;
  if (files.length) {
    selectedFiles.value = Array.from(files);
    console.log('Selected files:', selectedFiles.value);
  }
};

// Обработчик вставки из буфера обмена
const onPasteFromClipboard = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
        const blob = await item.getType(item.types[0]);
        const file = new File([blob], `pasted-image.${blob.type.split('/')[1]}`, { type: blob.type });
        selectedFiles.value = [file];
        console.log('Pasted file:', selectedFiles.value);
        break;
      }
    }
  } catch (err) {
    console.error('Failed to read clipboard:', err);
  }
};

// Обработчик загрузки файлов
const uploadFiles = async () => {
  if (selectedFiles.value.length) {
    const formData = new FormData();
    selectedFiles.value.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    try {
      console.log('Uploading files:', selectedFiles.value);
      selectedFiles.value = [];
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }
};
</script>

<template>
  <Dialog :open="isOpen" @close="closeModal" class="relative z-[1000]">
    <div class="fixed inset-0 top-0 bg-black/30" aria-hidden="true"></div>
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel class="max-w-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg">
        <!-- Заголовок -->
        <div class="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 class="text-xl font-semibold">Загрузка файлов</h2>
          <button
            class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            @click="closeModal"
            aria-label="Закрыть окно"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Область drag-and-drop -->
        <div
          class="m-6 p-6 border-2 border-blue-500 rounded-lg text-center"
          :class="isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-500'"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
        >
          <div class="text-lg font-medium mb-2 text-gray-900 dark:text-white">Перетащите файлы сюда</div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">или нажмите на кнопку</div>
          <div class="flex justify-center gap-3">
            <label class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
              <span>Выбрать файл</span>
              <input type="file" multiple class="hidden" @change="onFileSelect" />
            </label>
            <button
              class="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              @click="onPasteFromClipboard"
            >
              Вставить из буфера
            </button>
          </div>
          <div v-if="selectedFiles.length" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Выбрано файлов: {{ selectedFiles.length }}
          </div>
        </div>
        <div class="p-6">
  <button
    class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
    @click="uploadFiles"
  >
    Загрузить
  </button>
</div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<style scoped>
</style>
