<script setup>
import { useAuthStore } from '@/store/auth';
import Navbar from '@/components/layouts/Navbar.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-base-300">
    <Navbar v-if="authStore.isUserAuthenticated" />
    <router-view />
  </div>
</template>

<style scoped>

</style>
