<template>
    <div id="pageContent">
      <!-- Контейнер для звёзд -->
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <!-- Контейнер для прокрутки изображений -->
        <div class="h-screen relative z-0">
            <div id="titles">
                <div id="titlecontent">
                    <div v-for="(row, rowIndex) in imageRows" :key="rowIndex" class="image-row">
                        <img v-for="(src, colIndex) in row" :key="colIndex" :src="src" alt="Crawl image" class="crawl-image" />
                    </div>
                </div>
            </div>
            <div class="mt-60 absolute left-1/2 transform -translate-x-1/2">
                <div class="flex mx-auto justify-around">
                    <div class="text-center text-dark-text flex flex-col">
                        <h1 class="text-4xl sm:text-6xl font-bold mb-6
                        bg-gradient-to-br from-dark-text via-dark-text to-sky-50/50
                        inline-block text-transparent bg-clip-text">
                            Голос победы
                        </h1>
                        <p class="text-sm sm:text-base
                        bg-gradient-to-br from-dark-text via-dark-text to-sky-50/50
                        inline-block text-transparent bg-clip-text">
                            Сохраняем музыкальное наследие
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center text-dark-text flex flex-col mt-40">
            <div class="flex flex-col">
                <div class="flex flex-row justify-center gap-5 sm:gap-15 -mb-9" id="sectionIcon">
                    <HeartIcon class="w-20 h-20" />
                    <BuildingLibraryIcon class="w-20 h-20" />
                    <WrenchScrewdriverIcon class="w-20 h-20" />
                </div>
                <h1 class="text-3xl sm:text-5xl font-bold mb-6
                    bg-gradient-to-br from-dark-text via-dark-text to-sky-50/50
                    inline-block text-transparent bg-clip-text">
                        Наши функции
                </h1>
                    <p class="text-sm sm:text-base
                    bg-gradient-to-br from-dark-text via-dark-text to-sky-50/50
                    inline-block text-transparent bg-clip-text">
                        на что способен сервис
                </p>
            </div>
            <div class="max-w-screen-xl mx-auto my-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 z-2
                *:min-h-100 *:min-w-3xs *:p-6 *:overflow-hidden
                *:bg-dark-surface *:border-1 *:border-gray-600 *:rounded-3xl">
                <div class=" sm:col-span-2 text-left">
                    <h1 class="text-xl font-bold">Библиотека</h1>
                    <span class="text-sm text-gray-400">исследуйте все публичные треки</span>
                    <!-- картинка -->
                    <div class=" w-full h-full flex flex-col p-4">
                        <div class="flex flex-row gap-3
                        *:h-40 *:w-30 *:p-2 *:bg-gray-700 *:rounded-md *:hover:scale-105 *:ease-in-out *:duration-200">
                            <div>
                                <div class="bg-gray-600 p-2 rounded-sm">
                                    <MusicalNoteIcon class="h-20"/>
                                </div>
                                <h1>Song name</h1>
                                <span class="text-xs text-gray-400">Artist name</span>
                            </div>
                            <div>
                                <div class="bg-gray-600 p-2 rounded-sm">
                                    <MusicalNoteIcon class="h-20"/>
                                </div>
                                <h1>Song name</h1>
                                <span class="text-xs text-gray-400">Artist name</span>
                            </div>
                            <div class="hidden sm:block">
                                <div class="bg-gray-600 p-2 rounded-sm">
                                    <MusicalNoteIcon class="h-20"/>
                                </div>
                                <h1>Song name</h1>
                                <span class="text-xs text-gray-400">Artist name</span>
                            </div>
                        </div>
                        <div class="*:h-10 *:w-full *:bg-gray-700 *:mt-3 *:p-2 *:rounded-md *:hover:scale-105 *:ease-in-out *:duration-200">
                            <div class="*:h-6 *:rounded *:bg-gray-600 flex flex-row gap-4">
                                <MusicalNoteIcon/> Song name
                            </div>
                            <div class="*:h-6 *:rounded *:bg-gray-600 flex flex-row gap-4">
                                <MusicalNoteIcon/> Song name
                            </div>
                            <div class="*:h-6 *:rounded *:bg-gray-600 flex flex-row gap-4">
                                <MusicalNoteIcon/> Song name
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-left">
                    <h1 class="text-xl font-bold">Поиск</h1>
                    <span class="text-sm text-gray-400">находите то, что нужно</span>
                    <div class=" w-full h-full flex flex-col p-4">
                        <div class="h-10 w-full bg-gray-900 mt-3 p-2 rounded-md flex flex-row justify-between">
                            <span>Son</span>
                            <MagnifyingGlassIcon class="h-6"/>
                        </div>
                        <div class="*:h-10 *:w-full *:bg-gray-700 *:mt-3 *:p-2 *:rounded-md *:hover:scale-105 *:ease-in-out *:duration-200">
                            <div class=" flex flex-row gap-4">
                                <MusicalNoteIcon class="h-6 rounded bg-gray-600"/> <div><span class="underline">Son</span>g name</div>
                            </div>
                            <div class=" flex flex-row gap-4">
                                <MusicalNoteIcon class="h-6 rounded bg-gray-600"/> <div><span class="underline">Son</span>g name</div>
                            </div>
                            <div class=" flex flex-row gap-4">
                                <MusicalNoteIcon class="h-6 rounded bg-gray-600"/> <div><span class="underline">Son</span>g name</div>
                            </div>
                            <div class=" flex flex-row gap-4">
                                <MusicalNoteIcon class="h-6 rounded bg-gray-600"/> <div><span class="underline">Son</span>g name</div>
                            </div>
                        </div>
                    </div>
                </div>
              <MiniVisualizer class="text-left">
                <h1 class="text-xl font-bold">Визуализация музыки</h1>
              </MiniVisualizer>
                <div class="text-left">
                    <h1 class="text-xl font-bold">Лайки</h1>
                    <span class="text-sm text-gray-400">сохраняйте понравившееся</span>
                    <div class=" w-full h-full flex flex-col gap-4 p-2">
                        <div class=" w-full  p-3 flex flex-row justify-around">
                            <BuildingLibraryIcon class="h-10  my-auto"/>
                            <div class="
                             h-40 w-30 p-2 bg-gray-700 rounded-md hover:scale-105 ease-in-out duration-200">
                                <div class="bg-gray-600 p-2 rounded-sm">
                                    <MusicalNoteIcon class="h-20"/>
                                </div>
                                <h1>Song name</h1>
                                <span class="text-xs text-gray-400">Artist name</span>
                            </div>
                        </div>
                        <div class=" w-full  p-3 flex flex-row justify-around">
                            <HeartIcon class="h-10  my-auto  fill-dark-primary"/>
                            <div class="
                             h-40 w-30 p-2 bg-gray-700 rounded-md hover:scale-105 ease-in-out duration-200">
                                <div class="bg-dark-primary p-2 rounded-sm">
                                    <MusicalNoteIcon class="h-20"/>
                                </div>
                                <h1>Song name</h1>
                                <span class="text-xs text-gray-400">Artist name</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-left">
                    <h1 class="text-xl font-bold">Авторизация</h1>
                    <span class="text-sm text-gray-400">выберите удобный способ</span>
                    <div class=" w-full h-full flex flex-col gap-2 px-2 content-center *:mx-auto justify-center">
                        <img class="w-25 h-25 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/5/58/Yandex_icon.svg"/>
                        <span>или</span>
                        <img class="w-25 h-25 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"/>

                    </div>
                </div>
                <div class="text-left sm:col-span-2">
                    <h1 class="text-xl font-bold">Реставрация</h1>
                    <span class="text-sm text-gray-400">улучшите старые и поврежденные записи</span>
                    <div class=" w-full h-[80%] flex flex-col px-2 content-center justify-around">
                    <div class="flex flex-row">
                        <DocumentPlusIcon class="h-10"/>
                        <span class="m-2">Загрузите файл</span>
                    </div>
                    <div class="flex flex-row">
                        <SparklesIcon class="h-10"/>
                        <span class="m-2">Подождите обработку</span>
                    </div>
                    <div class="flex flex-row">
                        <PencilSquareIcon class="h-10"/>
                        <span class="m-2">Отредактируйте метаданные</span>
                    </div>
                    <div class="flex flex-row">
                        <ArrowDownOnSquareIcon class="h-10"/>
                        <span class="m-2">Сохраните результат</span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>

  <script setup>
  import { onMounted } from 'vue';

  import {
  HeartIcon,
  BuildingLibraryIcon,
  MusicalNoteIcon,
  MagnifyingGlassIcon,
  DocumentPlusIcon,
  SparklesIcon,
  PencilSquareIcon,
  ArrowDownOnSquareIcon,
} from '@heroicons/vue/24/outline'
import WrenchScrewdriverIcon from '@/components/icons/WrenchScrewdriverIcon.vue'

  import songcard from '@/assets/home/songcard.jpg';

  import image1 from '@/assets/home/image1.jpg';
  import image2 from '@/assets/home/image2.jpg';
  import image3 from '@/assets/home/image3.jpg';
  import image4 from '@/assets/home/image4.jpg';
  import MiniVisualizer from "@/components/AudioVisualizer/MiniVisualizer.vue";

  const imageSources = [image1, image2, image3, image4];

  // Генерируем случайные ряды изображений
  const rows = 15;
  const imagesPerRow = 4;
  const imageRows = Array.from({ length: rows }, () =>
    Array.from({ length: imagesPerRow }, () => imageSources[Math.floor(Math.random() * imageSources.length)])
  );

  // Функция для генерации box-shadow для звёзд
  const generateBoxShadow = (n) => {
    let value = `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
    for (let i = 1; i < n; i++) {
      value += `, ${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
    }
    return value;
  };

  // Применяем box-shadow для звёзд
  onMounted(() => {
    const titleContent = document.getElementById('titlecontent');
    // Дублируем содержимое для бесконечной прокрутки
    titleContent.innerHTML += titleContent.innerHTML;

    // Задаём стили для звёзд
    const stars = document.getElementById('stars');
    const stars2 = document.getElementById('stars2');
    const stars3 = document.getElementById('stars3');
    stars.style.boxShadow = generateBoxShadow(700);
    stars2.style.boxShadow = generateBoxShadow(200);
    stars3.style.boxShadow = generateBoxShadow(100);
  });
  </script>

  <style>

  #pageContent {

    margin: -64px;
    padding: 0;
    overflow: hidden;
    background: radial-gradient(ellipse at bottom, #352a1b 0%, #0f0d09 100%);

  }

  #sectionIcon{
    -webkit-mask-image: -webkit-linear-gradient(top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
  }

  #stars, #stars2, #stars3 {
    position: absolute;
    background: transparent;
    z-index: 0;
    top: 0;
    left: 0;
  }

  #stars {
    width: 1px;
    height: 1px;
    animation: animStar 50s linear infinite;
  }
  #stars:after {
    content: ' ';
    position: absolute;
    top: 2000px;
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: inherit;
  }

  #stars2 {
    width: 2px;
    height: 2px;
    animation: animStar 100s linear infinite;
  }
  #stars2:after {
    content: ' ';
    position: absolute;
    top: 2000px;
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: inherit;
  }

  #stars3 {
    width: 3px;
    height: 3px;
    animation: animStar 150s linear infinite;
  }
  #stars3:after {
    content: ' ';
    position: absolute;
    left: 50%;
    top: 2000px;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: inherit;
  }

  #titles {
    position: absolute;
    width: 18em;
    height: 50em;
    bottom: 0;
    left: 50%;
    margin-left: -9em;
    font-size: 350%;
    overflow: hidden;
    transform-origin: 50% 100%;
    transform: perspective(300px) rotateX(25deg);
    background-color: transparent; /* Прозрачный фон, чтобы видеть звёзды */
    -webkit-mask-image: -webkit-linear-gradient(bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%);
  }

  #titles:after {
    position: absolute;
    content: ' ';
    left: 0;
    right: 0;
    top: 0;
    bottom: 60%;
    /* background-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 100%); */
    pointer-events: none;
  }

  #titlecontent {
    position: absolute;
    width: 100%;
    animation: scroll 20s linear infinite;
  }

  .image-row {
    display: flex;
    justify-content: space-around;
    margin: 40px 0;
  }

  .crawl-image {
    width: 20%;
    height: auto;
  }

  @keyframes scroll {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }

  @keyframes animStar {
    from { transform: translateY(0px) scale(1);}
    to { transform: translateY(-200px) scale(1);}
  }
  </style>
