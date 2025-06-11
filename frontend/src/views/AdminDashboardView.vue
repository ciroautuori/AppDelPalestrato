<script setup>
import { useAuthStore } from '@/store/auth';
// useUserManagementStore removed
import { useToastStore } from '@/store/toast'; // Kept for potential dashboard level toasts
import Toast from '@/components/Toast.vue'; // Kept for potential dashboard level toasts
// onMounted and computed related to userManagementStore removed

const authStore = useAuthStore();
const toastStore = useToastStore(); // May be used by other dashboard elements later

// Any other dashboard specific logic can remain or be added here in the future
</script>

<template>
  <div class="p-4">
    <Toast />

    <h1 class="text-3xl font-bold text-yellow-500 mb-8">Admin Dashboard</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <!-- Card Utenti Totali Placeholder -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <h2 class="card-title text-sm font-medium text-base-content/70">Utenti Totali</h2>
            <div class="p-2 bg-yellow-500/10 rounded-lg">
              <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372m-10.001c4.993 0 8.337-2.493 8.337-5.833c0-1.523-.606-2.898-1.732-3.963M12 3c1.355 0 2.597.401 3.688 1.075M12 3a8.963 8.963 0 00-4.28 1.075M12 3c.811 0 1.58.163 2.3.465M12 3c-.811 0-1.58-.163-2.3-.465M3 12c0 .618.029 1.226.085 1.833m0 0c.256 1.113.688 2.16 1.26 3.13M3 12c0-.618-.029-1.226-.085-1.833m0 0c.256-1.113.688-2.16 1.26-3.13m0 0c1.146-1.657 2.83-2.963 4.72-3.746M21 12c0 .618-.029 1.226-.085 1.833m0 0c-.256 1.113-.688 2.16-1.26 3.13M21 12c0-.618.029-1.226.085-1.833m0 0c-.256-1.113-.688-2.16-1.26-3.13m0 0c-1.146-1.657-2.83-2.963-4.72-3.746" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-base-content">--</p>
          <p class="text-xs text-base-content/50 mt-1">Conteggio utenti totali</p>
        </div>
      </div>

      <!-- Card Coach Attivi Placeholder -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <h2 class="card-title text-sm font-medium text-base-content/70">Coach Attivi</h2>
            <div class="p-2 bg-blue-500/10 rounded-lg">
              <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-1.5a3 3 0 00-3.741 1.5M15 11.943V17.25h1.5M14.25 12h4.5M13.5 17.25V10.5A2.25 2.25 0 0115.75 8.25h0A2.25 2.25 0 0118 10.5v.75M6 18.75a9.094 9.094 0 013.741-.479 3 3 0 01-3.741-1.5a3 3 0 01-3.741 1.5M12 11.943V17.25h1.5M11.25 12h4.5M10.5 17.25V10.5A2.25 2.25 0 0112.75 8.25h0A2.25 2.25 0 0115 10.5v.75M6 10.5A2.25 2.25 0 018.25 8.25h0A2.25 2.25 0 0110.5 10.5v.75m-4.5 0v6.75A2.25 2.25 0 008.25 20h0A2.25 2.25 0 0010.5 17.25v-6.75" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-base-content">--</p>
          <p class="text-xs text-base-content/50 mt-1">Numero di coach attivi</p>
        </div>
      </div>

      <!-- Card Atleti Attivi Placeholder -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <h2 class="card-title text-sm font-medium text-base-content/70">Atleti Attivi</h2>
            <div class="p-2 bg-green-500/10 rounded-lg">
                <svg class="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-base-content">--</p>
          <p class="text-xs text-base-content/50 mt-1">Numero di atleti attivi</p>
        </div>
      </div>

      <!-- Card Piani Allenamento Placeholder -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <h2 class="card-title text-sm font-medium text-base-content/70">Piani Allenamento</h2>
            <div class="p-2 bg-purple-500/10 rounded-lg">
              <svg class="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0cA3.375 3.375 0 015.75 7.5c0 1.052.468 2.014 1.242 2.674l1.988 1.521c.67.51 1.583.645 2.437.434V19.5a2.25 2.25 0 002.25 2.25H15M11.25 4.5a48.471 48.471 0 00-3.262-.238c-.999.032-1.91.422-2.563.992C4.604 6.008 4.5 7.118 4.5 8.25c0 .563.097 1.111.284 1.626l.28.732c.418 1.096 1.508 1.627 2.602 1.231l1.09-.401M11.25 4.5a8.954 8.954 0 013.262-.238M5.25 7.5c0 .428.058.846.169 1.245" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-base-content">--</p>
          <p class="text-xs text-base-content/50 mt-1">Numero di piani creati</p>
        </div>
      </div>
    </div>

    <!-- Placeholder for other dashboard content -->
    <div class="text-base-content/70">
      <p>Ulteriori statistiche e moduli verranno aggiunti qui.</p>
    </div>

  </div>
</template>

<style scoped>
/* Specific styles for AdminDashboardView if needed */
.card-title {
    white-space: nowrap; /* Ensure titles don't wrap aggressively */
}
</style>