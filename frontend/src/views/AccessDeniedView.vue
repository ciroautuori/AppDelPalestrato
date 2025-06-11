<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold text-error">Access Denied</h1>
        <p class="py-6 text-base-content">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <button @click="goBack" class="btn btn-warning">Go Back</button>
      </div>
    </div>
  </div>
</template> 