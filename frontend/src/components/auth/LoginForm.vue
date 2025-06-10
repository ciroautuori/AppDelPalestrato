<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value,
    });

    if (success) {
      // Il redirect è gestito dalle navigation guards di Vue Router (to.query.redirect o '/')
      // Non è strettamente necessario un router.push() qui se le guardie sono complete.
      // Se si volesse forzare un redirect specifico dopo il login qui:
      // const redirectPath = router.currentRoute.value.query.redirect || '/';
      // router.push(redirectPath);
      // Ma per ora ci affidiamo alle guardie del router e alla logica di redirect per '/'
    } else {
      // L'errore potrebbe essere già loggato dallo store, ma mostriamo un messaggio generico.
      errorMessage.value = authStore.user === null ? 'Credenziali non valide o utente non trovato. Riprova.' : 'Login fallito. Controlla le credenziali.';
      // Svuota la password per sicurezza
      password.value = '';
    }
  } catch (error) {
    // Catch per errori non gestiti specificamente dall'azione login dello store
    console.error('Login component error:', error);
    errorMessage.value = 'Si è verificato un errore durante il login. Riprova più tardi.';
    password.value = '';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="form-control">
          <label for="email" class="label">
            <span class="label-text">Indirizzo Email</span>
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input input-bordered w-full"
            placeholder="tu@esempio.com"
          />
        </div>

        <div class="form-control">
          <label for="password" class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input input-bordered w-full"
            placeholder="Password"
          />
        </div>

        <div v-if="errorMessage" class="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading loading-spinner"></span>
            <span v-else>Login</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
