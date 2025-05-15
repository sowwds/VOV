import { defineStore } from 'pinia';

export const useRestorationStore = defineStore('restoration', {
  state: () => ({
    currentStep: 1,
    files: [],
    title: '',
    author: '',
    year: '',
    album: '',
    country: '',
    coverFile: null,
    restoredAudioUrl: '',
  }),
  actions: {
    setCurrentStep(step) {
      this.currentStep = step;
    },
    setFiles(files) {
      this.files = files;
    },
    setTitle(title) {
      this.title = title;
    },
    setAuthor(author) {
      this.author = author;
    },
    setYear(year) {
      this.year = year;
    },
    setAlbum(album) {
      this.album = album;
    },
    setCountry(country) {
      this.country = country;
    },
    setCoverFile(file) {
      this.coverFile = file;
    },
    setRestoredAudioUrl(url) {
      this.restoredAudioUrl = url;
    },
    reset() {
      this.currentStep = 1;
      this.files = [];
      this.title = '';
      this.author = '';
      this.year = '';
      this.album = '';
      this.country = '';
      this.coverFile = null;
      this.restoredAudioUrl = '';
    },
  },
});
