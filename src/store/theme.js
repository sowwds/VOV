import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        // 'light' | 'dark' | 'system'
        mode: localStorage.getItem('theme') || 'system',
    }),
    actions: {
        setMode(m) {
            this.mode = m
            localStorage.setItem('theme', m)
            applyTheme(m)
        }
    }
})

// внешняя функция, чтобы можно было вызывать и при старте
export function applyTheme(mode) {
    const root = document.documentElement
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isDark = mode === 'dark' || (mode === 'system' && darkQuery.matches)
    root.classList.toggle('dark', isDark)
}
