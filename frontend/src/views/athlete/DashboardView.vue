<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Bentornato, Atleta!</h1>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Colonna Sinistra (Feed Attività Futuro) -->
      <div class="lg:w-2/3">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Feed Attività</h2>
            <p>Qui verranno visualizzate le tue ultime attività, gli aggiornamenti della community e molto altro. Resta sintonizzato!</p>
            <!-- Esempio di contenuto futuro:
            <div class="space-y-4 mt-4">
              <div class="p-4 bg-base-200 rounded-lg">Log Allenamento: Sessione Gambe completata!</div>
              <div class="p-4 bg-base-200 rounded-lg">Nuovo Record: Squat 1RM - 160kg!</div>
              <div class="p-4 bg-base-200 rounded-lg">Coach ha assegnato: Piano Pettorali Avanzato.</div>
            </div>
            -->
          </div>
        </div>
      </div>

      <!-- Colonna Destra (Widget Riepilogo) -->
      <div class="lg:w-1/3 space-y-6">
        <!-- Widget Ultimi PR -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Ultimi Record Personali</h2>
            <div v-if="athleteStore.isLoading">Caricamento PR...</div>
            <div v-else-if="athleteStore.error" class="text-error">{{ athleteStore.error }}</div> <!-- Changed athleteStore.errorPR to athleteStore.error -->
            <div v-else-if="latestPRs.length > 0">
              <ul class="list-none space-y-2">
                <li v-for="pr in latestPRs" :key="pr.id" class="text-sm">
                  <span class="font-semibold">{{ pr.exercise_name }}</span> ({{ pr.type }}): {{ pr.value }} {{ pr.unit || 'kg' }}
                  <span class="text-xs text-gray-500">- {{ formatDate(pr.date) }}</span>
                </li>
              </ul>
            </div>
            <div v-else>
              <p>Nessun record personale recente.</p>
            </div>
            <div class="card-actions justify-end mt-2">
              <router-link to="/athlete/profile?tab=records" class="btn btn-xs btn-outline btn-primary">Vedi tutti</router-link>
            </div>
          </div>
        </div>

        <!-- Widget Prossimo Allenamento (Placeholder) -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Prossimo Allenamento</h2>
            <p>Funzionalità in arrivo: qui vedrai il tuo prossimo allenamento programmato.</p>
            <!-- Esempio:
            <div class="mt-2">
              <h3 class="font-semibold">Push Day - Forza</h3>
              <p class="text-sm">Domani alle 17:00</p>
              <button class="btn btn-xs btn-secondary mt-2">Vedi Dettagli</button>
            </div>
            -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'; // ref is not used, can be removed
import { useAthleteStore } from '@/stores/athlete';
import { useRouter } from 'vue-router';

const athleteStore = useAthleteStore();
const router = useRouter();

onMounted(() => {
  if (!athleteStore.personalRecords || athleteStore.personalRecords.length === 0) {
    // Assuming fetchPersonalRecords handles its own isLoading and error states internally
    // or updates athleteStore.isLoading and athleteStore.error globally.
    athleteStore.fetchPersonalRecords();
  }
});

const latestPRs = computed(() => {
  if (!athleteStore.personalRecords || athleteStore.personalRecords.length === 0) {
    return [];
  }
  return [...athleteStore.personalRecords]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

</script>

<style scoped>
/* Eventuali stili specifici per la dashboard */
.card-title {
  /* Potresti voler rendere i titoli delle card più prominenti */
}
</style>
