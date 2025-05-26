<!-- src/components/Sidebar/SearchInput.vue -->
<template>
    <div class="relative">
      <input
        autofocus
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="$emit('search', $event.target.value)"
        :placeholder="placeholder"
        class="w-full px-4 py-2 pr-16 border rounded bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
      />
      <button
        v-if="modelValue"
        class="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-light-primary dark:hover:text-dark-primary"
        @click="$emit('clear')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-light-primary dark:hover:text-dark-primary"
        @click="$emit('search', modelValue)"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </template>

  <script setup>
  defineProps(['modelValue', 'placeholder']);
  defineEmits(['update:modelValue', 'search', 'clear']);
  </script>
