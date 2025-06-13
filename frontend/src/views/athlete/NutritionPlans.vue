<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">My Nutrition Plans</h1>

    <!-- Loading State -->
    <div v-if="athleteStore.isLoading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="athleteStore.error" class="alert alert-error">
      <span>{{ athleteStore.error }}</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="!athleteStore.assignedNutritionPlans.length" class="text-center py-8">
      <h3 class="text-lg font-semibold mb-2">No Nutrition Plans Assigned</h3>
      <p class="text-gray-600">Your coach hasn't assigned any nutrition plans yet.</p>
    </div>

    <!-- Plans List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="plan in athleteStore.assignedNutritionPlans" :key="plan.id" 
           class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
           @click="viewPlanDetails(plan)">
        <div class="card-body">
          <h2 class="card-title">{{ plan.name }}</h2>
          <p>{{ plan.description }}</p>
          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">Calories</div>
              <div class="stat-value">{{ plan.total_calories }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Protein</div>
              <div class="stat-value">{{ plan.total_protein }}g</div>
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary">View Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAthleteStore } from '@/stores/athlete';

const athleteStore = useAthleteStore();
const router = useRouter();

onMounted(async () => {
  await athleteStore.fetchAssignedNutritionPlans();
});

const viewPlanDetails = (plan) => {
  router.push(`/athlete/nutrition-plans/${plan.id}`);
};
</script> 