// src/store/player.js
import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { useTrackStore }            from '@/store/track';
import { trackService }             from '@/services/trackService';

export const usePlayerStore = defineStore('player', () => {
    const trackStore     = useTrackStore();
    const queue          = ref([]);
    const currentTrackId = ref(null);
    const isPlaying      = ref(false);
    const loopMode       = ref('none'); // 'none' | 'all' | 'one'
    const shuffleActive  = ref(false);
    const audioElement   = ref(null);

    const currentIndex = computed(() =>
        queue.value.findIndex(id => id === currentTrackId.value)
    );

    // Строим текущий трек из trackStore по trackid
    const currentTrack = computed(() => {
        if (!currentTrackId.value) return null;
        const all = [
            ...trackStore.userLibrary,
            ...trackStore.topPlays,
            ...trackStore.topLikes,
            ...trackStore.newTracks,
            ...trackStore.searchResults,
        ];
        const t = all.find(x => x.trackid === currentTrackId.value);
        if (!t) return null;
        return {
            trackid:   t.trackid,
            title:     t.title,
            author:    t.author,
            album:     t.album,
            year:      t.year,
            country:   t.country,
            coverurl:  t.coverurl,
            likes:     t.likes,
            playcount: t.playcount,
            streamUrl: trackService.getStreamUrl(t.trackid),
        };
    });

    // Строим очередь объектов из массива trackid
    const queueTracks = computed(() =>
        queue.value
            .map(id => {
                const t = [
                    ...trackStore.userLibrary,
                    ...trackStore.topPlays,
                    ...trackStore.topLikes,
                    ...trackStore.newTracks,
                    ...trackStore.searchResults,
                ].find(x => x.trackid === id);
                return t
                    ? { ...t, streamUrl: trackService.getStreamUrl(t.trackid) }
                    : null;
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

    async function setCurrentTrack(trackid) {
        // если нет метаданных — запрашиваем
        if (![...trackStore.userLibrary,
            ...trackStore.topPlays,
            ...trackStore.topLikes,
            ...trackStore.newTracks,
            ...trackStore.searchResults
        ].some(x => x.trackid === trackid)) {
            const md = await trackService.getTrackMetadata(trackid);
            trackStore.searchResults.push(md);
        }

        currentTrackId.value = trackid;
        if (!queue.value.includes(trackid)) {
            queue.value.unshift(trackid);
        }

        await nextTick();
        if (audioElement.value && currentTrack.value) {
            audioElement.value.src = currentTrack.value.streamUrl;
            if (isPlaying.value) audioElement.value.play().catch(console.error);
        }
    }

    async function playTrack(trackid) {
        await setCurrentTrack(trackid);
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

    async function togglePlay(trackid = null) {
        if (trackid && trackid !== currentTrackId.value) {
            await playTrack(trackid);
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
        // если у нас первый — просто сбрасываем в начало
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

    async function enqueue(trackid) {
        if (!queue.value.includes(trackid)) {
            queue.value.push(trackid);
            await setCurrentTrack(trackid); // подгрузка метаданных
        }
    }

    async function enqueueNext(trackid) {
        if (!queue.value.includes(trackid)) {
            const i = currentIndex.value;
            queue.value.splice(i < 0 ? queue.value.length : i + 1, 0, trackid);
            await setCurrentTrack(trackid);
        }
    }

    function dequeue(trackid) {
        queue.value = queue.value.filter(x => x !== trackid);
    }

    function clearQueue() {
        queue.value = [];
    }

    function moveInQueue(a, b) {
        if (a < 0 || b < 0 || a >= queue.value.length || b >= queue.value.length) return;
        const [x] = queue.value.splice(a, 1);
        queue.value.splice(b, 0, x);
    }

    return {
        queue, currentTrackId, isPlaying, loopMode, shuffleActive, audioElement,
        currentTrack, queueTracks, currentIndex,
        setAudioElement, playTrack, play, pause, togglePlay,
        nextTrack, prevTrack, toggleLoopMode, toggleShuffle,
        enqueue, enqueueNext, dequeue, clearQueue, moveInQueue,
    };
});
