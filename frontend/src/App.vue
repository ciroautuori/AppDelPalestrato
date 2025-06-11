<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from './layouts/AppLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

const route = useRoute();
const layout = computed(() => {
  if (route.meta.layout === 'AppLayout') {
    return AppLayout;
  }
  if (route.meta.layout === 'AuthLayout') {
    return AuthLayout;
  }
  return 'div'; // Fallback to a simple div if no layout specified
});
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped>

</style>
