```vue
<template>
  <div class="relative bg-[#fafafc] dark:bg-[#17181c] rounded-md overflow-hidden">
    <!-- Canvas как фон -->
    <canvas
        v-if="isAnimationEnabled"
        ref="canvas"
        class="absolute inset-0 w-full h-full blur-[3px] transition-opacity duration-300"
        :class="{ 'opacity-50': isContentPage, 'opacity-100': !isContentPage }"
    ></canvas>
    <!-- Контент блока -->
    <div class="relative z-10 p-4 flex flex-col gap-2">
      <slot></slot> <!-- Для вставки <h1> из Home.vue -->
      <button
          class="px-3 py-1 rounded-md text-sm text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface
               hover:bg-light-primary dark:hover:bg-dark-primary transition-colors w-fit"
          @click="toggleAnimation"
      >
        {{ isAnimationEnabled ? 'Выключить анимацию' : 'Включить анимацию' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isContentPage = computed(() => route.path !== '/');

// Состояние анимации
const isAnimationEnabled = ref(true);

// Canvas и контекст
const canvas = ref(null);
let context = null;
let w, h, center2D;
const fov = 100; // Уменьшено для эффекта "ближе"
let speed = 0.25;
const particleDistanceTop = 15; // Увеличено для расстояния между "небом" и "землёй"
const particles = [];
const particlesSky = [];
let animationFrameId = null;

// Ограничение частоты кадров
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// Инициализация
const init = () => {
  if (!canvas.value) {
    console.error('Canvas element not found');
    return;
  }
  context = canvas.value.getContext('2d', { willReadFrequently: true });
  onResize();
  particles.length = 0; // Очищаем массивы
  particlesSky.length = 0;
  addParticles(particles, 1);
  addParticles(particlesSky, -1);
  console.log('Canvas initialized, particles:', particles.length, 'particlesSky:', particlesSky.length);
};

// Очистка canvas
const clearCanvas = () => {
  if (context) {
    context.fillStyle = document.documentElement.classList.contains('dark') ? '#17181c' : '#fafafc';
    context.fillRect(0, 0, w, h);
  }
};

// Отрисовка линий
const drawLine = (x1, y1, x2, y2, r, g, b, a) => {
  if (!context) return;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  const isDark = document.documentElement.classList.contains('dark');
  if (r === 0 && b === 0) {
    context.strokeStyle = isDark ? `rgba(139, 92, 246, ${a / 255})` : `rgba(236, 72, 153, ${a / 255})`;
  } else {
    context.strokeStyle = isDark ? `rgba(59, 130, 246, ${a / 255})` : `rgba(99, 102, 241, ${a / 255})`;
  }
  context.stroke();
};

// Создание частицы
const addParticle = (x, y, z, index) => {
  return { x, y, z, x2d: 0, y2d: 0, index, phase: Math.random() * Math.PI * 2 };
};

// Создание сетки частиц
const addParticles = (array, dir) => {
  let index = 0;
  for (let z = -fov; z < fov; z += 20) {
    const particlesRow = [];
    for (let x = -fov; x < fov; x += 20) {
      const yPos = dir > 0 ? Math.random() * 2 + particleDistanceTop : Math.random() * 2 - particleDistanceTop;
      const particle = addParticle(x, yPos, z, index);
      particlesRow.push(particle);
      index++;
    }
    array.push(particlesRow);
  }
};

// Обработка изменения размера
const onResize = () => {
  if (!canvas.value || !canvas.value.parentElement) return;
  w = canvas.value.parentElement.clientWidth;
  h = canvas.value.parentElement.clientHeight;
  center2D = { x: w / 2, y: h / 2 };
  canvas.value.width = w;
  canvas.value.height = h;
};

// Рендеринг
const render = () => {
  clearCanvas();
  const time = performance.now() * 0.001;

  let sortArray = false;

  // Нижняя сетка ("земля")
  for (let i = 0, l = particles.length; i < l; i++) {
    const particlesRow = particles[i];
    const particlesRowBack = i > 0 ? particles[i - 1] : null;
    const lineColorValue = Math.round((i / l) * 155);
    for (let j = 0, k = particlesRow.length; j < k; j++) {
      const particle = particlesRow[j];
      const scale = fov / (fov + particle.z);
      particle.x2d = particle.x * scale + center2D.x;
      particle.y2d = particle.y * scale + center2D.y;
      particle.z -= speed;
      particle.y = particleDistanceTop + Math.sin(time + particle.phase) * 8; // Увеличена амплитуда
      if (particle.z < -fov) {
        particle.z += fov * 2;
        sortArray = true;
      }
      if (j > 0) {
        const p = particlesRow[j - 1];
        if (particle.x2d >= 0 && particle.x2d <= w && particle.y2d >= 0 && particle.y2d <= h) {
          drawLine(particle.x2d | 0, particle.y2d | 0, p.x2d | 0, p.y2d | 0, 0, lineColorValue, 0, 255);
        }
      }
      if (i > 0 && i < l - 1 && particlesRowBack) {
        const pB = particlesRowBack[j];
        if (particle.x2d >= 0 && particle.x2d <= w && particle.y2d >= 0 && particle.y2d <= h) {
          drawLine(particle.x2d | 0, particle.y2d | 0, pB.x2d | 0, pB.y2d | 0, 0, lineColorValue, 0, 255);
        }
      }
    }
  }

  if (sortArray) {
    particles.sort((a, b) => b[0].z - a[0].z);
  }

  // Верхняя сетка ("небо")
  for (let i = 0, l = particlesSky.length; i < l; i++) {
    const particlesRow = particlesSky[i];
    const particlesRowBack = i > 0 ? particlesSky[i - 1] : null;
    const lineColorValue = Math.round((i / l) * 255);
    for (let j = 0, k = particlesRow.length; j < k; j++) {
      const particle = particlesRow[j];
      const scale = fov / (fov + particle.z);
      particle.x2d = particle.x * scale + center2D.x;
      particle.y2d = particle.y * scale + center2D.y;
      particle.z -= speed;
      particle.y = -particleDistanceTop - Math.sin(time + particle.phase) * 8; // Увеличена амплитуда
      if (particle.z < -fov) {
        particle.z += fov * 2;
        sortArray = true;
      }
      if (j > 0) {
        const p = particlesRow[j - 1];
        if (particle.x2d >= 0 && particle.x2d <= w && particle.y2d >= 0 && particle.y2d <= h) {
          drawLine(particle.x2d | 0, particle.y2d | 0, p.x2d | 0, p.y2d | 0, 0, Math.round(lineColorValue / 2), lineColorValue, 255);
        }
      }
      if (i > 0 && i < l - 1 && particlesRowBack) {
        const pB = particlesRowBack[j];
        if (particle.x2d >= 0 && particle.x2d <= w && particle.y2d >= 0 && particle.y2d <= h) {
          drawLine(particle.x2d | 0, particle.y2d | 0, pB.x2d | 0, pB.y2d | 0, 0, Math.round(lineColorValue / 2), lineColorValue, 255);
        }
      }
    }
  }

  if (sortArray) {
    particlesSky.sort((a, b) => b[0].z - a[0].z);
  }
};

// Анимация
const animate = (currentTime) => {
  if (!isAnimationEnabled.value || !context) {
    console.log('Animation stopped: disabled or no context');
    return;
  }
  if (currentTime - lastFrameTime < frameInterval) {
    animationFrameId = requestAnimationFrame(animate);
    return;
  }
  lastFrameTime = currentTime;

  render();
  animationFrameId = requestAnimationFrame(animate);
};

// Переключение анимации
const toggleAnimation = async () => {
  isAnimationEnabled.value = !isAnimationEnabled.value;
  if (isAnimationEnabled.value) {
    await nextTick(); // Ждём рендеринга canvas
    if (!canvas.value) {
      console.error('Canvas still not found after nextTick');
      return;
    }
    init(); // Переинициализируем
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
  } else if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    clearCanvas();
  }
};

// Наблюдение за изменением темы
const observeThemeChanges = () => {
  const observer = new MutationObserver(() => {
    clearCanvas();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return observer;
};

onMounted(() => {
  init();
  const observer = observeThemeChanges();
  window.addEventListener('resize', onResize);
  if (isAnimationEnabled.value) {
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
  }

  onUnmounted(() => {
    observer.disconnect();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', onResize);
    console.log('Component unmounted');
  });
});
</script>
```