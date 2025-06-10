<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isUserAuthenticated);
const currentUser = computed(() => authStore.currentUser); // Rinominato da 'user' per chiarezza
const userRole = computed(() => authStore.userRole);

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'login' }); // Reindirizza a login dopo il logout
};

const handleTitleClick = () => {
  if (isAuthenticated.value) {
    switch (userRole.value) {
      case 'admin':
        router.push({ name: 'admin-dashboard' });
        break;
      case 'coach':
        router.push({ name: 'coach-dashboard' });
        break;
      case 'athlete':
        router.push({ name: 'athlete-dashboard' });
        break;
      default:
        // Fallback se il ruolo non è gestito o l'utente non ha una dashboard specifica
        router.push('/'); // La guardia per '/' dovrebbe reindirizzare correttamente
    }
  } else {
    router.push({ name: 'login' });
  }
};
</script>

<template>
  <div class="navbar bg-base-100 shadow-lg sticky top-0 z-50">
    <div class="navbar-start">
      <button @click="handleTitleClick" class="btn btn-ghost normal-case text-xl">
        AppDelPalestrato
      </button>
    </div>

    <div class="navbar-center hidden lg:flex">
      <!-- Eventuali link centrali futuri -->
    </div>

    <div class="navbar-end">
      <template v-if="isAuthenticated">
        <div class="flex items-center mr-3">
          <span class="text-sm hidden sm:inline mr-2">{{ currentUser?.email }}</span>
          <span class="badge badge-neutral badge-sm sm:badge-md">{{ userRole }}</span>
        </div>
        <button @click="handleLogout" class="btn btn-ghost">
          Logout
        </button>
      </template>
      <template v-else>
        <router-link :to="{ name: 'login' }" class="btn btn-ghost">
          Login
        </router-link>
      </template>

      <!-- Esempio di dropdown per menu hamburger su mobile se necessario in futuro -->
      <!--
      <div class="dropdown dropdown-end lg:hidden">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li v-if="isAuthenticated">
            <span class="text-xs">{{ currentUser?.email }} ({{ userRole }})</span>
          </li>
          <li v-if="isAuthenticated"><a @click="handleLogout">Logout</a></li>
          <li v-else><router-link :to="{ name: 'login' }">Login</router-link></li>
        </ul>
      </div>
      -->
    </div>
  </div>
</template>

<style scoped>
/* Eventuali stili specifici per la Navbar, se necessari */
.navbar {
  /* Assicura che la navbar sia sempre visibile durante lo scroll se sticky è usato */
}
</style>
