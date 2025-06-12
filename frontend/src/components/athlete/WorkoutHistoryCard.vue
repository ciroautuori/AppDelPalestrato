<template>
  <div class="card bg-gray-800 shadow-xl hover:bg-gray-700 transition-colors">
    <div class="card-body p-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 class="text-lg font-semibold text-warning">
            {{ formatDate(workoutLog.created_at) }}
          </h3>
          <p class="text-sm text-gray-300 mt-1">
            {{ workoutLog.workout_plan?.name || 'Piano di Allenamento' }}
          </p>
          <p class="text-sm text-gray-400 mt-2">
            {{ workoutLog.exercise_logs?.length || 0 }} esercizi completati
          </p>
        </div>
        <button
          @click="showDetails"
          class="btn btn-warning btn-sm"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
          Vedi Dettagli
        </button>
      </div>
    </div>
  </div>

  <!-- Modale Dettagli -->
  <dialog class="modal modal-bottom sm:modal-middle" :open="isDetailsModalOpen">
    <div class="modal-box bg-gray-800 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
      <button
        @click="closeDetails"
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
      
      <h3 class="font-bold text-lg text-warning mb-6">
        Dettagli Allenamento - {{ formatDate(workoutLog.created_at) }}
      </h3>

      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <span class="loading loading-spinner loading-lg text-warning"></span>
      </div>

      <div v-else-if="error" class="alert alert-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <div v-else class="space-y-6">
        <!-- Esercizi Completati -->
        <div v-for="exerciseLog in workoutLog.exercise_logs" :key="exerciseLog.id" 
             class="card bg-gray-700 shadow-xl">
          <div class="card-body p-4">
            <h4 class="text-lg font-semibold text-warning">
              {{ exerciseLog.exercise?.name }}
            </h4>

            <!-- Serie Completate -->
            <div class="overflow-x-auto mt-4">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th class="text-warning">Serie</th>
                    <th class="text-warning">Peso (kg)</th>
                    <th class="text-warning">Ripetizioni</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(set, index) in exerciseLog.sets_data" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ set.weight }}</td>
                    <td>{{ set.reps }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Note Esercizio -->
            <div v-if="exerciseLog.notes" class="mt-4">
              <p class="text-sm text-gray-300">
                <span class="font-medium">Note:</span> {{ exerciseLog.notes }}
              </p>
            </div>
          </div>
        </div>

        <!-- Note Generali -->
        <div v-if="workoutLog.notes" class="card bg-gray-700 shadow-xl">
          <div class="card-body p-4">
            <h4 class="text-lg font-semibold text-warning mb-2">Note Generali</h4>
            <p class="text-gray-300">{{ workoutLog.notes }}</p>
          </div>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeDetails">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref } from 'vue';
import { athleteService } from '@/services/athleteService';
import { useToastStore } from '@/store/toast';

const props = defineProps({
  workoutLog: {
    type: Object,
    required: true
  }
});

const toastStore = useToastStore();
const isLoading = ref(false);
const error = ref(null);
const isDetailsModalOpen = ref(false);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const showDetails = async () => {
  isDetailsModalOpen.value = true;
  isLoading.value = true;
  error.value = null;

  try {
    // Se i dettagli non sono già caricati, li recuperiamo
    if (!props.workoutLog.exercise_logs) {
      const details = await athleteService.getWorkoutLogDetails(props.workoutLog.id);
      Object.assign(props.workoutLog, details);
    }
  } catch (err) {
    error.value = err.response?.data?.detail || 'Errore nel caricamento dei dettagli';
    toastStore.showToast(error.value, 'error');
  } finally {
    isLoading.value = false;
  }
};

const closeDetails = () => {
  isDetailsModalOpen.value = false;
};
</script>

<style scoped>
.modal-box {
  @apply bg-gray-800 text-white;
}

.table {
  @apply text-white;
}

.table th {
  @apply bg-gray-700 text-warning;
}

.table td {
  @apply bg-gray-700;
}

.table tr:hover td {
  @apply bg-gray-600;
}
</style> 