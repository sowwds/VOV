<template>
  <div class="flex-1 flex flex-col min-h-0">
    <div class="flex-1 overflow-auto p-6 transition-colors duration-150">
      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Коллекция</h1>
      <div class="mb-4">
        <input
            type="file"
            accept="audio/*"
            multiple
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-light-primary dark:file:bg-dark-primary file:text-white hover:file:bg-opacity-80"
        />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 2xl:grid-cols-8 gap-4">
        <TrackCard
            v-for="track in tracks"
            :key="track.id"
            :track="track"
            @play="onPlay"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import TrackCard from '@/components/TrackCard.vue';
import { usePlayerStore } from '@/store/player';
import jsmediatags from 'jsmediatags';
import { computed } from 'vue';

const playerStore = usePlayerStore();
const tracks = computed(() => playerStore.tracks);

let trackIdCounter = 1;

function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    jsmediatags.read(file, {
      onSuccess: (tag) => {
        const { title, artist, picture } = tag.tags;
        let imageUrl = null;

        if (picture) {
          const base64String = btoa(
              picture.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          imageUrl = `data:${picture.format};base64,${base64String}`;
        }

        const newTrack = {
          id: trackIdCounter++,
          title: title || file.name,
          artist: artist || 'Unknown Artist',
          imageUrl: imageUrl,
          file,
        };

        playerStore.addTrack(newTrack);
      },
      onError: (error) => {
        console.error('Ошибка парсинга метаданных:', error);
        const newTrack = {
          id: trackIdCounter++,
          title: file.name,
          artist: 'Unknown Artist',
          imageUrl: null,
          file,
        };
        playerStore.addTrack(newTrack);
      },
    });
  });
}

function onPlay(id) {
  const track = playerStore.tracks.find((t) => t.id === id);
  if (track) {
    playerStore.setCurrentTrack(track);
    playerStore.togglePlay();
  }
}
</script>