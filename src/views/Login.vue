<template>
    <div class="flex h-full relative items-center justify-center">
        <div class="flex flex-col w-100 max-w-md items-center
        bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text
         border-2 border-light-border dark:border-dark-border rounded-lg
        shadow-xl/30
        p-5
        space-y-4
        ">
            <h1 class="text-2xl font-semibold leading-[1.3] mb-5">Вход</h1>
            <p class="text-center text-sm">Для работы сайта требуется авторизация, выберите удобный вариант:</p>
            <button class="bg-light-primary dark:bg-dark-primary hover:bg-light-secondary hover:dark:bg-dark-secondary text-white p-4 rounded-lg flex flex-row items-center transition-colors duration-150" @click="loginWithYandex">
                <img class="w-10 h-10 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/5/58/Yandex_icon.svg"/>
                Войти через Yandex</button>
            <button class="bg-light-primary dark:bg-dark-primary hover:bg-light-secondary hover:dark:bg-dark-secondary text-white p-4 rounded-lg flex flex-row items-center transition-colors duration-150" @click="loginWithGoogle">
                <img class="w-9 h-9 mr-2" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"/>
                Войти через Google</button>
        </div>
    </div>
  </template>

  <script setup>
  import { startLogin } from '@/services/authservice';

  const loginWithYandex = () => {
    startLogin('yandex');
  };

  const loginWithGoogle = () => {
    startLogin('google');
  };
  </script>
