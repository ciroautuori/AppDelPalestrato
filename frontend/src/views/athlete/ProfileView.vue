<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Il Mio Profilo</h1>

    <div role="tablist" class="tabs tabs-lifted">
      <input type="radio" name="profile_tabs" role="tab" class="tab" aria-label="Panoramica" checked />
      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <!-- Contenuto Panoramica qui -->
        <p>Benvenuto nella tua panoramica del profilo! (Contenuto futuro)</p>
      </div>

      <input type="radio" name="profile_tabs" role="tab" class="tab" aria-label="Piani di Allenamento" />
      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <div v-if="athleteStore.isLoading">Caricamento piani di allenamento...</div>
        <div v-else-if="athleteStore.error" class="text-red-500">
          Errore nel caricamento dei piani: {{ athleteStore.error }}
        </div>
        <div v-else-if="athleteStore.assignedWorkoutPlans && athleteStore.assignedWorkoutPlans.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="plan in athleteStore.assignedWorkoutPlans" :key="plan.id" class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">{{ plan.name }}</h2>
              <p>{{ plan.description || 'Nessuna descrizione disponibile.' }}</p>
              <!-- Aggiungi altri dettagli del piano se necessario -->
            </div>
          </div>
        </div>
        <div v-else>
          Nessun piano di allenamento assegnato al momento.
        </div>
      </div>

      <input type="radio" name="profile_tabs" role="tab" class="tab" aria-label="Piani Nutrizionali" />
      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <div v-if="athleteStore.isLoading">Caricamento piani nutrizionali...</div>
        <div v-else-if="athleteStore.error" class="text-red-500">
          Errore nel caricamento dei piani: {{ athleteStore.error }}
        </div>
        <div v-else-if="athleteStore.assignedNutritionPlans && athleteStore.assignedNutritionPlans.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="plan in athleteStore.assignedNutritionPlans" :key="plan.id" class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">{{ plan.name }}</h2>
              <p>{{ plan.description || 'Nessuna descrizione disponibile.' }}</p>
              <!-- Aggiungi altri dettagli del piano se necessario -->
            </div>
          </div>
        </div>
        <div v-else>
          Nessun piano nutrizionale assegnato al momento.
        </div>
      </div>

      <input type="radio" name="profile_tabs" role="tab" class="tab" aria-label="Record Personali" />
      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <div v-if="athleteStore.isLoading">Caricamento record personali...</div>
        <div v-else-if="athleteStore.error" class="text-red-500">
          Errore nel caricamento dei record: {{ athleteStore.error }}
        </div>
        <div v-else-if="groupedPersonalRecords && Object.keys(groupedPersonalRecords).length > 0">
          <div v-for="(records, exerciseName) in groupedPersonalRecords" :key="exerciseName" class="mb-6">
            <h3 class="text-xl font-semibold mb-2">{{ exerciseName }}</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(pr, index) in records" :key="index">
                Record {{ pr.type }}: {{ pr.value }} {{ pr.unit }} ({{ pr.date }})
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          Nessun record personale registrato al momento.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAthleteStore } from '@/stores/athlete';
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const athleteStore = useAthleteStore();
const route = useRoute();
// const activeTabFromQuery = ref(''); // Not strictly needed if directly manipulating .checked

const tabNameToInputAriaLabel = {
  'overview': 'Panoramica',
  'workout': 'Piani di Allenamento',
  'nutrition': 'Piani Nutrizionali',
  'records': 'Record Personali'
};

const setActiveTabFromQuery = (tabQueryValue) => {
  const targetAriaLabel = tabNameToInputAriaLabel[tabQueryValue];
  if (targetAriaLabel) {
    const radioInput = document.querySelector(`.tabs input[type="radio"][aria-label='${targetAriaLabel}']`);
    if (radioInput) {
      radioInput.checked = true;
    }
  } else {
    // Default to the first tab if query is invalid or not present
    const firstTabRadio = document.querySelector('.tabs input[type="radio"][role="tab"]');
    if (firstTabRadio) {
      firstTabRadio.checked = true;
    }
  }
};

onMounted(async () => {
  // Fetch data first
  await athleteStore.fetchAssignedWorkoutPlans();
  await athleteStore.fetchAssignedNutritionPlans();
  await athleteStore.fetchPersonalRecords();

  // Then set active tab based on query
  setActiveTabFromQuery(route.query.tab);
});

watch(() => route.query.tab, (newTabQuery) => {
  setActiveTabFromQuery(newTabQuery);
});

const groupedPersonalRecords = computed(() => {
  if (!athleteStore.personalRecords || athleteStore.personalRecords.length === 0) {
    return {};
  }
  return athleteStore.personalRecords.reduce((acc, pr) => {
    const exerciseName = pr.exercise_name; // o il campo corretto per il nome dell'esercizio
    if (!acc[exerciseName]) {
      acc[exerciseName] = [];
    }
    acc[exerciseName].push({
      type: pr.type, // es. '1RM', '5RM'
      value: pr.value, // es. 120
      unit: pr.unit || 'kg', // Aggiungi unità se disponibile, default 'kg'
      date: new Date(pr.date).toLocaleDateString('it-IT') // Formatta la data
    });
    // Potresti voler ordinare i record per tipo (1RM, 3RM, 5RM etc.) o per data qui se necessario
    return acc;
  }, {});
});
</script>

<style scoped>
/* Eventuali stili specifici del componente */
.tabs-lifted .tab {
  /* Stile per sollevare un po' i tab */
}
</style>
