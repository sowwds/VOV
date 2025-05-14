import { defineStore } from 'pinia';

export const useRestorationStore = defineStore('restoration', {
  state: () => ({
    files: [], // Массив выбранных файлов для загрузки
    title: '', // Название аудио
    author: '', // Автор аудио
    coverFile: null, // Объект File для обложки
    restoredAudioUrl: '', // URL восстановленного аудио (заглушка)
  }),

  actions: {
    // Установить выбранные файлы
    setFiles(files) {
      this.files = files;
    },

    // Установить название
    setTitle(title) {
      this.title = title;
    },

    // Установить автора
    setAuthor(author) {
      this.author = author;
    },

    // Установить файл обложки
    setCoverFile(file) {
      this.coverFile = file;
    },

    // Установить URL восстановленного аудио
    setRestoredAudioUrl(url) {
      this.restoredAudioUrl = url;
    },

    // Сбросить состояние (например, после завершения процесса)
    reset() {
      this.files = [];
      this.title = '';
      this.author = '';
      this.coverFile = null;
      this.restoredAudioUrl = '';
    },
  },
});
