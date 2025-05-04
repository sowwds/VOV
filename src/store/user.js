import { defineStore } from 'pinia'
import avatarPlaceholder from '@/assets/avatar-placeholder.png'

export const useUserStore = defineStore('user', {
    state: () => ({
        fullName: 'Иван Иванов',
        avatarUrl: avatarPlaceholder,
    }),
})