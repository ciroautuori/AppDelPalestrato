<template>
  <div v-if="toastStore.visible" 
       :class="[
         'toast toast-top toast-center z-50',
         toastStore.type === 'success' ? 'alert-success' : 'alert-error'
       ]">
    <div class="alert">
      <span>{{ toastStore.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '@/store/toast';

const toastStore = useToastStore();
</script>

<style scoped>
.toast {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
}
</style> 