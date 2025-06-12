<template>
  <div class="p-4">
    <Toast />
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-yellow-500">Mio Storico Allenamenti</h1>
    </div>

    <!-- Loading State -->
    <div v-if="athleteStore.isLoading" class="flex justify-center items-center py-8">
      <div class="loading loading-spinner loading-lg text-warning"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="athleteStore.error" class="alert alert-error mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ athleteStore.error }}</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="!workoutHistory.length" class="text-center py-8">
      <div class="max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-lg font-medium text-gray-300 mb-2">Nessun allenamento registrato</h3>
        <p class="text-gray-400">
          Inizia a registrare i tuoi allenamenti per tenere traccia dei tuoi progressi.
        </p>
      </div>
    </div>

    <!-- Workout History List -->
    <div v-else class="overflow-x-auto bg-gray-800 rounded-lg shadow">
      <div class="space-y-4 p-4">
        <WorkoutHistoryCard
          v-for="workoutLog in workoutHistory"
          :key="workoutLog.id"
          :workout-log="workoutLog"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAthleteStore } from '@/store/athlete';
import WorkoutHistoryCard from '@/components/athlete/WorkoutHistoryCard.vue';
import Toast from '@/components/Toast.vue';

const athleteStore = useAthleteStore();
const workoutHistory = computed(() => athleteStore.workoutHistory || []);

onMounted(async () => {
  try {
    await athleteStore.fetchWorkoutHistory();
  } catch (error) {
    console.error('Error fetching workout history:', error);
  }
});
</script>

<style scoped>
/* Custom styles if needed */
.overflow-x-auto {
  max-width: 100%;
  margin: 0 auto;
}
</style> 