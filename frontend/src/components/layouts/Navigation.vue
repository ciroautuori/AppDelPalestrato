<template>
  <div>
    <!-- Sidebar (visible on md and up) -->
    <aside
      class="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-gray-900 border-r border-gray-800"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 border-b border-gray-800">
        <h1 class="text-xl font-bold text-white">AppDelPalestrato</h1>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-2 py-4 space-y-1">
        <div v-if="navigationItems.length === 0 && authStore.isUserAuthenticated" class="px-2 py-2 text-sm text-gray-400">
          Nessun menu disponibile per il tuo ruolo.
        </div>
        <div v-else-if="!authStore.isUserAuthenticated" class="px-2 py-2 text-sm text-gray-400">
          Effettua il login per vedere il menu.
        </div>
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            $route.path === item.to
              ? 'bg-neutral text-yellow-500' // Changed bg-gray-800 to bg-neutral for active state
              : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-500'
          ]"
        >
          <span
            class="mr-3 h-6 w-6"
            :class="[
              $route.path === item.to
                ? 'text-yellow-500'
                : 'text-gray-400 group-hover:text-yellow-500'
            ]"
            v-html="item.icon"
          />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-gray-800" v-if="authStore.isUserAuthenticated">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span class="text-sm font-medium text-white">{{ userInitials }}</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">{{ userEmail }}</p>
            <p class="text-xs text-gray-400 capitalize">{{ authStore.user?.role }}</p> <!-- Display user role -->
            <button
              @click="handleLogout"
              class="text-xs text-gray-400 hover:text-yellow-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Dock (visible on mobile) -->
    <nav
      v-if="authStore.isUserAuthenticated && navigationItems.length > 0"
      class="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800"
    >
      <div class="flex justify-around items-center h-16">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center justify-center flex-1 h-full"
          :class="[
            $route.path === item.to
              ? 'text-yellow-500'
              : 'text-gray-400 hover:text-yellow-500'
          ]"
        >
          <span
            class="h-6 w-6"
            v-html="item.icon"
          />
          <span class="text-xs mt-1">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const userEmail = computed(() => authStore.user?.email || '');
const userInitials = computed(() => {
  const email = userEmail.value;
  return email ? email.charAt(0).toUpperCase() : '';
});

// Define navigation links for each role
const adminLinks = [
  {
    name: 'Dashboard Admin',
    to: '/admin/dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
  },
  {
    name: 'Gestione Utenti',
    to: '/admin/users',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
  },
  // Add other admin links here if they were in the original static list
  // { name: 'Piani (Admin)', to: '/admin/plans', icon: '...' },
  // { name: 'Analytics (Admin)', to: '/admin/analytics', icon: '...' },
  // { name: 'Impostazioni (Admin)', to: '/admin/settings', icon: '...' },
];

const coachLinks = [
  {
    name: 'Dashboard Coach',
    to: '/coach/dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
  },
  {
    name: 'Miei Atleti',
    to: '/coach/my-athletes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.28-.24-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.28.24-1.857m12.76-1.857v-2a6 6 0 00-9.52-4.292M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
  },
  {
    name: 'Miei Piani',
    to: '/coach/my-plans',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>`
  },
  {
    name: 'Piani Nutrizionali',
    to: '/coach/nutrition-plans',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`
  },
  {
    name: 'Esercizi',
    to: '/coach/exercises',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>`
  },
];

const athleteLinks = [
  {
    name: 'Dashboard Atleta',
    to: '/athlete/dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  },
];

// Computed property to determine which navigation items to display
const navigationItems = computed(() => {
  const role = authStore.user?.role;
  if (role === 'admin') {
    // For admin, return the original static list or a defined adminLinks array
    // For now, let's keep the original items if the role is admin, assuming they were admin links
    return [
      {
        name: 'Dashboard',
        to: '/admin/dashboard',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>`
      },
      {
        name: 'Utenti',
        to: '/admin/users',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>`
      },
      // ... include other original items like Piani, Analytics, Impostazioni if they were admin-specific
       {
        name: 'Piani (Admin)', // Clarified name
        to: '/admin/plans', // Assuming this was an admin route
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>`
      },
    ];
  } else if (role === 'coach') {
    return coachLinks;
  } else if (role === 'athlete') {
    return athleteLinks;
  }
  return []; // Default for users with no role or if not logged in
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script> 