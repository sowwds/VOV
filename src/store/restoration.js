import { defineStore } from 'pinia';
import jsmediatags from 'jsmediatags';

export const useRestorationStore = defineStore('restoration', {
  state: () => ({
    currentStep: 1,
    file: null,
    trackId: null,
    title: '',
    author: '',
    year: '',
    album: '',
    country: '',
    coverUrl: null,
  }),
  actions: {
    setCurrentStep(step) {
      this.currentStep = step;
    },
    setFile(file) {
      this.file = file;
    },
    setTrackId(trackId) {
      this.trackId = trackId;
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
    setCoverUrl(url) {
      this.coverUrl = url;
    },
    async parseAudioMetadata(file) {
      if (!file) return;
      try {
        const tags = await new Promise((resolve, reject) => {
          jsmediatags.read(file, {
            onSuccess: (tag) => resolve(tag.tags),
            onError: (error) => reject(error),
          });
        });
        this.setTitle(tags.title || '');
        this.setAuthor(tags.artist || '');
        this.setYear(tags.year || '');
        this.setAlbum(tags.album || '');

        if (tags.picture) {
          // Преобразуем массив байтов в строку безопасным способом
          const dataArray = new Uint8Array(tags.picture.data);
          const chunkSize = 0x8000; // Обрабатываем данные кусками по 32,768 байт
          let binaryString = '';
          for (let i = 0; i < dataArray.length; i += chunkSize) {
            const chunk = dataArray.subarray(i, i + chunkSize);
            binaryString += String.fromCharCode.apply(null, chunk);
          }
          // Кодируем в base64
          const base64String = btoa(binaryString);
          this.setCoverUrl(`data:${tags.picture.format};base64,${base64String}`);
        } else {
          this.setCoverUrl(null);
        }
        //aasdf
      } catch (error) {
        console.error('Ошибка парсинга метаданных:', error);
        this.setTitle('');
        this.setAuthor('');
        this.setYear('');
        this.setAlbum('');
        this.setCoverUrl(null);
      }
    },
    reset() {
      this.currentStep = 1;
      this.file = null;
      this.trackId = null;
      this.title = '';
      this.author = '';
      this.year = '';
      this.album = '';
      this.country = '';
      this.coverUrl = null;
    },
  },
});
