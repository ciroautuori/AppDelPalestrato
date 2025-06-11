<template>
  <div class="p-4 md:p-8 min-h-screen bg-base-200 text-base-content">
    <h1 class="text-3xl md:text-4xl font-bold mb-6 text-primary">I Miei Atleti</h1>

    <div v-if="authStore.user && authStore.user.pk">
      <div v-if="athleteStore.isLoadingAthletes" class="flex justify-center items-center py-10">
        <span class="loading loading-spinner loading-lg text-warning"></span>
        <p class="ml-4 text-lg">Caricamento atleti...</p>
      </div>

      <div v-else-if="athleteStore.errorAthletes" class="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Errore nel caricamento degli atleti: {{ athleteStore.errorAthletes }}</span>
        </div>
      </div>

      <div v-else-if="athleteStore.athletes.length === 0" class="text-center py-10">
        <p class="text-xl">Nessun atleta trovato.</p>
        <!-- Optional: Add a button or link to invite/add athletes if applicable -->
      </div>

      <div v-else>
        <div class="overflow-x-auto bg-neutral text-neutral-content shadow-md rounded-lg">
          <table class="table w-full">
            <thead class="bg-base-300">
              <tr>
                <th class="text-warning">Nome/Email Atleta</th>
                <th class="text-warning">Piani Assegnati</th>
                <th class="text-warning">Ultimo Workout</th>
                <th class="text-warning">Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="athlete in athleteStore.athletes" :key="athlete.id" class="hover:bg-base-100/50">
                <td>
                  <div class="font-bold">{{ athlete.first_name }} {{ athlete.last_name }}</div>
                  <div class="text-sm opacity-80">{{ athlete.email }}</div>
                </td>
                <td>N/A</td> <!-- Placeholder -->
                <td>N/A</td> <!-- Placeholder -->
                <td>
                  <button class="btn btn-xs btn-outline btn-warning">Vedi Dettagli</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center items-center mt-8 space-x-2" v-if="athleteStore.paginationAthletes.totalPages > 1">
          <button
            @click="changePage(athleteStore.paginationAthletes.currentPage - 1)"
            :disabled="athleteStore.paginationAthletes.currentPage <= 1"
            class="btn btn-sm btn-outline btn-warning">
            Precedente
          </button>
          <span class="text-sm">
            Pagina {{ athleteStore.paginationAthletes.currentPage }} di {{ athleteStore.paginationAthletes.totalPages }}
          </span>
          <button
            @click="changePage(athleteStore.paginationAthletes.currentPage + 1)"
            :disabled="athleteStore.paginationAthletes.currentPage >= athleteStore.paginationAthletes.totalPages"
            class="btn btn-sm btn-outline btn-warning">
            Successivo
          </button>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info">
      <p>Effettua il login come coach per visualizzare i tuoi atleti.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useCoachAthleteManagementStore } from '@/store/coachAthleteManagement';
import { useAuthStore } from '@/store/auth'; // Assuming auth store path

const athleteStore = useCoachAthleteManagementStore();
const authStore = useAuthStore();

const coachId = computed(() => authStore.user?.pk); // Use .pk as per Django convention for primary key

onMounted(() => {
  if (coachId.value) {
    athleteStore.fetchCoachAthletes(coachId.value, { page: 1, perPage: 10 });
  }
});

const changePage = (page) => {
  if (page > 0 && page <= athleteStore.paginationAthletes.totalPages && coachId.value) {
    athleteStore.fetchCoachAthletes(coachId.value, { page: page, perPage: athleteStore.paginationAthletes.perPage });
  }
};
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
