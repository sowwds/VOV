import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { trackService } from '@/services/trackService';
import { useTrackStore } from '@/store/track';

export const usePlayerStore = defineStore('player', () => {
    // Ссылка на store треков
    const trackStore = useTrackStore();

    // Массив ID треков в очереди воспроизведения
    const queue = ref([]);
    // ID текущего трека
    const currentTrackId = ref(null);
    // Состояние воспроизведения
    const isPlaying = ref(false);
    // Режим повтора: 'none' | 'all' | 'one'
    const loopMode = ref('none');
    // Состояние перемешивания
    const shuffleActive = ref(false);
    // Элемент <audio>
    const audioElement = ref(null);

    // Вычисляем индекс текущего трека в очереди
    const currentIndex = computed(() => queue.value.findIndex(id => id === currentTrackId.value));

    // Получаем объект текущего трека
    const currentTrack = computed(() => {
        if (!currentTrackId.value) return null;
        // Ищем трек в trackStore (userLibrary, topPlays, topLikes, newTracks, searchResults)
        const sources = [
            ...trackStore.userLibrary,
            ...trackStore.topPlays,
            ...trackStore.topLikes,
            ...trackStore.newTracks,
            ...trackStore.searchResults,
        ];
        const track = sources.find(t => t.trackId === currentTrackId.value);
        if (!track) return null;
        return {
            id: track.trackId,
            title: track.title,
            author: track.author,
            album: track.album,
            year: track.year,
            country: track.country,
            coverUrl: track.coverUrl,
            streamUrl: trackService.getStreamUrl(track.trackId, 'processed'),
            likes: track.likes,
            playCount: track.playCount,
        };
    });

    // Получаем треки в очереди
    const queueTracks = computed(() =>
        queue.value
            .map(id => {
                const sources = [
                    ...trackStore.userLibrary,
                    ...trackStore.topPlays,
                    ...trackStore.topLikes,
                    ...trackStore.newTracks,
                    ...trackStore.searchResults,
                ];
                const track = sources.find(t => t.trackId === id);
                return track
                    ? {
                        id: track.trackId,
                        title: track.title,
                        author: track.author,
                        album: track.album,
                        year: track.year,
                        country: track.country,
                        coverUrl: track.coverUrl,
                        streamUrl: trackService.getStreamUrl(track.trackId, 'processed'),
                        likes: track.likes,
                        playCount: track.playCount,
                    }
                    : null;
            })
            .filter(Boolean)
    );

    // Установить <audio> элемент
    function setAudioElement(element) {
        audioElement.value = element;
        if (element) {
            // Обработчики событий для <audio>
            element.onended = () => nextTrack();
            element.onplay = () => (isPlaying.value = true);
            element.onpause = () => (isPlaying.value = false);
        }
    }

    // Добавить трек в очередь
    async function addTrack(trackId) {
        if (!queue.value.includes(trackId)) {
            queue.value.push(trackId);
            // Убедимся, что метаданные трека есть в trackStore
            const sources = [
                ...trackStore.userLibrary,
                ...trackStore.topPlays,
                ...trackStore.topLikes,
                ...trackStore.newTracks,
                ...trackStore.searchResults,
            ];
            if (!sources.some(t => t.trackId === trackId)) {
                try {
                    const metadata = await trackService.getTrackMetadata(trackId);
                    trackStore.searchResults.push(metadata); // Добавляем в searchResults как временное хранилище
                } catch (error) {
                    console.error('Ошибка загрузки метаданных трека:', error);
                }
            }
        }
    }

    // Добавить несколько треков в очередь
    async function addTracks(trackIds) {
        for (const trackId of trackIds) {
            await addTrack(trackId);
        }
    }

    // Установить текущий трек
    async function setCurrentTrack(trackId) {
        try {
            // Убедимся, что метаданные трека доступны
            const sources = [
                ...trackStore.userLibrary,
                ...trackStore.topPlays,
                ...trackStore.topLikes,
                ...trackStore.newTracks,
                ...trackStore.searchResults,
            ];
            if (!sources.some(t => t.trackId === trackId)) {
                const metadata = await trackService.getTrackMetadata(trackId);
                trackStore.searchResults.push(metadata);
            }
            currentTrackId.value = trackId;
            if (!queue.value.includes(trackId)) {
                queue.value.unshift(trackId);
            }
            // Обновляем src в audioElement
            if (audioElement.value && currentTrack.value) {
                audioElement.value.src = currentTrack.value.streamUrl;
                if (isPlaying.value) {
                    audioElement.value.play();
                }
            }
        } catch (error) {
            console.error('Ошибка установки текущего трека:', error);
        }
    }

    // Воспроизвести трек
    async function playTrack(trackId) {
        await setCurrentTrack(trackId);
        play();
    }

    // Начать воспроизведение
    function play() {
        if (audioElement.value && currentTrack.value) {
            audioElement.value.play();
            isPlaying.value = true;
        }
    }

    // Поставить на паузу
    function pause() {
        if (audioElement.value) {
            audioElement.value.pause();
            isPlaying.value = false;
        }
    }

    // Переключить воспроизведение/паузу
    async function togglePlay(trackId = null) {
        if (trackId && trackId !== currentTrackId.value) {
            await playTrack(trackId);
        } else if (isPlaying.value) {
            pause();
        } else {
            play();
        }
    }

    // Переключить режим повтора
    function toggleLoopMode() {
        if (loopMode.value === 'none') {
            loopMode.value = 'all';
        } else if (loopMode.value === 'all') {
            loopMode.value = 'one';
        } else {
            loopMode.value = 'none';
        }
        if (audioElement.value) {
            audioElement.value.loop = loopMode.value === 'one';
        }
    }

    // Перейти к следующему треку
    function nextTrack() {
        if (currentIndex.value === -1) return;

        if (shuffleActive.value) {
            playRandomTrack();
            return;
        }

        if (currentIndex.value >= queue.value.length - 1) {
            if (loopMode.value === 'all') {
                const firstTrackId = queue.value[0];
                if (firstTrackId) playTrack(firstTrackId);
            } else {
                pause();
            }
            return;
        }

        const nextTrackId = queue.value[currentIndex.value + 1];
        if (nextTrackId) playTrack(nextTrackId);
    }

    // Перейти к предыдущему треку
    function prevTrack() {
        if (currentIndex.value <= 0) {
            if (currentTrackId.value) {
                playTrack(currentTrackId.value);
                if (audioElement.value) audioElement.value.currentTime = 0;
            }
            return;
        }

        const prevTrackId = queue.value[currentIndex.value - 1];
        if (prevTrackId) playTrack(prevTrackId);
    }

    // Воспроизвести случайный трек
    function playRandomTrack() {
        if (queue.value.length === 0) return;
        const randomIndex = Math.floor(Math.random() * queue.value.length);
        const randomTrackId = queue.value[randomIndex];
        if (randomTrackId) playTrack(randomTrackId);
    }

    // Переключить режим перемешивания
    function toggleShuffle() {
        shuffleActive.value = !shuffleActive.value;
    }

    // Добавить трек в конец очереди
    async function enqueue(trackId) {
        await addTrack(trackId);
        if (!queue.value.includes(trackId)) {
            queue.value.push(trackId);
        }
    }

    // Добавить трек после текущего
    async function enqueueNext(trackId) {
        await addTrack(trackId);
        const curIdx = currentIndex.value;
        if (curIdx === -1) {
            enqueue(trackId);
        } else if (!queue.value.includes(trackId)) {
            queue.value.splice(curIdx + 1, 0, trackId);
        }
    }

    // Удалить трек из очереди
    function dequeue(trackId) {
        queue.value = queue.value.filter(id => id !== trackId);
    }

    // Очистить очередь
    function clearQueue() {
        queue.value = [];
    }

    // Переместить трек в очереди
    function moveInQueue(oldIndex, newIndex) {
        if (
            oldIndex < 0 ||
            newIndex < 0 ||
            oldIndex >= queue.value.length ||
            newIndex >= queue.value.length
        ) {
            return;
        }
        const [id] = queue.value.splice(oldIndex, 1);
        queue.value.splice(newIndex, 0, id);
    }

    return {
        // Состояние
        queue,
        currentTrackId,
        isPlaying,
        loopMode,
        shuffleActive,
        audioElement,

        // Геттеры
        currentTrack,
        queueTracks,
        currentIndex,

        // Действия
        setAudioElement,
        addTrack,
        addTracks,
        setCurrentTrack,
        playTrack,
        play,
        pause,
        togglePlay,
        toggleLoopMode,
        nextTrack,
        prevTrack,
        toggleShuffle,
        enqueue,
        enqueueNext,
        dequeue,
        clearQueue,
        moveInQueue,
    };
});