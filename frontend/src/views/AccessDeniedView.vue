<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Accesso Negato
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          Non hai i permessi necessari per accedere a questa pagina.
        </p>
      </div>
      <div class="mt-8">
        <router-link
          to="/login"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Torna al Login
        </router-link>
      </div>
    </div>
  </div>
</template> 