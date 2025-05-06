import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Restorator from '@/views/Restorator.vue'
import Collection from '@/views/Collection.vue'
import ProfileSettings from '@/views/ProfileSettings.vue'

const routes = [
    { path: '/', component: Home, name: 'Главная' },
    { path: '/restorator', component: Restorator, name: 'Реставратор' },
    { path: '/collection', component: Collection, name: 'Коллекция' },
    { path: '/profile-settings', component: ProfileSettings, name: 'Настройки профиля' },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router