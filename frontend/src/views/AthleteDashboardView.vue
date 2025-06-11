<script setup>
import { useAuthStore } from '@/store/auth';
import { ref } from 'vue';

const authStore = useAuthStore();

// Mock data - replace with actual data from your store
const workouts = ref([
  {
    id: 1,
    name: 'Allenamento Forza',
    time: 'Oggi, 15:00'
  },
  {
    id: 2,
    name: 'Cardio',
    time: 'Domani, 10:00'
  },
  {
    id: 3,
    name: 'Mobilità',
    time: 'Domani, 17:00'
  }
]);

const progressData = ref([65, 70, 75, 80, 85, 90, 85, 80, 85, 90, 95, 100]);
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Dashboard Atleta</h1>
      <p class="text-gray-400">Monitora i tuoi progressi e i tuoi allenamenti</p>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Allenamenti Completati</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">24</p>
        <p class="text-sm text-gray-400 mt-2">Questo mese</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Prossimo Allenamento</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">2h</p>
        <p class="text-sm text-gray-400 mt-2">Tra 2 ore</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Calorie Bruciate</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">12.5k</p>
        <p class="text-sm text-gray-400 mt-2">Questo mese</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Progresso</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">+15%</p>
        <p class="text-sm text-gray-400 mt-2">Rispetto al mese scorso</p>
      </div>
    </div>

    <!-- Workout Schedule -->
    <div class="bg-gray-800 rounded-lg border border-gray-700 mb-8">
      <div class="p-6 border-b border-gray-700">
        <h2 class="text-xl font-semibold text-white">Programma Allenamenti</h2>
      </div>

      <div class="p-6">
        <div class="space-y-4">
          <div v-for="workout in workouts" :key="workout.id" class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="p-2 bg-yellow-500/10 rounded-lg">
                <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-white">{{ workout.name }}</h3>
                <p class="text-sm text-gray-400">{{ workout.time }}</p>
              </div>
            </div>
            <button class="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800">
              Inizia
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Chart -->
    <div class="bg-gray-800 rounded-lg border border-gray-700">
      <div class="p-6 border-b border-gray-700">
        <h2 class="text-xl font-semibold text-white">Progresso Mensile</h2>
      </div>

      <div class="p-6">
        <div class="h-64 flex items-end space-x-2">
          <div v-for="(value, index) in progressData" :key="index" class="flex-1">
            <div class="relative">
              <div class="absolute bottom-0 w-full bg-gray-700 rounded-t-lg" :style="{ height: value + '%' }">
                <div class="absolute inset-0 bg-yellow-500/50 rounded-t-lg"></div>
              </div>
              <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                {{ index + 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 