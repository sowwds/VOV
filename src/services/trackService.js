import api from '@/services/api';


function normalize(raw) {
    return {
        trackid:   raw.trackid,
        title:     raw.title,
        author:    raw.author,
        album:     raw.album,
        year:      raw.year,
        country:   raw.country,
        coverurl:  raw.coverurl,
        likes:     raw.likes,
        playcount: raw.playcount,
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

    async addToLibrary(userId, trackid) {
        return api.post('/user/library/add', { userId, trackid });
    },

    async getTrackMetadata(trackid) {
        const { data } = await api.get(`/public-library/${trackid}`);
        return normalize(data);
    },

    getStreamUrl(trackid, version = 'processed') {
        return `http://localhost:5000/restoration/stream/${trackid}?version=${version}`;
    },

    // Получить подписанную ссылку для скачивания
    async getDownloadUrl(trackId, version = 'processed') {
        const response = await api.get(`/restoration/download/${trackId}`, { params: { version } });
        return response.data.url;
    },

    // Загрузить аудиофайл
    async uploadTrack(userId, file) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('file', file);
        const response = await api.post('/restoration/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.id;
    },

    // Сохранить метаданные трека
    async saveMetadata(trackId, metadata) {
        const response = await api.post('/restoration/metadata', { trackId, ...metadata });
        return response.data.metadataId;
    },
};