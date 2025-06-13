<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">I Miei Piani di Allenamento</h1>

    <div v-if="athleteStore.isLoading" class="text-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="athleteStore.error" class="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Errore: {{ athleteStore.error }}</span>
      </div>
    </div>

    <div v-else-if="!athleteStore.assignedWorkoutPlans || athleteStore.assignedWorkoutPlans.length === 0" class="text-center text-gray-500">
      Nessun piano di allenamento assegnato.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="plan in athleteStore.assignedWorkoutPlans" :key="plan.id" class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ plan.name }}</h2>
          <p>{{ plan.description }}</p>
          <div class="card-actions justify-end">
            <router-link :to="{ name: 'WorkoutPlanDetail', params: { id: plan.id } }" class="btn btn-primary btn-sm">
              Visualizza Dettagli
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAthleteStore } from '@/stores/athlete';

const athleteStore = useAthleteStore();

onMounted(() => {
  athleteStore.fetchAssignedWorkoutPlans();
});
</script>
