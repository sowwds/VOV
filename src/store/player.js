// src/store/player.js
import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { useTrackStore } from '@/store/track'
import { trackService } from '@/services/trackService'

export const usePlayerStore = defineStore('player', () => {
    const trackStore     = useTrackStore()
    const baseQueue      = ref([])    // очередь из раздела
    const customQueue    = ref([])    // «на лету» добавленные треки
    const currentTrackId = ref(null)
    const isPlaying      = ref(false)
    const loopMode       = ref('none')
    const shuffleActive  = ref(false)
    const audioElement   = ref(null)
    const skipQueueOnPlay = ref(false)

    const currentTrack = computed(() => {
        if (!currentTrackId.value) return null
        // ищем в любом списке
        const all = [
            ...trackStore.userLibrary,
            ...trackStore.topPlays,
            ...trackStore.topLikes,
            ...trackStore.newTracks,
            ...trackStore.searchResults
        ]
        const t = all.find(x => x.trackId === currentTrackId.value)
        return t
            ? { ...t, streamUrl: trackService.getStreamUrl(t.trackId) }
            : null
    })

    // Общий плейлист: current → custom → base без дубликатов
    const queueTracks = computed(() => {
        const seen = new Set()
        const result = []
        if (currentTrackId.value) {
            result.push(currentTrackId.value)
            seen.add(currentTrackId.value)
        }
        for (const id of customQueue.value) {
            if (!seen.has(id)) { result.push(id); seen.add(id) }
        }
        for (const id of baseQueue.value) {
            if (!seen.has(id)) { result.push(id); seen.add(id) }
        }
        return result
    })

    const currentIndex = computed(() =>
        queueTracks.value.findIndex(id => id === currentTrackId.value)
    )

    function setAudioElement(el) {
        audioElement.value = el
        if (!el) return
        el.onended = () => nextTrack()
        el.onplay  = () => (isPlaying.value = true)
        el.onpause = () => (isPlaying.value = false)
    }

    /**
     * Загружает первые `limit` треков из указанного раздела trackStore
     * в базовую очередь.
     */
    async function loadBaseQueueFrom(section, limit = 10) {
        // убедимся, что раздел загружен
        switch (section) {
            case 'userLibrary':
                await trackStore.fetchUserLibrary()
                break
            case 'topPlays':
                await trackStore.fetchTopPlays(limit)
                break
            case 'topLikes':
                await trackStore.fetchTopLikes(limit)
                break
            case 'newTracks':
                await trackStore.fetchNewTracks(limit)
                break
            // для searchResults считаем, что store.searchResults уже актуален
        }
        // выберем из того же store нужный массив
        const arr = (trackStore[section] || []).slice(0, limit).map(t => t.trackId)
        baseQueue.value   = arr
        customQueue.value = []
    }

    async function setCurrent(trackId) {
        // Проверка: если трек уже текущий, ничего не делаем
        if (currentTrackId.value === trackId && audioElement.value?.src === trackService.getStreamUrl(trackId)) {
            return;
        }

        // Если трек не в списках, подтянем метаданные
        if (![...trackStore.userLibrary,
            ...trackStore.topPlays,
            ...trackStore.topLikes,
            ...trackStore.newTracks,
            ...trackStore.searchResults
        ].some(x => x.trackId === trackId)) {
            const md = await trackService.getTrackMetadata(trackId);
            trackStore.searchResults.push(md);
        }

        currentTrackId.value = trackId;
        await nextTick();
        if (audioElement.value) {
            audioElement.value.src = trackService.getStreamUrl(trackId);
            if (isPlaying.value) audioElement.value.play().catch(console.error);
        }
    }

    /**
     * @param {string} trackId — какой трек запустили
     * @param {string} section — из какого раздела он
     */
    async function playTrack(trackId, section = 'newTracks', { skipQueue = false } = {}) {
        console.log(`playTrack called: trackId=${trackId}, section=${section}, skipQueue=${skipQueue}`);

        // Если это тот же трек и он уже играет, ничего не делаем
        if (currentTrackId.value === trackId && isPlaying.value && audioElement.value?.src === trackService.getStreamUrl(trackId)) {
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
        if (audioElement.value) {
            audioElement.value.play()
            isPlaying.value = true
        }
    }

    function pause() {
        if (audioElement.value) {
            audioElement.value.pause()
            isPlaying.value = false
        }
    }

    function togglePlay(trackId = null) {
        if (trackId && trackId !== currentTrackId.value) {
            playTrack(trackId)
        } else {
            isPlaying.value ? pause() : play()
        }
    }

    function nextTrack() {
        const oldId = currentTrackId.value
        const idx   = currentIndex.value
        if (idx < 0) return

        // 1) Определяем новый трек
        let newId
        if (shuffleActive.value) {
            newId = queueTracks.value[Math.floor(Math.random() * queueTracks.value.length)]
        } else if (idx === queueTracks.value.length - 1) {
            if (loopMode.value === 'all') {
                newId = queueTracks.value[0]
            } else {
                return pause()
            }
        } else {
            newId = queueTracks.value[idx + 1]
        }

        // 2) Если есть пользовательская очередь — зацикливаем её
        if (customQueue.value.length > 0) {
            // удаляем старый (если он там был — filter ничего не изменит, если не был)
            customQueue.value = customQueue.value.filter(id => id !== oldId)
            // при loop all — возвращаем его в конец
            if (loopMode.value === 'all') {
                customQueue.value.push(oldId)
            }
        } else {
            // иначе — зацикливаем базовую
            baseQueue.value = baseQueue.value.filter(id => id !== oldId)
            if (loopMode.value === 'all') {
                baseQueue.value.push(oldId)
            }
        }

        // 3) Переключаемся на следующий
        playTrack(newId)
    }

    function prevTrack() {
        const idx = currentIndex.value
        if (idx > 0) return playTrack(queueTracks.value[idx - 1])
        if (audioElement.value) audioElement.value.currentTime = 0
    }

    function toggleLoopMode() {
        loopMode.value = loopMode.value === 'none' ? 'all'
            : loopMode.value === 'all'  ? 'one' : 'none'
        if (audioElement.value) audioElement.value.loop = (loopMode.value === 'one')
    }

    function toggleShuffle() {
        shuffleActive.value = !shuffleActive.value
    }

    function enqueue(trackId) {
        if (!customQueue.value.includes(trackId)) {
            customQueue.value.push(trackId)
        }
    }

    function enqueueNext(trackId) {
        if (!customQueue.value.includes(trackId)) {
            customQueue.value.unshift(trackId)
        }
    }

    function dequeue(trackId) {
        customQueue.value = customQueue.value.filter(x => x !== trackId)
        baseQueue.value   = baseQueue.value.filter(x => x !== trackId)
    }

    function clearQueue() {
        customQueue.value    = []
        baseQueue.value      = []
        currentTrackId.value = null
        isPlaying.value      = false
    }

    function moveInQueue(a, b) {
        const q = customQueue.value
        if (a < 0 || b < 0 || a >= q.length || b >= q.length) return
        const [item] = q.splice(a, 1)
        q.splice(b, 0, item)
    }

    return {
        currentTrack,
        baseQueue, customQueue,
        currentTrackId, isPlaying, loopMode, shuffleActive, audioElement,
        queueTracks, currentIndex,
        setAudioElement, loadBaseQueueFrom,
        playTrack, play, pause, togglePlay,
        nextTrack, prevTrack, toggleLoopMode, toggleShuffle,
        enqueue, enqueueNext, dequeue, clearQueue, moveInQueue
    }
})
