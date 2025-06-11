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
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            $route.path === item.to
              ? 'bg-gray-800 text-yellow-500'
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
      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span class="text-sm font-medium text-white">{{ userInitials }}</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">{{ userEmail }}</p>
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

const navigationItems = [
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
  {
    name: 'Piani',
    to: '/admin/plans',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>`
  },
  {
    name: 'Analytics',
    to: '/admin/analytics',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>`
  },
  {
    name: 'Impostazioni',
    to: '/admin/settings',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>`
  }
];

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script> 