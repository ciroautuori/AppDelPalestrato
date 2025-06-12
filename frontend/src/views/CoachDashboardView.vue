<script setup>
import { useAuthStore } from '@/store/auth';
import { ref } from 'vue';

const authStore = useAuthStore();

// Mock data - replace with actual data from your store
const athletes = ref([
  {
    id: 1,
    name: 'Mario Rossi',
    email: 'mario.rossi@example.com',
    program: 'Forza e Potenza',
    lastSession: '2 ore fa',
    progress: 75
  },
  {
    id: 2,
    name: 'Laura Bianchi',
    email: 'laura.bianchi@example.com',
    program: 'Resistenza',
    lastSession: '1 giorno fa',
    progress: 60
  },
  {
    id: 3,
    name: 'Giovanni Verdi',
    email: 'giovanni.verdi@example.com',
    program: 'Massa Muscolare',
    lastSession: '3 ore fa',
    progress: 90
  }
]);
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-warning">Coach Dashboard</h1>
      <div class="text-base-content">
        Welcome, {{ authStore.user?.email }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Placeholder Cards -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Athletes</h2>
          <p>Manage your athletes and their training programs</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">View Athletes</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Piani di Allenamento</h2>
          <p>Create and manage training programs</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">Gestisci Piani di Allenamento</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Progress Reports</h2>
          <p>Track and analyze athlete progress</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">View Reports</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Atleti Totali</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">12</p>
        <p class="text-sm text-gray-400 mt-2">Atleti assegnati</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Programmi Attivi</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">8</p>
        <p class="text-sm text-gray-400 mt-2">Programmi in corso</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Sessione Oggi</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">5</p>
        <p class="text-sm text-gray-400 mt-2">Sessioni programmate</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Performance</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">+15%</p>
        <p class="text-sm text-gray-400 mt-2">Media miglioramento</p>
      </div>
    </div>

    <!-- Athletes List -->
    <div class="bg-gray-800 rounded-lg border border-gray-700">
      <div class="p-6 border-b border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-white">I Tuoi Atleti</h2>
          <button
            class="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Aggiungi Atleta
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-700/50">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Atleta</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Programma</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ultima Sessione</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Progresso</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="athlete in athletes" :key="athlete.id" class="hover:bg-gray-700/30">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                      <span class="text-lg font-medium text-white">{{ athlete.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-white">{{ athlete.name }}</div>
                    <div class="text-sm text-gray-400">{{ athlete.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{{ athlete.program }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{{ athlete.lastSession }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-full bg-gray-700 rounded-full h-2.5">
                  <div class="bg-yellow-500 h-2.5 rounded-full" :style="{ width: athlete.progress + '%' }"></div>
                </div>
                <span class="text-sm text-gray-400 mt-1 block">{{ athlete.progress }}%</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-yellow-500 hover:text-yellow-600 mr-3">Modifica</button>
                <button class="text-red-500 hover:text-red-600">Rimuovi</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template> 