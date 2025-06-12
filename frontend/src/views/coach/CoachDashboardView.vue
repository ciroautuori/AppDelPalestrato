<template>
  <div class="p-4 md:p-8 min-h-screen bg-base-200 text-base-content">
    <h1 class="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left text-primary">
      Coach Dashboard
    </h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card: Miei Atleti -->
      <div class="card bg-neutral text-neutral-content shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title text-2xl text-warning">Miei Atleti</h2>
          <p class="text-lg font-semibold">{{ athleteCount }} atleti assegnati</p>
          <p>Visualizza e gestisci gli atleti a te associati.</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/coach/my-athletes" class="btn btn-warning btn-sm">Vai a Atleti</router-link>
          </div>
        </div>
      </div>

      <!-- Card: Piani Creati -->
      <div class="card bg-neutral text-neutral-content shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title text-2xl text-warning">Piani Creati</h2>
          <p class="text-lg font-semibold">{{ workoutPlanCount }} piani di allenamento</p>
          <p>Crea, modifica ed assegna piani di allenamento.</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/coach/my-plans" class="btn btn-warning btn-sm">Vai a Piani</router-link>
          </div>
        </div>
      </div>

      <!-- Card: Piani Nutrizionali -->
      <div class="card bg-neutral text-neutral-content shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title text-2xl text-warning">Piani Nutrizionali</h2>
          <p class="text-lg font-semibold">{{ nutritionPlanCount }} piani nutrizionali</p>
          <p>Crea e gestisci i piani nutrizionali per i tuoi atleti.</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/coach/nutrition-plans" class="btn btn-warning btn-sm">Vai a Piani Nutrizionali</router-link>
          </div>
        </div>
      </div>

      <!-- Card: Gestione Esercizi -->
      <div class="card bg-neutral text-neutral-content shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title text-2xl text-warning">Catalogo Esercizi</h2>
          <p class="text-lg font-semibold">{{ exerciseCount }} esercizi disponibili</p>
          <p>Crea, modifica e gestisci gli esercizi disponibili per i piani di allenamento.</p>
          <div class="card-actions justify-end mt-4">
            <router-link to="/coach/exercises" class="btn btn-warning btn-sm">Vai a Esercizi</router-link>
          </div>
        </div>
      </div>

      <!-- Card: Workout Recenti Atleti -->
      <div class="card bg-neutral text-neutral-content shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title text-2xl text-warning">Workout Recenti Atleti</h2>
          <p class="text-lg font-semibold">{{ recentWorkoutsCount }} workout completati</p>
          <p>Monitora gli ultimi workout completati dai tuoi atleti.</p>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-warning btn-sm">Vai a Workout</button>
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

// Store instances
const coachStore = useCoachStore();
const nutritionStore = useNutritionStore();
const exerciseStore = useExerciseStore();

// Loading and error states
const isLoading = ref(true);
const error = ref(null);

// Computed properties for counts
const athleteCount = computed(() => coachStore.myAthletes.length);
const workoutPlanCount = computed(() => coachStore.myPlans.length);
const nutritionPlanCount = computed(() => nutritionStore.nutritionPlans.length);
const exerciseCount = computed(() => exerciseStore.exercises.length);
const recentWorkoutsCount = computed(() => coachStore.planAssignments.filter(a => a.completed).length);

// Fetch all necessary data
const fetchDashboardData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    await Promise.all([
      coachStore.fetchMyAthletes(),
      coachStore.fetchMyPlans(),
      coachStore.fetchPlanAssignments(),
      nutritionStore.fetchNutritionPlans(),
      exerciseStore.fetchExercises()
    ]);
  } catch (err) {
    error.value = 'Errore nel caricamento dei dati della dashboard. Riprova più tardi.';
    console.error('Dashboard data fetch error:', err);
  } finally {
    isLoading.value = false;
  }
};

// Fetch data when component is mounted
onMounted(fetchDashboardData);
</script>

<style scoped>
/* Scoped styles for the component if needed */
.card-title {
  /* Ensures the warning color is applied if not overridden by DaisyUI specifics */
  color: hsl(var(--wa));
}
</style>
