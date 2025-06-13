<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">I Miei Record Personali</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-error text-error-content p-4 rounded-lg mb-4">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!personalRecords.length" class="text-center py-12">
      <p class="text-lg text-gray-600">Non hai ancora registrato nessun record personale.</p>
      <p class="text-sm text-gray-500 mt-2">I tuoi record personali appariranno qui dopo aver completato gli allenamenti.</p>
    </div>

    <!-- Records Table -->
    <div v-else class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Esercizio</th>
            <th>Peso (kg)</th>
            <th>Ripetizioni</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in personalRecords" :key="record.id" class="hover:bg-base-200">
            <td>{{ record.exercise.name }}</td>
            <td>{{ record.weight }}</td>
            <td>{{ record.reps }}</td>
            <td>{{ formatDate(record.date_achieved) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { usePRStore } from '@/store/pr';

const prStore = usePRStore();

const personalRecords = computed(() => prStore.getPersonalRecords);
const isLoading = computed(() => prStore.getLoading);
const error = computed(() => prStore.getError);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  try {
    await prStore.fetchPersonalRecords();
  } catch (error) {
    console.error('Error fetching personal records:', error);
  }
});
</script> 