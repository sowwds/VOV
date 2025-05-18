<template>
  <div class="fixed bg-[#fafafc] dark:bg-[#17181c] inset-0 -z-10 overflow-hidden">
    <canvas
        ref="canvas"
        class="w-full h-full blur-[1px] transition-opacity duration-300"
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
const particleCount = 150;
const particles = [];
let mouseActive = false;
let mousePos = { x: 0, y: 0 };
let animationFrameId = null;

// Ограничение частоты кадров
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// Новые параметры для радиоволн
const waveCount = 5;
const waveAmplitude = 100;
const waveThickness = 2;
const waveSpeed = 0.5;
const noiseIntensity = 0.3;

const init = () => {
  if (!canvas.value) {
    console.error('Canvas element not found');
    return;
  }
  context = canvas.value.getContext('2d', { willReadFrequently: true });
  onResize();
  initParticles();
  console.log('Canvas initialized with radio wave effect');
};

const initParticles = () => {
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: h / 2,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.5,
      offset: Math.random() * Math.PI * 2
    });
  }
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
    console.log('Audio setup successful, fftSize:', analyser.fftSize);
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
    shouldRedrawBackground.value = true;
    if (!playerStore.isPlaying) {
      updateCanvasBackground();
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  return observer;
};

const clearCanvas = () => {
  if (context) {
    const isDark = document.documentElement.classList.contains('dark');
    context.fillStyle = isDark ? '#17181c' : '#fafafc';
    context.globalAlpha = 0.2;
    context.fillRect(0, 0, w, h);
    context.globalAlpha = 1.0;
  }
};

const drawWave = (x, y, width, height, frequencyData, index, totalWaves) => {
  if (!context || !frequencyData) return;

  const isDark = document.documentElement.classList.contains('dark');
  const hue = isDark ? 250 : 320; // Фиолетовый для тёмной темы, розовый для светлой
  const saturation = 80;
  const lightness = isDark ? 60 : 50;

  context.beginPath();

  const segmentWidth = width / 100;
  const baseAmplitude = waveAmplitude * (0.5 + index / (totalWaves * 2));

  for (let i = 0; i <= 100; i++) {
    const xPos = x + i * segmentWidth;
    const noise = Math.random() * noiseIntensity * baseAmplitude;

    // Используем аудиоданные для модуляции волны
    const dataIndex = Math.floor(i / 100 * analyserBufferLength);
    const audioMod = frequencyData[dataIndex] / 255 * baseAmplitude;

    const yPos = y + Math.sin(i * 0.2 + Date.now() * 0.001 * waveSpeed) *
        (baseAmplitude + audioMod + noise) *
        (0.5 + index / (totalWaves * 2));

    if (i === 0) {
      context.moveTo(xPos, yPos);
    } else {
      context.lineTo(xPos, yPos);
    }
  }

  // Добавляем второй проход для толщины волны
  for (let i = 100; i >= 0; i--) {
    const xPos = x + i * segmentWidth;
    const noise = Math.random() * noiseIntensity * baseAmplitude;
    const dataIndex = Math.floor(i / 100 * analyserBufferLength);
    const audioMod = frequencyData[dataIndex] / 255 * baseAmplitude;

    const yPos = y + Math.sin(i * 0.2 + Date.now() * 0.001 * waveSpeed) *
        (baseAmplitude + audioMod + noise) *
        (0.5 + index / (totalWaves * 2)) +
        waveThickness * (1 + index / totalWaves);

    context.lineTo(xPos, yPos);
  }

  context.closePath();

  // Градиент для волны
  const gradient = context.createLinearGradient(x, y - baseAmplitude, x, y + baseAmplitude);
  const alpha = isDark ? 0.6 : 0.8;
  gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.7})`);
  gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness + 10}%, ${alpha})`);
  gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.3})`);

  context.fillStyle = gradient;
  context.fill();

  // Добавляем эффект "шума" поверх волны
  if (isDark) {
    context.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 15}%, 0.3)`;
    context.lineWidth = 1;
    context.stroke();
  }
};

const drawStaticParticles = (frequencyData) => {
  if (!context) return;

  const isDark = document.documentElement.classList.contains('dark');
  const hue = isDark ? 250 : 320;

  particles.forEach((particle, i) => {
    const dataIndex = Math.floor(i / particles.length * analyserBufferLength);
    const audioValue = frequencyData ? frequencyData[dataIndex] / 255 : 0;

    particle.y = h / 2 + Math.sin(Date.now() * 0.001 * particle.speed + particle.offset) * 50 * (1 + audioValue);
    particle.x += particle.speed;
    if (particle.x > w) particle.x = 0;

    const size = particle.size * (1 + audioValue * 2);
    const alpha = 0.5 + audioValue * 0.5;

    context.beginPath();
    context.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    context.fillStyle = `hsla(${hue}, 80%, ${isDark ? 70 : 60}%, ${alpha})`;
    context.fill();
  });
};

const onResize = () => {
  w = window.innerWidth;
  h = window.innerHeight;
  center2D = { x: w / 2, y: h / 2 };
  if (canvas.value) {
    canvas.value.width = w;
    canvas.value.height = h;
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
};

const render = (frequencyData) => {
  if (shouldRedrawBackground.value) {
    updateCanvasBackground();
  }

  clearCanvas();

  // Рисуем радиоволны
  const waveSpacing = h / (waveCount + 1);
  for (let i = 0; i < waveCount; i++) {
    const yPos = waveSpacing * (i + 1);
    drawWave(0, yPos, w, 100, frequencyData, i, waveCount);
  }

  // Рисуем частицы-шумы
  drawStaticParticles(frequencyData);

  // Эффект мерцания (как на старом радио)
  if (Math.random() > 0.9) {
    context.fillStyle = 'rgba(255, 255, 255, 0.05)';
    context.fillRect(0, 0, w, h);
  }
};

const animate = (currentTime) => {
  if (!isPlaying.value || !analyser || audioContext?.state === 'closed') {
    return;
  }

  if (currentTime - lastFrameTime < frameInterval) {
    animationFrameId = requestAnimationFrame(animate);
    return;
  }

  lastFrameTime = currentTime;

  if (analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray);
    render(dataArray);
  }

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
      audioContext.close();
    }
  } catch (error) {
    console.error('Error in unmounted hook:', error);
  }
});

watch([isPlaying, audioElement], ([newPlaying, newAudioElement], [oldPlaying]) => {
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