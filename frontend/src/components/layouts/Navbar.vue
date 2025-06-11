<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const userRole = computed(() => authStore.userRole);
const userEmail = computed(() => authStore.user?.email);

const dashboardPath = computed(() => {
  switch (userRole.value) {
    case 'admin':
      return '/admin/dashboard';
    case 'coach':
      return '/coach/dashboard';
    case 'athlete':
      return '/athlete/dashboard';
    default:
      return '/login';
  }
});

const handleLogout = async () => {
  await authStore.logout();
};
</script>

<template>
  <div class="navbar bg-base-100 shadow-lg">
    <div class="flex-1">
      <router-link :to="dashboardPath" class="btn btn-ghost text-xl text-warning">
        Palestrato
      </router-link>
    </div>
    <div class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full bg-warning text-base-100 flex items-center justify-center">
            {{ userEmail?.[0]?.toUpperCase() || 'U' }}
          </div>
        </div>
        <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <div class="text-sm opacity-70">
              {{ userEmail }}
            </div>
          </li>
          <li>
            <div class="text-xs opacity-50">
              {{ userRole }}
            </div>
          </li>
          <div class="divider my-1"></div>
          <li>
            <a @click="handleLogout" class="text-error">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template> 