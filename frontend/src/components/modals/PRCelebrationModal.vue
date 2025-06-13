<template>
  <dialog :open="show" class="modal modal-bottom sm:modal-middle" @close="$emit('close')">
    <div class="modal-box text-center p-8 relative">
      <button @click="$emit('close')" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

      <div class="text-6xl mb-4 animate-bounce">🏆</div>
      <h2 class="text-4xl font-bold text-accent mb-6">NUOVO RECORD!</h2>

      <div v-if="newRecords && newRecords.length > 0" class="mb-6">
        <p class="text-lg mb-2">Congratulazioni! Hai stabilito nuovi record in:</p>
        <ul class="list-none space-y-1 text-left inline-block">
          <li v-for="(record, index) in newRecords" :key="index" class="text-lg">
            <span class="font-semibold">{{ record.exercise_name }}</span>: {{ record.type }} - {{ record.value }} {{ record.unit || 'kg' }}
          </li>
        </ul>
      </div>
      <p v-else class="text-lg mb-6">Hai raggiunto un nuovo livello, ottimo lavoro!</p>

      <div class="modal-action justify-center">
        <button @click="closeModalAndConfetti" class="btn btn-primary btn-lg">Fantastico!</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import confetti from 'canvas-confetti';

const props = defineProps({
  show: Boolean,
  newRecords: { // Array di oggetti PR: { exercise_name: 'Panca', type: '1RM', value: 100, unit: 'kg'}
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close']);

let confettiInterval = null;

const triggerConfetti = () => {
  if (typeof window !== "undefined") { // Assicurati che window sia definito
    const duration = 5 * 1000; // 5 secondi
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1050 }; // zIndex alto per stare sopra il modale

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    confettiInterval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(confettiInterval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Lancia i coriandoli da entrambi i lati
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }
};

const stopConfetti = () => {
  if (confettiInterval) {
    clearInterval(confettiInterval);
  }
  if (typeof confetti !== 'undefined' && typeof confetti.reset === 'function') {
    confetti.reset(); // Pulisce eventuali coriandoli attivi
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (document.body.classList.contains('modal-open')) {
        // Se un altro modale DaisyUI è aperto, non aggiungere di nuovo la classe
    } else {
        document.body.classList.add('modal-open');
    }
    triggerConfetti();
  } else {
    if (!document.querySelector('.modal[open]:not(.modal-leave-active)')) {
      document.body.classList.remove('modal-open');
    }
    stopConfetti();
  }
});

onUnmounted(() => {
  stopConfetti();
   if (!document.querySelector('.modal[open]:not(.modal-leave-active)')) {
      document.body.classList.remove('modal-open');
    }
});

const closeModalAndConfetti = () => {
  stopConfetti();
  emit('close');
};

// Assicurati che canvas-confetti sia installato nel progetto:
// npm install canvas-confetti
// oppure
// yarn add canvas-confetti
</script>

<style scoped>
.modal-box {
  max-width: 500px; /* O la larghezza che preferisci */
}
.animate-bounce {
  animation: bounce 1s infinite;
}
@keyframes bounce {
  0%, 100% {
    transform: translateY(-15%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}
/* DaisyUI gestisce la maggior parte degli stili del modale, inclusa la visibilità tramite l'attributo `open` */
/* e la classe modal-open su body */
</style>
