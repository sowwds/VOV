import { defineStore } from 'pinia';
import { trackService } from '@/services/trackService';
import { useAuthStore } from '@/store/auth';
import { usePlayerStore } from '@/store/player';

export const useTrackStore = defineStore('track', {
  state: () => ({
    topPlays: [],
    topLikes: [],
    newTracks: [],
    userLibrary: [],
    searchResults: [],
    searchTotal: 0,
    searchFrom: 0,
    searchSize: 10,
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
      this.topPlays = a;
      this.topLikes = b;
      this.newTracks = c;
    },

    async fetchUserLibrary() {
      const auth = useAuthStore();
      if (!auth.userId) return;
      this.userLibrary = await trackService.getUserLibrary(auth.userId);
    },

    async searchTracks(query, from = 0, size = 10, sort = 'relevance') {
      try {
        const auth = useAuthStore();
        const results = await trackService.searchTracks(query, auth.userId, from, size, sort);
        this.searchResults = results.tracks;
        this.searchTotal = results.total;
        this.searchFrom = results.from;
        this.searchSize = results.size;
      } catch (error) {
        console.error('Search error:', error);
        this.searchResults = [];
        this.searchTotal = 0;
        this.searchFrom = 0;
        throw error;
      }
    },

    async addToLibrary(trackId) {
      const auth = useAuthStore();
      if (!auth.userId) throw new Error('Not logged in');
      try {
        const track = this.searchResults.find(t => t.trackId === trackId) ||
                     this.topPlays.find(t => t.trackId === trackId) ||
                     this.topLikes.find(t => t.trackId === trackId) ||
                     this.newTracks.find(t => t.trackId === trackId);
        if (track && !this.userLibrary.some(t => t.trackId === trackId)) {
          this.userLibrary.push({ ...track });
        }
        await trackService.addToLibrary(auth.userId, trackId);
      } catch (error) {
        console.error('Add to library error:', error);
        this.userLibrary = this.userLibrary.filter(t => t.trackId !== trackId);
        throw error;
      }
    },

    async removeFromLibrary(trackId) {
      const auth = useAuthStore();
      if (!auth.userId) throw new Error('Not logged in');
      try {
        const originalLibrary = [...this.userLibrary];
        this.userLibrary = this.userLibrary.filter(t => t.trackId !== trackId);
        await trackService.removeFromLibrary(auth.userId, trackId);
      } catch (error) {
        console.error('Remove from library error:', error);
        this.userLibrary = originalLibrary;
        throw error;
      }
    },

    async playTrack(trackId) {
      await usePlayerStore().playTrack(trackId);
    },

    stopTrack() {
      usePlayerStore().pause();
    },
  },
});
