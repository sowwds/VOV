<script setup>
import { ref } from 'vue';
import UploadModal from '@/components/modal/UploadModal.vue';

const isOpen = ref(false);

const openUploadModal = () => {
  console.log('Opening modal, isOpen:', true);
  isOpen.value = true;
};

const closeUploadModal = () => {
  console.log('Closing modal, isOpen:', false);
  isOpen.value = false;
};
</script>

<template>
  <div class="background w-full h-full">
    <div class="content relative text-white text-center p-5 flex flex-col items-center justify-center h-full">
      <h1 class="text-4xl font-bold mb-4">Реставрация аудиозаписей</h1>
      <p class="text-lg mb-6">Загрузите аудиозаписи для реставрации.</p>
      <button
        class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        @click="openUploadModal"
      >
        Загрузить
      </button>
    </div>
    <UploadModal :is-open="isOpen" @close="closeUploadModal" />
  </div>
</template>

<style scoped>
.background {
  background-image: linear-gradient(
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.7)
  ),
  url('https://img-s1.onedio.com/id-5ed8f8546a10a6e00ebf2a5e/rev-0/w-600/h-334/f-gif/s-05376e48073c28101c505d4a1c0c10eeb9922de2.gif');
  background-size: cover;
  background-position: center;
}
</style>
