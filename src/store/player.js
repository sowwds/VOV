import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlayerStore = defineStore('player', () => {
    const tracks = ref([]); // Список загруженных треков
    const currentTrack = ref(null); // Текущий трек
    const isPlaying = ref(false); // Состояние воспроизведения

    function addTrack(track) {
        tracks.value.push(track);
    }

    function setCurrentTrack(track) {
        currentTrack.value = track;
    }

    function togglePlay() {
        isPlaying.value = !isPlaying.value;
    }

    return { tracks, currentTrack, isPlaying, addTrack, setCurrentTrack, togglePlay };
});