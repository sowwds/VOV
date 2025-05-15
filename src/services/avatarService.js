const avatarCache = new Map()
const colors = ['#F87171','#FBBF24','#34D399','#60A5FA','#A78BFA','#F472B6']

export function getTrackAvatar(track) {
    if (!track || !track.id) return null

    // Если уже есть в кэше - возвращаем
    if (avatarCache.has(track.id)) {
        return avatarCache.get(track.id)
    }

    // Если у трека есть своя картинка - сохраняем и возвращаем её
    if (track.imageUrl) {
        avatarCache.set(track.id, track.imageUrl)
        return track.imageUrl
    }

    // Генерируем новую аватарку
    const avatar = generateAvatar(track)
    avatarCache.set(track.id, avatar)
    return avatar
}

function generateAvatar(track) {
    const letter = (track.title || track.artist || '?').charAt(0).toUpperCase()
    const color = getColorForTrack(track)

    // Оптимизированный SVG с идеальным центрированием
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="${color}" rx="0"/> <!-- rx="0" для точных прямоугольников -->
      <text 
        x="100" 
        y="115" 
        font-family="Arial, sans-serif" 
        font-size="100" 
        text-anchor="middle"
        dominant-baseline="middle"
        fill="white"
      >${letter}</text>
    </svg>
    `.replace(/\s+/g, ' ') // Удаляем лишние пробелы для оптимизации

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function getColorForTrack(track) {
    let hash = 0
    const key = track.title + track.artist
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff
    }
    return colors[Math.abs(hash) % colors.length]
}

// Для очистки кэша (например, при выходе пользователя)
export function clearAvatarCache() {
    avatarCache.clear()
}