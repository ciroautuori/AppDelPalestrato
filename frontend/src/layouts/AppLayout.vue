<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation Component (handles both sidebar and dock) -->
    <Navigation />

    <!-- Main Content -->
    <div class="md:pl-64"> <!-- Add padding for sidebar on desktop -->
      <main class="min-h-screen pb-16 md:pb-0"> <!-- Add padding for dock on mobile -->
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navigation from '@/components/layouts/Navigation.vue';
</script> 