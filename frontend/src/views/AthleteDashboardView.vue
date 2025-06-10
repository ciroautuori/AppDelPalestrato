<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();
const currentUser = computed(() => authStore.currentUser);
const userRole = computed(() => authStore.userRole);
</script>

<template>
  <div class="p-6">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl">Athlete Dashboard</h1>
        <div v-if="currentUser">
          <p>Benvenuto, Atleta!</p>
          <p class="mt-4"><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Ruolo:</strong> {{ userRole }}</p>
           <p class="mt-2">ID Utente: {{ currentUser.id }}</p>
        </div>
        <div v-else>
          <p>Caricamento dati utente...</p>
        </div>
      </div>
    </div>
  </div>
</template>
