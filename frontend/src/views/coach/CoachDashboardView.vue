<template>
  <div class="p-4 md:p-8 min-h-screen bg-base-200 text-base-content">
    <h1 class="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left text-primary">
      Coach Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card: Miei Atleti -->
      <div class="card bg-neutral text-neutral-content shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title text-2xl text-warning">Miei Atleti</h2>
          <p>Visualizza e gestisci gli atleti a te associati.</p>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-warning btn-sm">Vai a Atleti</button>
          </div>
        </div>
      </div>

      <!-- Card: Piani Creati -->
      <div class="card bg-neutral text-neutral-content shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title text-2xl text-warning">Piani Creati</h2>
          <p>Crea, modifica ed assegna piani di allenamento.</p>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-warning btn-sm">Vai a Piani</button>
          </div>
        </div>
      </div>

      <!-- Card: Workout Recenti Atleti -->
      <div class="card bg-neutral text-neutral-content shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title text-2xl text-warning">Workout Recenti Atleti</h2>
          <p>Monitora gli ultimi workout completati dai tuoi atleti.</p>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-warning btn-sm">Vai a Workout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No specific script logic needed for this initial static view.
// Imports for future use, like stores or components, would go here.
</script>

<style scoped>
/* Scoped styles for the component if needed */
.card-title {
  /* Ensures the warning color is applied if not overridden by DaisyUI specifics */
  color: hsl(var(--wa));
}
</style>
