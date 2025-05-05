<template>
  <div ref="mapContainer" class="w-full h-full relative">
    <!-- По желанию: поиск по странам -->
    <!-- <div ref="geocoderContainer" class="absolute top-2 left-2 z-10 w-64"></div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Импортируете ваш GeoJSON (Vite его превратит в URL или объект)
import europeGeo from '@/assets/custom.geo.json'

const mapContainer = ref(null)
let map

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://demotiles.maplibre.org/style.json', // свободный базовый стиль
    center: [10, 50],  // координаты центра (долгота, широта)
    zoom: 4,
  })

  map.on('load', () => {
    // Добавляем источник с вашими границами
    map.addSource('ww2-europe', {
      type: 'geojson',
      data: europeGeo,
    })
    // Заливка
    map.addLayer({
      id: 'ww2-fill',
      type: 'fill',
      source: 'ww2-europe',
      paint: {
        'fill-color': '#8888AA',       // цвет заливки
        'fill-opacity': 0.3,           // прозрачность
      }
    })
    // Контур
    map.addLayer({
      id: 'ww2-line',
      type: 'line',
      source: 'ww2-europe',
      paint: {
        'line-color': '#444444',
        'line-width': 1,
      }
    })

    // Пример клика по стране:
    map.on('click', 'ww2-fill', e => {
      const props = e.features[0].properties
      alert(`Вы кликнули по: ${props.name || props.NAME || 'неизвестная страна'}`)
    })

    // Изменяем курсор над странами
    map.on('mouseenter', 'ww2-fill', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'ww2-fill', () => {
      map.getCanvas().style.cursor = ''
    })
  })
})

onBeforeUnmount(() => {
  if (map) map.remove()
})
</script>

<style scoped>
.w-full { width: 100%; }
.h-full { height: 100%; }
</style>