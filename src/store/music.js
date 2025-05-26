import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
    state: () => ({
        isSidebarVisible: false,
    }),
    actions: {
        toggleSidebar() {
            this.isSidebarVisible = !this.isSidebarVisible
        }
    }
})