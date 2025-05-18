import api from '@/services/api';

// Сервис для работы с треками и библиотекой
export const trackService = {
    // Получить топ треков по прослушиваниям
    async getTopPlays(limit = 10) {
        const response = await api.get('/public-library/top-plays', { params: { limit } });
        return response.data.tracks;
    },

    // Получить топ треков по лайкам
    async getTopLikes(limit = 10) {
        const response = await api.get('/public-library/top-likes', { params: { limit } });
        return response.data.tracks;
    },

    // Получить новые треки
    async getNewTracks(limit = 10) {
        const response = await api.get('/public-library', { params: { limit } });
        return response.data.tracks;
    },

    // Поиск треков
    async searchTracks(query, limit = 10) {
        if (!query.trim()) return [];
        const response = await api.get('/public-library', { params: { search: query, limit } });
        return response.data.tracks;
    },

    // Получить пользовательскую библиотеку
    async getUserLibrary(userId) {
        const response = await api.post('/users/library/list', { userId });
        return response.data.tracks;
    },

    // Добавить трек в пользовательскую библиотеку
    async addToLibrary(userId, trackId) {
        const response = await api.post('/user/library/add', { userId, trackId });
        return response.data;
    },

    // Проверить, находится ли трек в библиотеке пользователя
    async isTrackInLibrary(userId, trackId) {
        const library = await this.getUserLibrary(userId);
        return library.some(track => track.trackId === trackId);
    },

    // Получить метаданные трека
    async getTrackMetadata(trackId) {
        const response = await api.get(`/public-library/${trackId}`);
        return response.data;
    },

    // Получить URL для стриминга трека
    getStreamUrl(trackId, version = 'processed') {
        return `/tracks/${trackId}/stream?version=${version}`;
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