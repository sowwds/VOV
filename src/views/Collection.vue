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
import {useParserStore} from "@/store/parser.js";
import { computed } from 'vue';

const playerStore = usePlayerStore();
const parserStore = useParserStore();
const tracks = computed(() => playerStore.tracks);

async function handleFileUpload(event) {
  const files = event.target.files
  if (!files.length) return

  try {
    const parsedTracks = await parserStore.parseAudioFiles(files)
    playerStore.addTracks(parsedTracks) // Добавим метод addTracks в playerStore
  } catch (error) {
    console.error('Error processing files:', error)
  } finally {
    // Сброс значения input, чтобы можно было загружать те же файлы снова
    event.target.value = ''
  }
}

function onPlay(id) {
  const track = playerStore.tracks.find((t) => t.id === id);
  if (track) {
    playerStore.setCurrentTrack(track);
    playerStore.togglePlay();
  }
}
</script>