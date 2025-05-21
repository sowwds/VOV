import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { useTrackStore } from '@/store/track';
import { trackService } from '@/services/trackService';
import { throttle } from 'lodash';

export const usePlayerStore = defineStore('player', () => {
    const trackStore = useTrackStore();
    const baseQueue = ref([]); // Queue from a section
    const customQueue = ref([]); // Tracks added on-the-fly
    const currentTrackId = ref(null);
    const isPlaying = ref(false);
    const loopMode = ref('none');
    const shuffleActive = ref(false);
    const audioElement = ref(null);
    const skipQueueOnPlay = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const volume = ref(0.5);
    const isMuted = ref(false);
    const bufferedProgress = ref(0);

    // Cache tracks to avoid repeated searches
    const trackMap = computed(() => {
        const map = new Map();
        [
            ...trackStore.userLibrary,
            ...trackStore.topPlays,
            ...trackStore.topLikes,
            ...trackStore.newTracks,
            ...trackStore.searchResults,
        ].forEach((track) => map.set(track.trackId, track));
        return map;
    });

    const currentTrack = computed(() => {
        if (!currentTrackId.value) return null;
        const track = trackMap.value.get(currentTrackId.value);
        return track
            ? { ...track, streamUrl: trackService.getStreamUrl(track.trackId) || '' }
            : null;
    });

    // Combine customQueue and baseQueue, ensuring no duplicates
    const queueTracks = computed({
        get: () => {
            const seen = new Set();
            const result = [];
            if (currentTrackId.value) {
                result.push(currentTrackId.value);
                seen.add(currentTrackId.value);
            }
            for (const id of customQueue.value) {
                if (!seen.has(id)) {
                    result.push(id);
                    seen.add(id);
                }
            }
            for (const id of baseQueue.value) {
                if (!seen.has(id)) {
                    result.push(id);
                    seen.add(id);
                }
            }
            return result;
        },
        set: (newQueue) => {
            // Split newQueue into customQueue and baseQueue
            const customIds = customQueue.value.filter((id) => newQueue.includes(id));
            const baseIds = baseQueue.value.filter((id) => newQueue.includes(id));
            const newIds = newQueue.filter(
                (id) => !customIds.includes(id) && !baseIds.includes(id)
            );

            // Preserve order from newQueue
            customQueue.value = newQueue.filter((id) => customIds.includes(id));
            baseQueue.value = newQueue.filter((id) => baseIds.includes(id) || newIds.includes(id));
        },
    });

    const currentIndex = computed(() =>
        queueTracks.value.findIndex((id) => id === currentTrackId.value)
    );

    function setAudioElement(el) {
        if (audioElement.value) {
            // Очистка предыдущих обработчиков
            audioElement.value.onloadedmetadata = null;
            audioElement.value.ontimeupdate = null;
            audioElement.value.onprogress = null;
            audioElement.value.onended = null;
            audioElement.value.onplay = null;
            audioElement.value.onpause = null;
        }

        audioElement.value = el;
        if (!el) return;

        // Инициализация audio
        el.volume = isMuted.value ? 0 : volume.value;
        el.loop = loopMode.value === 'one';

        el.onloadedmetadata = () => {
            duration.value = el.duration || 0;
            currentTime.value = 0;
        };

        el.ontimeupdate = throttle(() => {
            currentTime.value = el.currentTime;
            if (el.buffered.length > 0 && duration.value > 0) {
                const bufferedEnd = el.buffered.end(el.buffered.length - 1);
                bufferedProgress.value = (bufferedEnd / duration.value) * 100;
            }
        }, 200);

        el.onprogress = throttle(() => {
            if (el.buffered.length > 0 && duration.value > 0) {
                const bufferedEnd = el.buffered.end(el.buffered.length - 1);
                bufferedProgress.value = (bufferedEnd / duration.value) * 100;
            }
        }, 200);

        el.onended = () => {
            if (loopMode.value !== 'one') {
                nextTrack();
            }
        };

        el.onplay = () => (isPlaying.value = true);
        el.onpause = () => (isPlaying.value = false);
    }

    async function loadBaseQueueFrom(section, limit = 10) {
        switch (section) {
            case 'userLibrary':
                await trackStore.fetchUserLibrary();
                break;
            case 'topPlays':
                await trackStore.fetchTopPlays(limit);
                break;
            case 'topLikes':
                await trackStore.fetchTopLikes(limit);
                break;
            case 'newTracks':
                await trackStore.fetchNewTracks(limit);
                break;
        }
        const arr = (trackStore[section] || [])
            .slice(0, limit)
            .map((t) => t.trackId);
        baseQueue.value = arr;
        if (skipQueueOnPlay.value) customQueue.value = [];
    }

    async function setCurrent(trackId) {
        if (
            currentTrackId.value === trackId &&
            audioElement.value?.src === trackService.getStreamUrl(trackId)
        ) {
            return;
        }

        if (!trackMap.value.has(trackId)) {
            try {
                const md = await trackService.getTrackMetadata(trackId);
                trackStore.searchResults.push(md);
            } catch (error) {
                console.error(`Failed to fetch metadata for track ${trackId}:`, error);
                return;
            }
        }

        currentTrackId.value = trackId;
        await nextTick();
        if (audioElement.value) {
            try {
                audioElement.value.src = trackService.getStreamUrl(trackId) || '';
                if (isPlaying.value) audioElement.value.play().catch(console.error);
            } catch (error) {
                console.error(`Failed to load stream for track ${trackId}:`, error);
            }
        }
    }

    async function playTrack(trackId, section = 'newTracks', { skipQueue = false } = {}) {
        console.log(`playTrack: trackId=${trackId}, section=${section}, skipQueue=${skipQueue}`);
        if (
            currentTrackId.value === trackId &&
            isPlaying.value &&
            audioElement.value?.src === trackService.getStreamUrl(trackId)
        ) {
            return;
        }

        skipQueueOnPlay.value = skipQueue;
        if (skipQueue) {
            customQueue.value = [];
            await loadBaseQueueFrom(section);
        } else if (!currentTrackId.value) {
            await loadBaseQueueFrom(section);
        }

        await setCurrent(trackId);
        play();
    }

    function play() {
        if (audioElement.value && audioElement.value.src) {
            audioElement.value.play().catch(console.error);
            isPlaying.value = true;
        }
    }

    function pause() {
        if (audioElement.value) {
            audioElement.value.pause();
            isPlaying.value = false;
        }
    }

    function togglePlay(trackId = null) {
        if (trackId && trackId !== currentTrackId.value) {
            playTrack(trackId);
        } else {
            isPlaying.value ? pause() : play();
        }
    }

    function nextTrack() {
        const idx = currentIndex.value;
        if (idx < 0) return;

        let newId;
        if (shuffleActive.value) {
            newId = queueTracks.value[Math.floor(Math.random() * queueTracks.value.length)];
        } else if (idx === queueTracks.value.length - 1) {
            if (loopMode.value === 'all') {
                newId = queueTracks.value[0];
            } else {
                return pause();
            }
        } else {
            newId = queueTracks.value[idx + 1];
        }

        if (customQueue.value.length > 0) {
            customQueue.value = customQueue.value.filter((id) => id !== currentTrackId.value);
            if (loopMode.value === 'all') {
                customQueue.value.push(currentTrackId.value);
            }
        } else {
            baseQueue.value = baseQueue.value.filter((id) => id !== currentTrackId.value);
            if (loopMode.value === 'all') {
                baseQueue.value.push(currentTrackId.value);
            }
        }

        if (newId) playTrack(newId);
    }

    function prevTrack() {
        const idx = currentIndex.value;
        if (idx > 0) {
            playTrack(queueTracks.value[idx - 1]);
        } else if (audioElement.value) {
            audioElement.value.currentTime = 0;
        }
    }

    function toggleLoopMode() {
        loopMode.value =
            loopMode.value === 'none' ? 'all' : loopMode.value === 'all' ? 'one' : 'none';
        if (audioElement.value) audioElement.value.loop = loopMode.value === 'one';
    }

    function toggleShuffle() {
        shuffleActive.value = !shuffleActive.value;
    }

    function enqueue(trackId) {
        if (!customQueue.value.includes(trackId)) {
            customQueue.value.push(trackId);
        }
    }

    function enqueueNext(trackId) {
        if (!customQueue.value.includes(trackId)) {
            customQueue.value.unshift(trackId);
        }
    }

    function dequeue(trackId) {
        customQueue.value = customQueue.value.filter((x) => x !== trackId);
        baseQueue.value = baseQueue.value.filter((x) => x !== trackId);
    }

    function clearQueue() {
        customQueue.value = [];
        baseQueue.value = [];
        currentTrackId.value = null;
        isPlaying.value = false;
        if (audioElement.value) audioElement.value.src = '';
    }

    function moveInCustomQueue(fromIndex, toIndex) {
        if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= customQueue.value.length ||
            toIndex >= customQueue.value.length
        ) {
            return;
        }
        const newQueue = [...customQueue.value];
        const [item] = newQueue.splice(fromIndex, 1);
        newQueue.splice(toIndex, 0, item);
        customQueue.value = newQueue;
    }

    function moveInBaseQueue(fromIndex, toIndex) {
        if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= baseQueue.value.length ||
            toIndex >= baseQueue.value.length
        ) {
            return;
        }
        const newQueue = [...baseQueue.value];
        const [item] = newQueue.splice(fromIndex, 1);
        newQueue.splice(toIndex, 0, item);
        baseQueue.value = newQueue;
    }

    function updateVolume(newVolume) {
        volume.value = newVolume;
        isMuted.value = newVolume === 0;
        if (audioElement.value) {
            audioElement.value.volume = isMuted.value ? 0 : volume.value;
        }
    }

    function toggleMute() {
        isMuted.value = !isMuted.value;
        if (audioElement.value) {
            audioElement.value.volume = isMuted.value ? 0 : volume.value;
        }
    }

    function seek(time) {
        if (audioElement.value) {
            audioElement.value.currentTime = time;
            currentTime.value = time;
        }
    }

    return {
        currentTrack,
        baseQueue,
        customQueue,
        currentTrackId,
        isPlaying,
        loopMode,
        shuffleActive,
        audioElement,
        queueTracks,
        currentIndex,
        currentTime,
        duration,
        volume,
        isMuted,
        bufferedProgress,
        setAudioElement,
        loadBaseQueueFrom,
        moveInBaseQueue,
        moveInCustomQueue,
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
        updateVolume,
        toggleMute,
        seek,
    };
});