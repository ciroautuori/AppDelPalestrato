<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authStore.login({ email: email.value, password: password.value });
    const role = authStore.userRole;
    router.push(`/${role}/dashboard`);
  } catch (err) {
    error.value = err.response?.data?.detail || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold text-warning">Login now!</h1>
        <p class="py-6 text-base-content">Access your personalized dashboard based on your role.</p>
      </div>
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form @submit.prevent="handleSubmit" class="card-body">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="email"
              v-model="email"
              placeholder="email"
              class="input input-bordered input-warning"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              v-model="password"
              placeholder="password"
              class="input input-bordered input-warning"
              required
            />
            <label class="label">
              <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
            </label>
          </div>
          <div v-if="error" class="alert alert-error mt-4">
            <span>{{ error }}</span>
          </div>
          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-warning"
              :class="{ 'loading': loading }"
              :disabled="loading"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 