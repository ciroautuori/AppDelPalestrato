<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-yellow-500">
          Accedi al tuo account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="label sr-only">
              <span class="label-text">Email</span>
            </label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="input input-bordered input-warning w-full"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="label sr-only">
              <span class="label-text">Password</span>
            </label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="input input-bordered input-warning w-full"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" role="alert" class="alert alert-error shadow-lg mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="btn btn-warning w-full"
          >
            <span v-if="isLoading" class="loading loading-spinner"></span>
            {{ isLoading ? 'Accesso in corso...' : 'Accedi' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  try {
    error.value = '';
    isLoading.value = true;
    await authStore.login({ email: email.value, password: password.value });
    
    // Redirect based on user role
    const role = authStore.userRole;
    switch (role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'coach':
        router.push('/coach/dashboard');
        break;
      case 'athlete':
        router.push('/athlete/dashboard');
        break;
      default:
        router.push('/access-denied');
    }
  } catch (error) {
    console.error('Login error:', error);
    error.value = error.response?.data?.detail || 'Errore durante l\'accesso. Riprova.';
  } finally {
    isLoading.value = false;
  }
};
</script>