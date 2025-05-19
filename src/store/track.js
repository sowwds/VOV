// src/store/track.js
import { defineStore } from 'pinia';
import { trackService } from '@/services/trackService';
import { useAuthStore } from '@/store/auth';
import { usePlayerStore } from '@/store/player';

export const useTrackStore = defineStore('track', {
    state: () => ({
        topPlays:    [],
        topLikes:    [],
        newTracks:   [],
        userLibrary: [],
        searchResults: [],
    }),
    actions: {
        async fetchTopPlays(limit = 10) {
            this.topPlays = await trackService.getTopPlays(limit);
        },
        async fetchTopLikes(limit = 10) {
            this.topLikes = await trackService.getTopLikes(limit);
        },
        async fetchNewTracks(limit = 10) {
            this.newTracks = await trackService.getNewTracks(limit);
        },
        async fetchPublicTracks(limit = 10) {
            const [a, b, c] = await Promise.all([
                trackService.getTopPlays(limit),
                trackService.getTopLikes(limit),
                trackService.getNewTracks(limit),
            ]);
            this.topPlays  = a;
            this.topLikes  = b;
            this.newTracks = c;
        },
        async fetchUserLibrary() {
            const auth = useAuthStore();
            if (!auth.userId) return;
            this.userLibrary = await trackService.getUserLibrary(auth.userId);
        },
        async searchTracks(query) {
            this.searchResults = await trackService.searchTracks(query);
        },
        async addToLibrary(trackId) {
            const auth = useAuthStore();
            if (!auth.userId) throw new Error('Not logged in');
            await trackService.addToLibrary(auth.userId, trackId);
            await this.fetchUserLibrary();
        },
        async removeFromLibrary(trackId) {
            const auth = useAuthStore();
            if (!auth.userId) throw new Error('Not logged in');
            await trackService.removeFromLibrary(auth.userId, trackId);
            await this.fetchUserLibrary();
        },
        async playTrack(trackId) {
            await usePlayerStore().playTrack(trackId);
        },
        stopTrack() {
            usePlayerStore().pause();
        },
    },
});
