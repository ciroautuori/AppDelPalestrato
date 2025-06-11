<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold text-warning">404</h1>
        <p class="py-6 text-base-content">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button @click="goHome" class="btn btn-warning">Go Home</button>
      </div>
    </div>
  </div>
</template> 