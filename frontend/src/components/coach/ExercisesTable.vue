<template>
  <!-- Desktop Table View -->
  <div class="hidden md:block overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr class="text-gray-400">
          <th>Nome</th>
          <th>Gruppo Muscolare</th>
          <th>Descrizione</th>
          <th class="text-right">Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="exercise in exercises" :key="exercise.id" class="hover:bg-gray-700">
          <td>{{ exercise.name }}</td>
          <td>{{ exercise.muscle_group }}</td>
          <td class="max-w-xs truncate">{{ exercise.description }}</td>
          <td class="text-right">
            <div class="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                @click="$emit('edit-exercise', exercise)"
                class="btn btn-xs btn-warning w-full sm:w-auto gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>Modifica</span>
              </button>
              <button
                @click="$emit('delete-exercise', exercise)"
                class="btn btn-xs btn-error w-full sm:w-auto gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <span>Elimina</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Mobile Card View -->
  <div class="md:hidden space-y-4">
    <div v-for="exercise in exercises" :key="exercise.id" class="card bg-base-200">
      <div class="card-body p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="card-title text-lg">{{ exercise.name }}</h3>
            <div class="badge badge-warning mt-2">{{ exercise.muscle_group }}</div>
          </div>
        </div>
        <p class="text-sm mt-2 line-clamp-2">{{ exercise.description }}</p>
        <div class="flex flex-col gap-2 mt-4">
          <button
            @click="$emit('edit-exercise', exercise)"
            class="btn btn-xs btn-warning w-full gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>Modifica</span>
          </button>
          <button
            @click="$emit('delete-exercise', exercise)"
            class="btn btn-xs btn-error w-full gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>Elimina</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  exercises: {
    type: Array,
    required: true
  }
});

defineEmits(['edit-exercise', 'delete-exercise']);
</script>

<style scoped>
.card {
  @apply bg-gray-800 border border-gray-700;
}

.card-title {
  @apply text-white;
}

.badge {
  @apply text-xs font-medium;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Stili per i pulsanti */
.btn-xs {
  @apply text-xs px-3 py-2 min-h-0 h-8;
}

.btn {
  @apply transition-all duration-200 ease-in-out inline-flex items-center justify-center;
}

.btn:hover {
  @apply transform scale-105;
}

.btn:active {
  @apply transform scale-95;
}

/* Stili per le icone */
.btn svg {
  @apply flex-shrink-0;
}

.btn span {
  @apply whitespace-nowrap;
}
</style> 