<template>
  <!-- Floating Action Button -->
  <div class="fixed bottom-6 right-6 z-50">
    <button
      v-if="athleteStore.assignedWorkoutPlan"
      @click="openLogModal"
      class="btn btn-warning btn-circle btn-lg shadow-lg hover:shadow-xl transition-all duration-300"
      :class="{ 'loading': athleteStore.isLoggingWorkout }"
      :disabled="athleteStore.isLoggingWorkout"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>

  <!-- Modale di Logging Workout -->
  <WorkoutLogFormModal
    v-if="isLogModalOpen"
    :show-modal="isLogModalOpen"
    :workout-plan="athleteStore.assignedWorkoutPlan"
    @close-modal="closeLogModal"
  />
</template>

<script setup>
import { ref } from 'vue';
import WorkoutLogFormModal from '@/components/athlete/WorkoutLogFormModal.vue';

const isLogModalOpen = ref(false);

const openLogModal = () => {
  isLogModalOpen.value = true;
};

const closeLogModal = () => {
  isLogModalOpen.value = false;
};

const handleSaveWorkout = async (logData) => {
  try {
    await athleteStore.logWorkout(logData);
    closeLogModal();
    // Ricarica i dati dell'atleta per aggiornare eventuali statistiche
    await athleteStore.fetchMyData();
  } catch (error) {
    console.error('Errore durante il salvataggio del workout:', error);
  }
};
</script> 