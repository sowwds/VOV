import api from '@/services/api';

function normalize(raw) {
    // console.log(raw);
    return {
        trackId:   raw.trackid,    // здесь сохраняем из ответа поле trackid в trackId
        title:     raw.title,
        author:    raw.author,
        album:     raw.album,
        year:      raw.year,
        country:   raw.country,
        coverUrl:  raw.coverurl,
        likes:     raw.likes.toString(),
        playCount: raw.playcount.toString(),
    };
}

export const trackService = {
    async getTopPlays(limit = 10) {
        const { data } = await api.get('/public-library/top-plays', { params: { limit } });
        return data.tracks.map(normalize);
    },

    async getTopLikes(limit = 10) {
        const { data } = await api.get('/public-library/top-likes', { params: { limit } });
        return data.tracks.map(normalize);
    },

    async getNewTracks(limit = 10) {
        const { data } = await api.get('/public-library', { params: { limit } });
        return data.tracks.map(normalize);
    },

    async searchTracks(query, limit = 10) {
        if (!query.trim()) return [];
        const { data } = await api.get('/public-library', { params: { search: query, limit } });
        return data.tracks.map(normalize);
    },

    async getUserLibrary(userId) {
        const { data } = await api.post('/users/library/list', { userId });
        return data.tracks.map(normalize);
    },

    async addToLibrary(userId, trackId) {
        // бекенд ждёт trackId
        console.log(trackId);
        const { data } = await api.post('/users/library', { userId, trackId });
        return data;
    },

    async getTrackMetadata(trackId) {
        const { data } = await api.get(`/public-library/${trackId}`);
        console.log(data);
        return data;
    },

    getStreamUrl(trackId, version = 'processed') {
        return `http://localhost:5000/restoration/stream/${trackId}?version=${version}`;
    },

    async getDownloadUrl(trackId, version = 'processed') {
        const { data } = await api.get(`/restoration/download/${trackId}`, { params: { version } });
        return data.url;
    },

    async uploadTrack(userId, file) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('file', file);
        const { data } = await api.post('/restoration/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.id;
    },

    async saveMetadata(trackId, metadata) {
        const { data } = await api.post('/restoration/metadata', { trackId, ...metadata });
        return data.metadataId;
    },
};
