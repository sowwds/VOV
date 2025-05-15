// src/store/player.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTrackAvatar } from '@/services/avatarService.js'

export const usePlayerStore = defineStore('player', () => {
    // Коллекция всех загруженных треков
    const tracks = ref([])
    // Массив ID треков в очереди воспроизведения
    const queue = ref([])
    // ID текущего трека
    const currentTrack = ref(null)
    // Состояние play/pause
    const isPlaying = ref(false)
    const loopMode = ref('none') // 'none' | 'all' | 'one'
    const shuffleActive = ref(false)

    // Вычисляем индекс текущего трека в очереди
    const currentIndex = computed(() =>
        queue.value.findIndex(id => id === currentTrack.value)
    )

    // Получаем объект текущего трека
    const queueTracks = computed(() =>
        queue.value
            .map(id => {
                const track = tracks.value.find(t => t.id === id)
                return track ? {
                    ...track,
                    avatarUrl: getTrackAvatar(track)
                } : null
            })
            .filter(Boolean)
    )

    const currentTrackObj = computed(() => {
        const track = tracks.value.find(t => t.id === currentTrack.value)
        return track ? {
            ...track,
            avatarUrl: getTrackAvatar(track)
        } : null
    })

    // Добавить трек в коллекцию
    function addTrack(track) {
        tracks.value.push(track)
    }
    function addTracks(newTracks) {
        newTracks.forEach(track => {
            this.addTrack(track)
        })
    }

    // Установить текущий трек (по объекту)
    function setCurrentTrack(track) {
        currentTrack.value = track.id
        // Если этот трек ещё не в очереди, автоматически добавляем его первым
        if (!queue.value.includes(track.id)) {
            queue.value.unshift(track.id)
        }
    }

    // Включить/поставить на паузу
   function playTrack(track) {
        setCurrentTrack(track)
       play()
   }
    function play() {
        isPlaying.value = true
    }

    function pause() {
        isPlaying.value = false
    }

    function togglePlay(track = null) {
        if (track && currentTrack.value !== track.id) {
            playTrack(track)
        } else {
            isPlaying.value = !isPlaying.value
        }
    }

    function toggleLoopMode() {
        if (loopMode.value === 'none') {
            loopMode.value = 'all'
        } else if (loopMode.value === 'all') {
            loopMode.value = 'one'
        } else {
            loopMode.value = 'none'
        }
    }

    function nextTrack() {
        const currentIdx = currentIndex.value
        if (currentIdx === -1) return

        // Если shuffle активен - случайный трек
        if (shuffleActive.value) {
            return playRandomTrack()
        }

        // Если последний трек в очереди
        if (currentIdx >= queue.value.length - 1) {
            if (loopMode.value === 'all') {
                // Зацикливаем очередь - переходим к первому треку
                const firstTrackId = queue.value[0]
                const firstTrack = tracks.value.find(t => t.id === firstTrackId)
                if (firstTrack) playTrack(firstTrack)
            } else {
                // Останавливаем воспроизведение
                pause()
            }
            return
        }

        // Обычный переход к следующему треку
        const nextTrackId = queue.value[currentIdx + 1]
        const nextTrack = tracks.value.find(t => t.id === nextTrackId)
        if (nextTrack) playTrack(nextTrack)
    }

    function prevTrack() {
        const currentIdx = currentIndex.value
        if (currentIdx <= 0) {
            // Если первый трек - переходим к началу
            const currentTrack = tracks.value.find(t => t.id === queue.value[0])
            if (currentTrack) {
                playTrack(currentTrack)
                seekTo(0) // Перематываем в начало
            }
            return
        }

        // Переход к предыдущему треку
        const prevTrackId = queue.value[currentIdx - 1]
        const prevTrack = tracks.value.find(t => t.id === prevTrackId)
        if (prevTrack) playTrack(prevTrack)
    }

    function playRandomTrack() {
        if (queue.value.length === 0) return

        const randomIndex = Math.floor(Math.random() * queue.value.length)
        const randomTrackId = queue.value[randomIndex]
        const randomTrack = tracks.value.find(t => t.id === randomTrackId)
        if (randomTrack) playTrack(randomTrack)
    }

    function toggleShuffle() {
        shuffleActive.value = !shuffleActive.value
    }



    // Добавить трек в конец очереди (если нет)
    function enqueue(track) {
        if (!queue.value.includes(track.id)) {
            queue.value.push(track.id)
        }
    }

    // Вставить трек сразу после текущего (если ещё нет в очереди)
    function enqueueNext(track) {
        const id = track.id
        const curIdx = currentIndex.value
        if (curIdx === -1) {
            // Если сейчас ничего не играет, просто в конец
            return enqueue(track)
        }
        if (!queue.value.includes(id)) {
            queue.value.splice(curIdx + 1, 0, id)
        }
    }

    // Удалить трек из очереди
    function dequeue(track) {
        queue.value = queue.value.filter(id => id !== track.id)
    }

    // Очистить всю очередь
    function clearQueue() {
        queue.value = []
    }

    // Переместить элемент в очереди (для drag&drop или кнопок ↑/↓)
    function moveInQueue(oldIndex, newIndex) {
        if (
            oldIndex < 0 ||
            newIndex < 0 ||
            oldIndex >= queue.value.length ||
            newIndex >= queue.value.length
        ) {
            return
        }
        const [id] = queue.value.splice(oldIndex, 1)
        queue.value.splice(newIndex, 0, id)
    }

    return {
        // state
        tracks,
        queue,
        currentTrack,
        isPlaying,
        loopMode,
        shuffleActive,

        // getters
        currentTrackObj,
        queueTracks,
        currentIndex,

        // actions
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
    }
})
