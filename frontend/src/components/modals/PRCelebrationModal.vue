<template>
  <div v-if="modelValue" class="modal modal-open">
    <div class="modal-box relative">
      <button @click="$emit('update:modelValue', false)" class="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
      
      <div class="text-center py-8">
        <h3 class="text-2xl font-bold mb-4">🎉 Nuovo Record Personale! 🎉</h3>
        <p class="text-lg mb-2">Congratulazioni!</p>
        <p class="mb-4">Hai appena stabilito un nuovo record personale in:</p>
        
        <div class="bg-base-200 p-4 rounded-lg mb-6">
          <p class="text-xl font-semibold">{{ record.exercise.name }}</p>
          <p class="text-lg">{{ record.weight }} kg × {{ record.reps }} ripetizioni</p>
        </div>

        <p class="text-sm text-gray-500">Continua così! 💪</p>
      </div>

      <div class="modal-action">
        <button @click="$emit('update:modelValue', false)" class="btn btn-primary">Fantastico!</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import confetti from 'canvas-confetti';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  record: {
    type: Object,
    required: true
  }
});

defineEmits(['update:modelValue']);

let confettiInterval;

onMounted(() => {
  // Start confetti animation
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  confettiInterval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(confettiInterval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti({
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
});

onUnmounted(() => {
  if (confettiInterval) {
    clearInterval(confettiInterval);
  }
});
</script> 