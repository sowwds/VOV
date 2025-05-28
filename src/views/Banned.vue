<template>
  <div class="min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col justify-center items-center text-center px-4">
    <div class="max-w-md">
      <h1 class="text-4xl font-bold text-light-primary dark:text-dark-primary mb-4">Ваш аккаунт заблокирован</h1>
      <p class="text-lg text-light-text dark:text-dark-text mb-2">
        Ваш аккаунт был заблокирован по определенной причине.
        Для получения дополнительной информации, пожалуйста, свяжитесь с администрацией.
      </p>
      <p class="text-lg text-light-text dark:text-dark-text mb-6">
        Email для связи:
        <a href="mailto:melbanned@gmail.com" class="text-light-primary dark:text-dark-primary hover:underline">
          melbanned@gmail.com
        </a>
      </p>
      <img
          src="../assets/banned.jpg"
          alt="Banned illustration"
          class="mx-auto w-full max-w-xs"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BannedPage'
}
</script>