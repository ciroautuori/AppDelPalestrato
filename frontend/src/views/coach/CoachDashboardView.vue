<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-yellow-500 mb-6">Dashboard Coach</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="loading loading-spinner loading-lg text-warning"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error mb-4">
      <span>{{ error }}</span>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Athletes Card -->
        <router-link to="/coach/my-athletes" class="card bg-gray-800 hover:bg-gray-700 transition-colors">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">{{ athleteCount }}</h2>
                <p class="text-gray-400">Atleti Assegnati</p>
              </div>
              <div class="text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Workout Plans Card -->
        <router-link to="/coach/plans" class="card bg-gray-800 hover:bg-gray-700 transition-colors">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">{{ workoutPlanCount }}</h2>
                <p class="text-gray-400">Piani Allenamento</p>
              </div>
              <div class="text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Nutrition Plans Card -->
        <router-link to="/coach/nutrition-plans" class="card bg-gray-800 hover:bg-gray-700 transition-colors">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">{{ nutritionPlanCount }}</h2>
                <p class="text-gray-400">Piani Nutrizionali</p>
              </div>
              <div class="text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>

        <!-- Exercises Card -->
        <router-link to="/coach/exercises" class="card bg-gray-800 hover:bg-gray-700 transition-colors">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">{{ exerciseCount }}</h2>
                <p class="text-gray-400">Esercizi</p>
              </div>
              <div class="text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Plans Distribution Chart -->
        <div class="card bg-gray-800">
          <div class="card-body">
            <h3 class="card-title text-white mb-4">Distribuzione Piani</h3>
            <CoachSummaryChart
              :workout-plans="workoutPlanCount"
              :nutrition-plans="nutritionPlanCount"
              :exercises="exerciseCount"
            />
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card bg-gray-800">
          <div class="card-body">
            <h3 class="card-title text-white mb-4">Attività Recenti</h3>
            <div v-if="recentActivities.length === 0" class="text-gray-400 text-center py-4">
              Nessuna attività recente
            </div>
            <div v-else class="space-y-4">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-white">{{ activity.description }}</p>
                  <p class="text-sm text-gray-400">{{ formatDate(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCoachStore } from '@/store/coach';
import { useNutritionStore } from '@/store/nutrition';
import { useExerciseStore } from '@/store/exercise';
import CoachSummaryChart from '@/components/charts/CoachSummaryChart.vue';

const coachStore = useCoachStore();
const nutritionStore = useNutritionStore();
const exerciseStore = useExerciseStore();

const isLoading = ref(true);
const error = ref(null);
const recentActivities = ref([]);

// Computed properties for stats
const athleteCount = computed(() => coachStore.athletes?.length ?? 0);
const workoutPlanCount = computed(() => coachStore.plans?.length ?? 0);
const nutritionPlanCount = computed(() => nutritionStore.nutritionPlans?.length ?? 0);
const exerciseCount = computed(() => exerciseStore.exercises?.length ?? 0);

// Format date helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fetch all required data
const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Fetch data in parallel
    await Promise.all([
      coachStore.fetchMyAthletes(),
      coachStore.fetchMyPlans(),
      nutritionStore.fetchNutritionPlans(),
      exerciseStore.fetchExercises()
    ]);

    // Simulate recent activities (replace with real data when available)
    recentActivities.value = [
      {
        id: 1,
        description: 'Nuovo piano di allenamento creato per Mario Rossi',
        timestamp: new Date()
      },
      {
        id: 2,
        description: 'Piano nutrizionale aggiornato per Anna Verdi',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 3,
        description: 'Nuovo esercizio aggiunto alla libreria',
        timestamp: new Date(Date.now() - 7200000)
      }
    ];
  } catch (err) {
    error.value = 'Errore nel caricamento dei dati della dashboard';
    console.error('Dashboard data fetch error:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.card {
  @apply shadow-lg rounded-lg overflow-hidden;
}

.card-body {
  @apply p-4;
}

.card-title {
  @apply text-lg font-semibold;
}
</style>
