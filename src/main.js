import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import '@/assets/input.css'   // подключение Tailwind
import { useThemeStore, applyTheme } from '@/store/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const theme = useThemeStore(pinia)
applyTheme(theme.mode)

app.mount('#app')
