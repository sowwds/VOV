import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { useTrackStore } from '@/store/track';
import { trackService } from '@/services/trackService';

export const usePlayerStore = defineStore('player', () => {
    const trackStore     = useTrackStore();
    const queue          = ref([]);      // массив trackId
    const currentTrackId = ref(null);
    const isPlaying      = ref(false);
    const loopMode       = ref('none');  // none | all | one
    const shuffleActive  = ref(false);
    const audioElement   = ref(null);

    const currentIndex = computed(() =>
        queue.value.findIndex(id => id === currentTrackId.value)
    );

    const currentTrack = computed(() => {
        if (!currentTrackId.value) return null;
        const all = [
            ...trackStore.userLibrary,
            ...trackStore.topPlays,
            ...trackStore.topLikes,
            ...trackStore.newTracks,
            ...trackStore.searchResults,
        ];
        const t = all.find(x => x.trackId === currentTrackId.value);
        if (!t) return null;
        return {
            ...t,
            streamUrl: trackService.getStreamUrl(t.trackId),
        };
    });

    const queueTracks = computed(() =>
        queue.value
            .map(id => {
                const t = [
                    ...trackStore.userLibrary,
                    ...trackStore.topPlays,
                    ...trackStore.topLikes,
                    ...trackStore.newTracks,
                    ...trackStore.searchResults,
                ].find(x => x.trackId === id);
                return t ? { ...t, streamUrl: trackService.getStreamUrl(t.trackId) } : null;
            })
            .filter(Boolean)
    );

    function setAudioElement(el) {
        audioElement.value = el;
        if (!el) return;
        el.onended = () => nextTrack();
        el.onplay  = () => (isPlaying.value = true);
        el.onpause = () => (isPlaying.value = false);
    }

    async function setCurrentTrack(trackId) {
        // подгрузим метаданные, если нужно
        const exists = [
            ...trackStore.userLibrary,
            ...trackStore.topPlays,
            ...trackStore.topLikes,
            ...trackStore.newTracks,
            ...trackStore.searchResults,
        ].some(x => x.trackId === trackId);
        if (!exists) {
            const md = await trackService.getTrackMetadata(trackId);
            trackStore.searchResults.push(md);
        }

        currentTrackId.value = trackId;
        if (!queue.value.includes(trackId)) {
            queue.value.unshift(trackId);
        }

        await nextTick();
        if (audioElement.value && currentTrack.value) {
            audioElement.value.src = currentTrack.value.streamUrl;
            if (isPlaying.value) audioElement.value.play().catch(console.error);
        }
    }

    async function playTrack(trackId) {
        await setCurrentTrack(trackId);
        play();
    }

    function play() {
        if (audioElement.value && currentTrack.value) {
            audioElement.value.play();
            isPlaying.value = true;
        }
    }

    function pause() {
        if (audioElement.value) {
            audioElement.value.pause();
            isPlaying.value = false;
        }
    }

    async function togglePlay(trackId = null) {
        if (trackId && trackId !== currentTrackId.value) {
            await playTrack(trackId);
        } else {
            isPlaying.value ? pause() : play();
        }
    }

    function nextTrack() {
        if (shuffleActive.value) {
            const idx = Math.floor(Math.random() * queue.value.length);
            return playTrack(queue.value[idx]);
        }
        if (currentIndex.value < 0) return;
        if (currentIndex.value === queue.value.length - 1) {
            return loopMode.value === 'all'
                ? playTrack(queue.value[0])
                : pause();
        }
        playTrack(queue.value[currentIndex.value + 1]);
    }

    function prevTrack() {
        if (currentIndex.value > 0) {
            return playTrack(queue.value[currentIndex.value - 1]);
        }
        if (audioElement.value) audioElement.value.currentTime = 0;
    }

    function toggleLoopMode() {
        loopMode.value = loopMode.value === 'none'
            ? 'all'
            : loopMode.value === 'all'
                ? 'one'
                : 'none';
        if (audioElement.value) {
            audioElement.value.loop = loopMode.value === 'one';
        }
    }

    function toggleShuffle() {
        shuffleActive.value = !shuffleActive.value;
    }

    async function enqueue(trackId) {
        if (!queue.value.includes(trackId)) {
            queue.value.push(trackId);
            await setCurrentTrack(trackId);
        }
    }

    async function enqueueNext(trackId) {
        if (!queue.value.includes(trackId)) {
            const i = currentIndex.value;
            queue.value.splice(i < 0 ? queue.value.length : i + 1, 0, trackId);
            await setCurrentTrack(trackId);
        }
    }

    function dequeue(trackId) {
        queue.value = queue.value.filter(x => x !== trackId);
    }

    function clearQueue() {
        queue.value = [];
    }

    function moveInQueue(a, b) {
        if (
            a < 0 ||
            b < 0 ||
            a >= queue.value.length ||
            b >= queue.value.length
        ) return;
        const [x] = queue.value.splice(a, 1);
        queue.value.splice(b, 0, x);
    }

    return {
        queue,
        currentTrackId,
        isPlaying,
        loopMode,
        shuffleActive,
        audioElement,
        currentTrack,
        queueTracks,
        currentIndex,
        setAudioElement,
        playTrack,
        play,
        pause,
        togglePlay,
        nextTrack,
        prevTrack,
        toggleLoopMode,
        toggleShuffle,
        enqueue,
        enqueueNext,
        dequeue,
        clearQueue,
        moveInQueue,
    };
});
