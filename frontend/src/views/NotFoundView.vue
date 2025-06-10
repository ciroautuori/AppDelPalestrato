<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center px-4">
     <div class="card bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <h1 class="text-4xl font-bold">404 - Pagina Non Trovata</h1>
        <p class="py-6 text-lg">Oops! La pagina che stai cercando non sembra esistere.</p>
        <div class="card-actions">
          <router-link to="/" class="btn btn-primary">Torna alla Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Nessuna logica specifica richiesta per ora
</script>
