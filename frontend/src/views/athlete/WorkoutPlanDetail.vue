<template>
  <div class="p-4">
    <div v-if="isLoading" class="text-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else-if="error" class="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Errore: {{ error }}</span>
      </div>
    </div>
    <div v-else-if="plan" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl font-bold mb-4">{{ plan.name }}</h1>
        <p class="mb-2"><strong>Descrizione:</strong> {{ plan.description }}</p>
        <!-- More details can be added here as needed -->
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      Piano di allenamento non trovato.
    </div>
    <router-link :to="{ name: 'MyWorkoutPlans' }" class="btn btn-link mt-4">Torna ai miei piani</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAthleteStore } from '@/stores/athlete'; // Or a dedicated service/store for fetching single plan details

const route = useRoute();
const athleteStore = useAthleteStore(); // Assuming plans are already fetched or can be fetched individually

const planId = computed(() => route.params.id);
const plan = ref(null);
const isLoading = ref(false);
const error = ref(null);

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // Attempt to find the plan in the existing list first
    let foundPlan = athleteStore.assignedWorkoutPlans.find(p => p.id.toString() === planId.value);

    if (foundPlan) {
      plan.value = foundPlan;
    } else {
      // If not found, and if athleteStore doesn't have a method to fetch a single plan,
      // this indicates a potential need for such a method or a different approach.
      // For now, we'll simulate fetching it or assume it should be in the list.
      // This might require an actual API call: e.g., planService.getWorkoutPlanById(planId.value)
      // The issue description for athlete store only has fetchAssignedWorkoutPlans (plural)
      // So, we will rely on the plan being in the list.
      await athleteStore.fetchAssignedWorkoutPlans(); // Ensure list is populated
      foundPlan = athleteStore.assignedWorkoutPlans.find(p => p.id.toString() === planId.value);
      if (foundPlan) {
        plan.value = foundPlan;
      } else {
        throw new Error('Piano non trovato.');
      }
    }
  } catch (err) {
    console.error('Error fetching workout plan detail:', err);
    error.value = err.message || 'Impossibile caricare i dettagli del piano.';
  } finally {
    isLoading.value = false;
  }
});
</script>
