<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 p-4 bg-neutral text-neutral-content rounded-lg shadow-xl">
    <!-- Plan Details Section -->
    <div class="space-y-4 border-b border-base-300 pb-6">
      <h2 class="text-xl font-semibold text-warning">Dettagli del Piano</h2>
      <div>
        <label for="planName" class="label">
          <span class="label-text text-base-content">Nome Piano</span>
        </label>
        <input
          id="planName"
          v-model="planDetails.name"
          type="text"
          required
          placeholder="Es: Piano Forza Base"
          class="input input-bordered input-warning w-full" />
      </div>
      <div>
        <label for="planDescription" class="label">
          <span class="label-text text-base-content">Descrizione</span>
        </label>
        <textarea
          id="planDescription"
          v-model="planDetails.description"
          placeholder="Descrivi brevemente il piano..."
          class="textarea textarea-bordered textarea-warning w-full h-24"></textarea>
      </div>
      <div>
        <label for="planDifficulty" class="label">
          <span class="label-text text-base-content">Livello Difficoltà</span>
        </label>
        <select
          id="planDifficulty"
          v-model="planDetails.difficulty_level"
          required
          class="select select-bordered select-warning w-full">
          <option disabled value="">Seleziona difficoltà</option>
          <option value="beginner">Principiante</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzato</option>
        </select>
      </div>
       <div>
        <label for="planDurationWeeks" class="label">
          <span class="label-text text-base-content">Durata (settimane)</span>
        </label>
        <input
          id="planDurationWeeks"
          v-model.number="planDetails.duration_weeks"
          type="number"
          min="1"
          placeholder="Es: 4"
          class="input input-bordered input-warning w-full" />
      </div>
    </div>

    <!-- Exercises Section -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-warning">Esercizi del Piano</h2>
      <div v-if="planStore.isLoadingExercises" class="text-center">
        <span class="loading loading-dots loading-md text-warning"></span> Caricamento esercizi disponibili...
      </div>
      <div v-else-if="planStore.exercises.length === 0" class="alert alert-sm alert-info">
          Nessun esercizio disponibile per la selezione. Caricane alcuni prima!
      </div>

      <div v-for="(item, index) in exerciseItems" :key="index" class="p-4 border border-base-300 rounded-md space-y-3 bg-base-100/10">
        <div class="flex justify-between items-center">
            <h3 class="font-medium text-warning">Esercizio #{{ item.order }}</h3>
            <button type="button" @click="removeExercise(index)" class="btn btn-xs btn-circle btn-outline btn-error">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div>
          <label class="label"><span class="label-text text-base-content">Esercizio</span></label>
          <select v-model="item.exercise_id" required class="select select-bordered select-warning w-full">
            <option disabled value="">Seleziona un esercizio</option>
            <option v-for="ex in planStore.exercises" :key="ex.id" :value="ex.id">
              {{ ex.name }} ({{ ex.type }})
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label class="label"><span class="label-text text-base-content">Serie</span></label>
            <input v-model.number="item.sets" type="number" min="1" placeholder="Es: 3" class="input input-sm input-bordered input-warning w-full" />
          </div>
          <div>
            <label class="label"><span class="label-text text-base-content">Ripetizioni</span></label>
            <input v-model="item.reps" type="text" placeholder="Es: 10-12" class="input input-sm input-bordered input-warning w-full" />
          </div>
          <div>
            <label class="label"><span class="label-text text-base-content">Riposo</span></label>
            <input v-model="item.rest_time" type="text" placeholder="Es: 60s" class="input input-sm input-bordered input-warning w-full" />
          </div>
           <div>
            <label class="label"><span class="label-text text-base-content">Ordine</span></label>
            <input v-model.number="item.order" type="number" min="1" placeholder="Es: 1" class="input input-sm input-bordered input-warning w-full" />
          </div>
        </div>
      </div>

      <button type="button" @click="addExercise" class="btn btn-sm btn-outline btn-warning">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Aggiungi Esercizio
      </button>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-6 border-t border-base-300">
      <button type="button" @click="$emit('cancel')" class="btn btn-ghost">Annulla</button>
      <button type="submit" class="btn btn-warning" :disabled="isLoadingSubmit || planStore.isLoadingExercises">
        <span v-if="isLoadingSubmit" class="loading loading-spinner loading-xs"></span>
        {{ initialPlanData ? 'Aggiorna Piano' : 'Crea Piano' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { usePlanManagementStore } from '@/store/planManagement';

const props = defineProps({
  initialPlanData: {
    type: Object,
    default: null,
  },
  isLoadingSubmit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit-plan', 'cancel']);

const planStore = usePlanManagementStore();

const planDetails = ref({
  name: '',
  description: '',
  difficulty_level: '',
  duration_weeks: null,
});

const exerciseItems = ref([]);

// Fetch exercises on mount
onMounted(() => {
  if (planStore.exercises.length === 0) {
    planStore.fetchExercises({ perPage: 1000 }); // Fetch all exercises for selection for now
  }
});

// Watch for initialPlanData to pre-fill the form
watch(() => props.initialPlanData,
  (newData) => {
    if (newData) {
      planDetails.value = {
        name: newData.name || '',
        description: newData.description || '',
        difficulty_level: newData.difficulty_level || '',
        duration_weeks: newData.duration_weeks || null,
      };
      // Assuming initialPlanData.exercise_details is the array of exercises
      // And each item has exercise_id, sets, reps, rest_time, order
      exerciseItems.value = (newData.exercise_details || []).map(ex => ({ ...ex }));
    } else {
      // Reset form if initialData becomes null (e.g. switching from edit to create)
      planDetails.value = { name: '', description: '', difficulty_level: '', duration_weeks: null };
      exerciseItems.value = [];
    }
  },
  { immediate: true, deep: true }
);

const addExercise = () => {
  const newOrder = exerciseItems.value.length > 0 ? Math.max(...exerciseItems.value.map(e => e.order || 0)) + 1 : 1;
  exerciseItems.value.push({
    exercise_id: '',
    sets: null,
    reps: '',
    rest_time: '',
    order: newOrder,
  });
};

const removeExercise = (index) => {
  exerciseItems.value.splice(index, 1);
  // Re-order remaining exercises if needed, or let user manage order numbers
  exerciseItems.value.forEach((item, idx) => {
    item.order = idx + 1; // Simple re-order, can be made more sophisticated
  });
};

const validateForm = () => {
  if (!planDetails.value.name.trim()) {
    alert('Il nome del piano è obbligatorio.');
    return false;
  }
  if (!planDetails.value.difficulty_level) {
    alert('Il livello di difficoltà è obbligatorio.');
    return false;
  }
  if (exerciseItems.value.length === 0) {
    alert('Aggiungere almeno un esercizio al piano.');
    return false;
  }
  for (const item of exerciseItems.value) {
    if (!item.exercise_id) {
      alert(`Selezionare un esercizio per l'elemento #${item.order}.`);
      return false;
    }
    if (item.sets == null || item.sets < 1) {
        alert(`Il numero di serie per l'esercizio #${item.order} deve essere almeno 1.`);
        return false;
    }
     if (!item.reps || String(item.reps).trim() === '') {
        alert(`Le ripetizioni per l'esercizio #${item.order} sono obbligatorie.`);
        return false;
    }
    if (item.order == null || item.order < 1) {
        alert(`L'ordine per l'esercizio #${item.order} deve essere almeno 1.`);
        return false;
    }
  }
  // Check for duplicate order numbers
  const orders = exerciseItems.value.map(e => e.order);
  if (new Set(orders).size !== orders.length) {
      alert('Ogni esercizio deve avere un numero d\'ordine unico.');
      return false;
  }
  return true;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  // Prepare data for submission
  const submissionData = {
    ...planDetails.value,
    // Ensure exercise_details is the correct name for the backend field
    exercise_details: exerciseItems.value.map(item => ({
      exercise: item.exercise_id, // Send only the ID
      sets: item.sets,
      reps: item.reps,
      rest_time: item.rest_time,
      order: item.order,
    })),
  };
  emit('submit-plan', submissionData);
};

</script>

<style scoped>
/* DaisyUI styles are largely used. Add custom tweaks if necessary. */
.label-text {
    color: hsl(var(--nc)); /* Neutral content for labels for better contrast on neutral bg */
}
.input-warning::placeholder, .textarea-warning::placeholder {
    color: hsl(var(--wc) / 0.6); /* Warning content color for placeholders */
}
</style>
