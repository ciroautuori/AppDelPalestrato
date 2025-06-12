<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">I Miei Atleti</h1>
    </div>

    <!-- Loading State -->
    <div v-if="coachStore.athletesLoading" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="coachStore.athletesError" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ coachStore.athletesError }}</span>
    </div>

    <!-- Athletes List -->
    <div v-else-if="myAthletes.length > 0" class="space-y-4">
      <ul class="menu bg-base-200 w-full rounded-box">
        <li v-for="athlete in myAthletes" :key="athlete.id">
          <a class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div class="avatar placeholder">
                <div class="bg-neutral text-neutral-content rounded-full w-12">
                  <span>{{ getInitials(athlete.name || athlete.email) }}</span>
                </div>
              </div>
              <div>
                <span class="font-semibold">{{ athlete.name || athlete.email }}</span>
                <p class="text-sm text-gray-500">{{ athlete.email }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-ghost" @click="viewAthleteDetails(athlete)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-ghost" @click="viewAthletePlans(athlete)">
                <i class="fas fa-dumbbell"></i>
              </button>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <p class="text-lg text-gray-600">
        Non hai ancora atleti assegnati.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useCoachStore } from '@/store/coach';
import { useToastStore } from '@/store/toast';

const coachStore = useCoachStore();
const toastStore = useToastStore();

// Computed properties
const myAthletes = computed(() => coachStore.myAthletes);

// Methods
const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const viewAthleteDetails = (athlete) => {
  // TODO: Implement view athlete details
  console.log('View athlete details:', athlete);
};

const viewAthletePlans = (athlete) => {
  // TODO: Implement view athlete plans
  console.log('View athlete plans:', athlete);
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await coachStore.fetchMyAthletes();
  } catch (error) {
    toastStore.showToast('Errore nel caricamento degli atleti', 'error');
  }
});
</script>

<style scoped>
/* Custom styles if DaisyUI defaults are not sufficient */
.table th.text-warning, .table td .btn-warning {
  /* Ensure DaisyUI warning color is applied */
}
.table th {
  background-color: hsl(var(--n)); /* Using neutral for header background for better contrast with yellow */
  color: hsl(var(--nc)); /* Neutral content color for text */
}
.table th.text-warning {
   color: hsl(var(--wa)); /* Warning color for specific headers */
}

.hover\:bg-base-100\/50:hover {
    --tw-bg-opacity: 0.5;
    background-color: hsl(var(--b1) / var(--tw-bg-opacity));
}
</style>
