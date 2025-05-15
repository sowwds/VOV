import { defineStore } from 'pinia'
import jsmediatags from 'jsmediatags'

export const useParserStore = defineStore('parser', {
    state: () => ({
        trackIdCounter: 1,
    }),
    actions: {
        async parseAudioFiles(files) {
            const parsedTracks = await Promise.all(
                Array.from(files).map(file => this.parseSingleFile(file)))
            return parsedTracks.filter(track => track !== null)
        },

        async parseSingleFile(file) {
            try {
                const tags = await this.readMediaTags(file)
                const picture = tags.picture ? this.getPictureUrl(tags.picture) : null

                return {
                    id: this.trackIdCounter++,
                    title: tags.title || file.name,
                    artist: tags.artist || 'Unknown Artist',
                    imageUrl: picture,
                    file: file,
                }
            } catch (error) {
                console.error('Error parsing file:', file.name, error)
                return {
                    id: this.trackIdCounter++,
                    title: file.name,
                    artist: 'Unknown Artist',
                    imageUrl: null,
                    file: file,
                }
            }
        },

        readMediaTags(file) {
            return new Promise((resolve, reject) => {
                jsmediatags.read(file, {
                    onSuccess: (result) => resolve(result.tags),
                    onError: (error) => reject(error),
                })
            })
        },

        getPictureUrl(picture) {
            const base64String = btoa(
                picture.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
            )
            return `data:${picture.format};base64,${base64String}`
        },
    },
})