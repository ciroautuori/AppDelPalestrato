<template>
  <dialog ref="dialogRef" class="modal" :class="{ 'modal-open': show }" @close="closeModal">
    <div class="modal-box bg-gray-800 w-11/12 max-w-2xl">
      <form @submit.prevent="submitForm" novalidate>
        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
        <h3 class="font-bold text-lg mb-4">{{ isEditing ? 'Modifica Piano' : 'Crea Nuovo Piano' }}</h3>

        <!-- Nome e Descrizione -->
        <div class="form-control mb-4">
          <label class="label" for="plan-name">
            <span class="label-text">Nome Piano</span>
          </label>
          <input
            id="plan-name"
            v-model="formData.name"
            type="text"
            placeholder="Es: Piano Forza Base"
            class="input input-bordered input-warning w-full"
            required
          />
          <p v-if="formErrors.name" class="text-error text-xs mt-1">{{ formErrors.name }}</p>
        </div>

        <div class="form-control mb-4">
          <label class="label" for="plan-description">
            <span class="label-text">Descrizione</span>
          </label>
          <textarea
            id="plan-description"
            v-model="formData.description"
            placeholder="Descrizione breve del piano"
            class="textarea textarea-bordered textarea-warning w-full"
            rows="3"
            required
          ></textarea>
          <p v-if="formErrors.description" class="text-error text-xs mt-1">{{ formErrors.description }}</p>
        </div>

        <!-- Livello di Difficoltà -->
        <div class="form-control mb-4">
          <label class="label" for="difficulty-level">
            <span class="label-text">Livello di Difficoltà</span>
          </label>
          <select
            id="difficulty-level"
            v-model="formData.difficulty_level"
            class="select select-bordered select-warning w-full"
            required
          >
            <option disabled value="">Seleziona un livello</option>
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzato</option>
          </select>
          <p v-if="formErrors.difficulty_level" class="text-error text-xs mt-1">{{ formErrors.difficulty_level }}</p>
        </div>

        <!-- Dettagli Esercizi Dinamici -->
        <h4 class="font-semibold text-md mb-2">Esercizi</h4>
        <div v-if="exerciseStore.loading" class="text-center"><span class="loading loading-spinner text-warning"></span> Caricamento esercizi...</div>
        <div v-if="exerciseStore.error" class="alert alert-error text-xs p-2 mb-2">{{ exerciseStore.error }}</div>

        <div v-for="(detail, index) in formData.exercise_details" :key="index" class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-3 p-3 border border-gray-700 rounded-md">
          <div class="form-control md:col-span-4">
            <label class="label text-xs pb-1" :for="`exercise-id-${index}`">Esercizio</label>
            <select
              :id="`exercise-id-${index}`"
              v-model="detail.exercise_id"
              class="select select-bordered select-sm w-full"
              required
            >
              <option disabled value="">Seleziona</option>
              <option v-for="exercise in availableExercises" :key="exercise.id" :value="exercise.id">
                {{ exercise.name }}
              </option>
            </select>
          </div>
          <div class="form-control md:col-span-2">
            <label class="label text-xs pb-1" :for="`sets-${index}`">Serie</label>
            <input :id="`sets-${index}`" v-model.number="detail.sets" type="number" min="1" placeholder="3" class="input input-bordered input-sm w-full" required />
          </div>
          <div class="form-control md:col-span-2">
            <label class="label text-xs pb-1" :for="`reps-${index}`">Reps</label>
            <input :id="`reps-${index}`" v-model.number="detail.reps" type="number" min="1" placeholder="10" class="input input-bordered input-sm w-full" required />
          </div>
          <div class="form-control md:col-span-3">
            <label class="label text-xs pb-1" :for="`rest-${index}`">Recupero (s)</label>
            <input :id="`rest-${index}`" v-model.number="detail.rest_time_seconds" type="number" min="0" placeholder="60" class="input input-bordered input-sm w-full" required />
          </div>
          <div class="md:col-span-1 flex items-end">
            <button type="button" @click="removeExerciseDetail(index)" class="btn btn-error btn-sm w-full mt-4 md:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <button type="button" @click="addExerciseDetail" class="btn btn-outline btn-warning btn-sm mb-4" :disabled="exerciseStore.loading || availableExercises.length === 0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
          Aggiungi Esercizio
        </button>
        <p v-if="formErrors.exercise_details" class="text-error text-xs -mt-2 mb-2">{{ formErrors.exercise_details }}</p>


        <!-- Azioni Modale -->
        <div class="modal-action flex-col sm:flex-row gap-2 mt-6">
          <button type="button" class="btn btn-ghost w-full sm:w-auto" @click="closeModal" :disabled="isSubmitting">Annulla</button>
          <button type="submit" class="btn btn-warning w-full sm:w-auto" :disabled="isSubmitting || exerciseStore.loading">
            <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
            {{ isSubmitting ? (isEditing ? 'Salvataggio...' : 'Creazione...') : (isEditing ? 'Salva Modifiche' : 'Crea Piano') }}
          </button>
        </div>
      </form>
    </div>
     <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useExerciseStore } from '@/store/exercise';

const dialogRef = ref(null);

const props = defineProps({
  show: Boolean,
  planToEdit: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const exerciseStore = useExerciseStore();
const availableExercises = computed(() => exerciseStore.getExercises);

const initialFormData = {
  name: '',
  description: '',
  difficulty_level: '',
  exercise_details: [] // Array di oggetti { exercise_id: null, sets: null, reps: null, rest_time_seconds: null }
};

const formData = ref(JSON.parse(JSON.stringify(initialFormData)));
const formErrors = ref({});

const isEditing = computed(() => !!props.planToEdit);

watch(() => props.show, (newVal) => {
  if (newVal) {
    dialogRef.value?.showModal();
    formErrors.value = {}; // Reset errors
    if (!exerciseStore.exercises || exerciseStore.exercises.length === 0) {
      exerciseStore.fetchExercises().catch(err => {
        console.error("Failed to fetch exercises on modal open:", err);
      });
    }
    if (isEditing.value && props.planToEdit) {
      formData.value = {
        name: props.planToEdit.name || '',
        description: props.planToEdit.description || '',
        difficulty_level: props.planToEdit.difficulty_level || '',
        // Deep copy exercise_details and ensure all fields are present
        exercise_details: props.planToEdit.exercise_details ? JSON.parse(JSON.stringify(props.planToEdit.exercise_details)).map(ed => ({
            exercise_id: ed.exercise_id,
            sets: ed.sets,
            reps: ed.reps,
            rest_time_seconds: ed.rest_time_seconds,
            // handle potential id if present in input, but not needed for save
            id: ed.id || undefined
        })) : []
      };
      // If no exercises, add one empty row to start
      if (formData.value.exercise_details.length === 0) {
        addExerciseDetail();
      }
    } else {
      formData.value = JSON.parse(JSON.stringify(initialFormData));
      addExerciseDetail(); // Add one empty exercise row for new plans
    }
  } else {
    dialogRef.value?.close();
  }
});

const addExerciseDetail = () => {
  formData.value.exercise_details.push({
    exercise_id: null,
    sets: null,
    reps: null,
    rest_time_seconds: null
  });
};

const removeExerciseDetail = (index) => {
  formData.value.exercise_details.splice(index, 1);
};

const validateForm = () => {
  const errors = {};
  if (!formData.value.name.trim()) {
    errors.name = 'Il nome del piano è obbligatorio.';
  }
  if (!formData.value.description.trim()) {
    errors.description = 'La descrizione del piano è obbligatoria.';
  }
  if (!formData.value.difficulty_level) {
    errors.difficulty_level = 'Il livello di difficoltà è obbligatorio.';
  }
  if (!formData.value.exercise_details || formData.value.exercise_details.length === 0) {
    errors.exercise_details = 'Devi includere almeno un esercizio nel piano.';
  } else {
    formData.value.exercise_details.forEach((detail, index) => {
      if (!detail.exercise_id) {
        errors.exercise_details = errors.exercise_details || `Esercizio ${index + 1}: Seleziona un esercizio.`;
      }
      if (detail.sets == null || detail.sets < 1) {
        errors.exercise_details = errors.exercise_details || `Esercizio ${index + 1}: Inserisci un numero di serie valido (>=1).`;
      }
      if (detail.reps == null || detail.reps < 1) {
        errors.exercise_details = errors.exercise_details || `Esercizio ${index + 1}: Inserisci un numero di ripetizioni valido (>=1).`;
      }
      if (detail.rest_time_seconds == null || detail.rest_time_seconds < 0) {
        errors.exercise_details = errors.exercise_details || `Esercizio ${index + 1}: Inserisci un tempo di recupero valido (>=0).`;
      }
    });
  }
  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const submitForm = () => {
  if (validateForm()) {
    // Prepare data for submission with correct types and order_in_plan
    const dataToSave = {
      ...formData.value,
      exercise_details: formData.value.exercise_details.map(({ id, ...rest }, index) => ({
        ...rest,
        sets: String(rest.sets),
        reps: String(rest.reps),
        order_in_plan: index + 1
      }))
    };
    emit('save', dataToSave);
  }
};

const closeModal = () => {
  if (!props.isSubmitting) {
    dialogRef.value?.close();
    emit('close');
  }
};

// Ensure exercises are loaded when the component is mounted,
// though the watch on `props.show` will also trigger it.
onMounted(() => {
  if (!exerciseStore.exercises || exerciseStore.exercises.length === 0) {
     exerciseStore.fetchExercises().catch(err => {
        console.error("Failed to fetch exercises on mount:", err);
      });
  }
});

</script>

<style scoped>
.modal-box {
  max-height: calc(100vh - 5em); /* Consider viewport height for modals */
}

/* DaisyUI specific: ensure modal backdrop is clickable to close */
.modal:not(dialog[open]) {
  display: none;
}
/* Ensure modal is displayed when open (needed if not using showModal() method) */
.modal-open {
    display: grid;
    place-items: center;
}

.table th,
.table td {
  white-space: nowrap;
  padding: 0.75rem;
}
.btn-xs {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.label-text {
  color: hsl(var(--nc) / var(--tw-text-opacity)); /* Use DaisyUI neutral-content color */
  opacity: 0.7; /* Slightly less prominent than main text */
}
.input-sm, .select-sm {
  font-size: 0.875rem; /* 14px */
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
</style>
