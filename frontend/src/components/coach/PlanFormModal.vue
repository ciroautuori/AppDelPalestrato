<template>
  <dialog id="plan_form_modal" class="modal" :class="{ 'modal-open': show }">
    <div class="modal-box w-11/12 max-w-4xl">
      <h3 class="font-bold text-lg mb-4">
        {{ planToEdit ? 'Modifica Piano' : 'Crea Nuovo Piano' }}
      </h3>

      <form @submit.prevent="handleSubmit">
        <!-- Basic Info -->
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nome del Piano*</span>
            </label>
            <input
              type="text"
              v-model="formData.name"
              class="input input-bordered"
              required
              :class="{ 'input-error': errors.name }"
            />
            <label class="label" v-if="errors.name">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Descrizione</span>
            </label>
            <textarea
              v-model="formData.description"
              class="textarea textarea-bordered"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Exercises Section -->
        <div class="mt-6">
          <div class="flex justify-between items-center mb-4">
            <h4 class="font-semibold">Esercizi</h4>
            <button
              type="button"
              class="btn btn-sm btn-primary"
              @click="addExercise"
            >
              <i class="fas fa-plus mr-2"></i>
              Aggiungi Esercizio
            </button>
          </div>

          <div v-if="formData.exercise_details.length === 0" class="text-center py-4 text-gray-500">
            Nessun esercizio aggiunto
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(exercise, index) in formData.exercise_details"
              :key="index"
              class="card bg-base-200 p-4"
            >
              <div class="flex justify-between items-start mb-4">
                <h5 class="font-medium">Esercizio {{ index + 1 }}</h5>
                <button
                  type="button"
                  class="btn btn-sm btn-ghost text-error"
                  @click="removeExercise(index)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Esercizio*</span>
                  </label>
                  <select
                    v-model="exercise.exercise_id"
                    class="select select-bordered"
                    required
                    :class="{ 'select-error': errors[`exercise_details.${index}.exercise_id`] }"
                  >
                    <option value="">Seleziona un esercizio</option>
                    <option
                      v-for="ex in availableExercises"
                      :key="ex.id"
                      :value="ex.id"
                    >
                      {{ ex.name }}
                    </option>
                  </select>
                  <label class="label" v-if="errors[`exercise_details.${index}.exercise_id`]">
                    <span class="label-text-alt text-error">
                      {{ errors[`exercise_details.${index}.exercise_id`] }}
                    </span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Serie*</span>
                  </label>
                  <input
                    type="number"
                    v-model.number="exercise.sets"
                    class="input input-bordered"
                    min="1"
                    required
                    :class="{ 'input-error': errors[`exercise_details.${index}.sets`] }"
                  />
                  <label class="label" v-if="errors[`exercise_details.${index}.sets`]">
                    <span class="label-text-alt text-error">
                      {{ errors[`exercise_details.${index}.sets`] }}
                    </span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Ripetizioni*</span>
                  </label>
                  <input
                    type="text"
                    v-model="exercise.reps"
                    class="input input-bordered"
                    placeholder="es. 8-12"
                    required
                    :class="{ 'input-error': errors[`exercise_details.${index}.reps`] }"
                  />
                  <label class="label" v-if="errors[`exercise_details.${index}.reps`]">
                    <span class="label-text-alt text-error">
                      {{ errors[`exercise_details.${index}.reps`] }}
                    </span>
                  </label>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Tempo di Riposo (secondi)*</span>
                  </label>
                  <input
                    type="number"
                    v-model.number="exercise.rest_time_seconds"
                    class="input input-bordered"
                    min="0"
                    required
                    :class="{ 'input-error': errors[`exercise_details.${index}.rest_time_seconds`] }"
                  />
                  <label class="label" v-if="errors[`exercise_details.${index}.rest_time_seconds`]">
                    <span class="label-text-alt text-error">
                      {{ errors[`exercise_details.${index}.rest_time_seconds`] }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="modal-action">
          <button type="button" class="btn" @click="$emit('close')">
            Annulla
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
            {{ planToEdit ? 'Salva Modifiche' : 'Crea Piano' }}
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useExerciseStore } from '@/store/exercise';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
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
const errors = ref({});

// Form data
const formData = ref({
  name: '',
  description: '',
  exercise_details: []
});

// Computed
const availableExercises = computed(() => exerciseStore.exercises);

// Methods
const addExercise = () => {
  formData.value.exercise_details.push({
    exercise_id: '',
    sets: 3,
    reps: '10',
    rest_time_seconds: 60
  });
};

const removeExercise = (index) => {
  formData.value.exercise_details.splice(index, 1);
};

const handleSubmit = () => {
  errors.value = {};
  
  // Validate form
  if (!formData.value.name) {
    errors.value.name = 'Il nome del piano è obbligatorio';
  }
  
  if (formData.value.exercise_details.length === 0) {
    errors.value.exercise_details = 'Aggiungi almeno un esercizio';
  }
  
  // Validate each exercise
  formData.value.exercise_details.forEach((exercise, index) => {
    if (!exercise.exercise_id) {
      errors.value[`exercise_details.${index}.exercise_id`] = 'Seleziona un esercizio';
    }
    if (!exercise.sets || exercise.sets < 1) {
      errors.value[`exercise_details.${index}.sets`] = 'Inserisci un numero valido di serie';
    }
    if (!exercise.reps) {
      errors.value[`exercise_details.${index}.reps`] = 'Inserisci le ripetizioni';
    }
    if (!exercise.rest_time_seconds || exercise.rest_time_seconds < 0) {
      errors.value[`exercise_details.${index}.rest_time_seconds`] = 'Inserisci un tempo di riposo valido';
    }
  });
  
  if (Object.keys(errors.value).length === 0) {
    emit('save', { ...formData.value });
  }
};

// Watch for planToEdit changes
watch(() => props.planToEdit, (newPlan) => {
  if (newPlan) {
    formData.value = {
      name: newPlan.name,
      description: newPlan.description,
      exercise_details: newPlan.exercise_details || []
    };
  } else {
    formData.value = {
      name: '',
      description: '',
      exercise_details: []
    };
  }
  errors.value = {};
}, { immediate: true });

// Load exercises when modal opens
watch(() => props.show, (newShow) => {
  if (newShow) {
    exerciseStore.fetchExercises();
  }
});

// Reset form when modal closes
watch(() => props.show, (newShow) => {
  if (!newShow) {
    formData.value = {
      name: '',
      description: '',
      exercise_details: []
    };
    errors.value = {};
  }
});
</script>

<style scoped>
.modal-box {
  max-height: 90vh;
  overflow-y: auto;
}
</style> 