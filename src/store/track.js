import { defineStore } from 'pinia';
import { trackService } from '@/services/trackService';
import { useAuthStore } from '@/store/auth';

export const useTrackStore = defineStore('track', {
    state: () => ({
        topPlays: [],
        topLikes: [],
        newTracks: [],
        userLibrary: [],
        searchResults: [],
        currentTrack: null,
        isPlaying: false,
    }),
    actions: {
        async fetchTopPlays(limit = 10) {
            try {
                this.topPlays = await trackService.getTopPlays(limit);
            } catch (error) {
                console.error('Ошибка загрузки топа по прослушиваниям:', error);
                throw error;
            }
        },
        async fetchTopLikes(limit = 10) {
            try {
                this.topLikes = await trackService.getTopLikes(limit);
            } catch (error) {
                console.error('Ошибка загрузки топа по лайкам:', error);
                throw error;
            }
        },
        async fetchNewTracks(limit = 10) {
            try {
                this.newTracks = await trackService.getNewTracks(limit);
            } catch (error) {
                console.error('Ошибка загрузки новых треков:', error);
                throw error;
            }
        },
        async fetchPublicTracks(limit = 10) {
            try {
                const [topPlays, topLikes, newTracks] = await Promise.all([
                    trackService.getTopPlays(limit),
                    trackService.getTopLikes(limit),
                    trackService.getNewTracks(limit),
                ]);
                this.topPlays = topPlays;
                this.topLikes = topLikes;
                this.newTracks = newTracks;
            } catch (error) {
                console.error('Ошибка загрузки публичных треков:', error);
                throw error;
            }
        },
        async fetchUserLibrary() {
            const authStore = useAuthStore();
            if (!authStore.userId) {
                console.error('Пользователь не авторизован');
                return;
            }
            try {
                this.userLibrary = await trackService.getUserLibrary(authStore.userId);
            } catch (error) {
                console.error('Ошибка загрузки библиотеки пользователя:', error);
                throw error;
            }
        },
        async searchTracks(query) {
            try {
                this.searchResults = await trackService.searchTracks(query);
            } catch (error) {
                console.error('Ошибка поиска треков:', error);
                throw error;
            }
        },
        async addToLibrary(trackId) {
            const authStore = useAuthStore();
            if (!authStore.userId) {
                console.error('Пользователь не авторизован');
                throw new Error('Пользователь не авторизован');
            }
            try {
                await trackService.addToLibrary(authStore.userId, trackId);
                await this.fetchUserLibrary();
            } catch (error) {
                console.error('Ошибка добавления трека в библиотеку:', error);
                throw error;
            }
        },
        async playTrack(trackId) {
            try {
                const metadata = await trackService.getTrackMetadata(trackId);
                this.currentTrack = {
                    trackId,
                    metadata,
                    streamUrl: trackService.getStreamUrl(trackId, 'processed'),
                };
                this.isPlaying = true;
            } catch (error) {
                console.error('Ошибка воспроизведения трека:', error);
                throw error;
            }
        },
        stopTrack() {
            this.isPlaying = false;
            this.currentTrack = null;
        },
    },
});