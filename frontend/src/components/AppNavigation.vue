<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li v-if="isCoach"><router-link to="/coach/dashboard">Dashboard</router-link></li>
          <li v-if="isCoach"><router-link to="/coach/my-athletes">I Miei Atleti</router-link></li>
          <li v-if="isCoach"><router-link to="/coach/my-plans">I Miei Piani</router-link></li>
          <li v-if="isCoach"><router-link to="/coach/exercises">Esercizi</router-link></li>
          <li v-if="isAdmin"><router-link to="/admin/dashboard">Dashboard</router-link></li>
          <li v-if="isAdmin"><router-link to="/admin/users">Gestione Utenti</router-link></li>
          <li v-if="isAthlete"><router-link to="/athlete/dashboard">Dashboard</router-link></li>
        </ul>
      </div>
      <router-link to="/" class="btn btn-ghost normal-case text-xl">Palestrato</router-link>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-if="isCoach"><router-link to="/coach/dashboard">Dashboard</router-link></li>
        <li v-if="isCoach"><router-link to="/coach/my-athletes">I Miei Atleti</router-link></li>
        <li v-if="isCoach"><router-link to="/coach/my-plans">I Miei Piani</router-link></li>
        <li v-if="isCoach"><router-link to="/coach/exercises">Esercizi</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin/dashboard">Dashboard</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin/users">Gestione Utenti</router-link></li>
        <li v-if="isAthlete"><router-link to="/athlete/dashboard">Dashboard</router-link></li>
      </ul>
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost" @click="logout">
        <i class="fas fa-sign-out-alt mr-2"></i>
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const isAdmin = computed(() => authStore.userRole === 'admin');
const isCoach = computed(() => authStore.userRole === 'coach');
const isAthlete = computed(() => authStore.userRole === 'athlete');

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script> 