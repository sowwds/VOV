```vue
<template>
  <div class="fixed bg-[#fafafc] dark:bg-[#17181c] inset-0 -z-10 overflow-hidden">
    <canvas
        ref="canvas"
        class="w-full h-full blur-[3px] transition-opacity duration-300"
        :class="{'opacity-50': isContentPage,
        'opacity-0': !isVisualizerActive
        }"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { usePlayerStore } from '@/store/player';
import { useRoute } from 'vue-router';


const playerStore = usePlayerStore();
const isPlaying = computed(() => playerStore.isPlaying);
const audioElement = computed(() => playerStore.audioElement);
const route = useRoute();



const isContentPage = computed(() => route.path !== '/');

const canvas = ref(null);
const isVisualizerActive = ref(false);
let context = null;
let shouldRedrawBackground = ref(true);

let audioContext = null;
let analyser = null;
let audioSrc = null;
let analyserBufferLength = null;
let dataArray = null;


let w, h, center2D;
const fov = 250;
let speed = 0.25;
const particleDistanceTop = 10;
const particles = [];
const particlesSky = [];
let mouseActive = false;
let mousePos = { x: 0, y: 0 };
let animationFrameId = null;

// Ограничение частоты кадров
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

const init = () => {
  if (!canvas.value) {
    console.error('Canvas element not found');
    return;
  }
  context = canvas.value.getContext('2d', { willReadFrequently: true });
  onResize();
  addParticles(particles, 1);
  addParticles(particlesSky, -1);
  console.log('Canvas initialized, particles:', particles.length, 'particlesSky:', particlesSky.length);
};

const audioSetup = () => {
  if (!audioElement.value) {
    console.error('Audio element not found in playerStore');
    return false;
  }
  if (audioContext && audioContext.state !== 'closed') {
    console.log('Audio context already initialized, state:', audioContext.state);
    return true;
  }
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.connect(audioContext.destination);
    analyser.smoothingTimeConstant = 0.75;
    analyser.fftSize = 512 * 8;
    analyserBufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(analyserBufferLength);
    audioSrc = audioContext.createMediaElementSource(audioElement.value);
    audioSrc.connect(analyser);
    console.log('Audio setup successful, fftSize:', analyser.fftSize, 'audio src:', audioElement.value.src);
    return true;
  } catch (error) {
    console.error('Error setting up audio context:', error);
    return false;
  }
};


const initCanvas = () => {
  if (!canvas.value) return;

  context = canvas.value.getContext('2d', { willReadFrequently: true });
  updateCanvasBackground();
  isVisualizerActive.value = true;
};

const updateCanvasBackground = () => {
  if (!context || !canvas.value) return;

  const isDark = document.documentElement.classList.contains('dark');
  context.fillStyle = isDark ? '#17181c' : '#fafafc';
  context.fillRect(0, 0, canvas.value.width, canvas.value.height);
  shouldRedrawBackground.value = false;
};

const observeThemeChanges = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        shouldRedrawBackground.value = true;
        if (!playerStore.isPlaying) {
          updateCanvasBackground();
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  return observer;
};


const clearCanvas = () => {
  if (context) {
    // Используем темозависимый цвет фона
    context.fillStyle = document.documentElement.classList.contains('dark') ? '#17181c' : '#fafafc';
    context.fillRect(0, 0, w, h);
  }
};

const drawLine = (x1, y1, x2, y2, r, g, b, a) => {
  if (!context) return;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  // Адаптируем цвета линий для тем
  const isDark = document.documentElement.classList.contains('dark');
  if (r === 0 && b === 0) {
    // Нижняя сетка (particles): зелёная для светлой, фиолетовая для тёмной
    context.strokeStyle = isDark ? `rgba(139, 92, 246, ${a / 255})` : `rgba(236, 72, 153, ${a / 255})`;
  } else {
    // Верхняя сетка (particlesSky): голубая для светлой, синяя для тёмной
    context.strokeStyle = isDark ? `rgba(59, 130, 246, ${a / 255})` : `rgba(99, 102, 241, ${a / 255})`;
  }
  context.stroke();
};

const addParticle = (x, y, z, index) => {
  return { x, y, z, x2d: 0, y2d: 0, index };
};

const addParticles = (array, dir) => {
  let audioBufferIndexMin = 8;
  let audioBufferIndexMax = 256;
  let audioBufferIndex = audioBufferIndexMin;

  for (let z = -fov; z < fov; z += 10) {
    const particlesRow = [];
    for (let x = -fov; x < fov; x += 10) {
      const yPos = dir > 0 ? Math.random() * 5 + particleDistanceTop : Math.random() * 5 - particleDistanceTop;
      const particle = addParticle(x, yPos, z, audioBufferIndex);
      particlesRow.push(particle);
      audioBufferIndex++;
      if (audioBufferIndex > audioBufferIndexMax) {
        audioBufferIndex = audioBufferIndexMin;
      }
    }
    array.push(particlesRow);
  }
};

const onResize = () => {
  w = window.innerWidth;
  h = window.innerHeight;
  center2D = { x: w / 2, y: h / 2 };
  if (canvas.value) {
    canvas.value.width = w;
    canvas.value.height = h;
    console.log('Canvas resized, width:', w, 'height:', h);
  }
};

const mouseMoveHandler = (event) => {
  if (!canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  mousePos = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  mouseActive = true;
};

const mouseLeaveHandler = () => {
  mouseActive = false;
  mousePos.x = w / 2;
};

const render = () => {
  if (shouldRedrawBackground.value) {
    updateCanvasBackground();
  }

  if (!analyser || !dataArray || audioContext?.state === 'closed') {
    console.warn('Analyser not initialized or audioContext closed');
    return;
  }

  let frequencySource = dataArray;
  analyser.getByteFrequencyData(frequencySource);
  console.log('Rendering, frequencySource sample:', frequencySource[0]);

  let sortArray = false;

  // Отрисовка частиц (нижняя сетка)
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
      if (frequencySource) {
        const frequency = frequencySource[particle.index] || 0;
        const frequencyAdd = frequency / 10;
        particle.y = frequencyAdd + particleDistanceTop;
      }
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

  // Отрисовка частиц (верхняя сетка)
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
      if (frequencySource) {
        const frequency = frequencySource[particle.index] || 0;
        const frequencyAdd = frequency / 10;
        particle.y = -frequencyAdd - particleDistanceTop;
      }
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

  if (mouseActive) {
    center2D.x += (mousePos.x - center2D.x) * 0.015;
  } else {
    center2D.x += (canvas.value?.width / 2 - center2D.x) * 0.015;
  }
};

const animate = (currentTime) => {
  if (!isPlaying.value || !analyser || audioContext?.state === 'closed') {
    console.log('Animation stopped, isPlaying:', isPlaying.value, 'analyser:', !!analyser, 'audioContext state:', audioContext?.state);
    return;
  }
  if (currentTime - lastFrameTime < frameInterval) {
    animationFrameId = requestAnimationFrame(animate);
    return;
  }
  lastFrameTime = currentTime;

  clearCanvas();
  render();
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  initCanvas();
  const observer = observeThemeChanges();

  onUnmounted(() => {
    observer.disconnect();
  });
});

onMounted(() => {
  try {
    init();
    if (canvas.value) {
      canvas.value.addEventListener('mousemove', mouseMoveHandler);
      canvas.value.addEventListener('mouseleave', mouseLeaveHandler);
    }
    window.addEventListener('resize', onResize);
    console.log('Mounted, audioElement:', !!audioElement.value, 'isPlaying:', isPlaying.value);
    if (isPlaying.value && audioElement.value) {
      if (audioSetup()) {
        lastFrameTime = performance.now();
        animate(lastFrameTime);
      }
    }
  } catch (error) {
    console.error('Error in mounted hook:', error);
  }
});

onUnmounted(() => {
  try {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (canvas.value) {
      canvas.value.removeEventListener('mousemove', mouseMoveHandler);
      canvas.value.removeEventListener('mouseleave', mouseLeaveHandler);
    }
    window.removeEventListener('resize', onResize);
    if (audioContext && audioContext.state !== 'closed') {
      console.log('Closing audioContext, state:', audioContext.state);
      audioContext.close();
    }
    console.log('Component unmounted');
  } catch (error) {
    console.error('Error in unmounted hook:', error);
  }
});

watch([isPlaying, audioElement], ([newPlaying, newAudioElement], [oldPlaying]) => {
  console.log('Watch triggered: isPlaying=', newPlaying, 'audioElement=', !!newAudioElement);
  if (newPlaying && newAudioElement && !analyser) {
    if (audioSetup()) {
      lastFrameTime = performance.now();
      animate(lastFrameTime);
    }
  } else if (!newPlaying && animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    clearCanvas();
  } else if (newPlaying && !oldPlaying && analyser && audioContext?.state !== 'closed') {
    lastFrameTime = performance.now();
    animate(lastFrameTime);
  }
});
</script>
```