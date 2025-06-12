<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" :class="{ 'modal-open': show }" @close="closeModal">
    <div class="modal-box bg-gray-800 w-11/12 max-w-2xl">
      <form @submit.prevent="submitForm" novalidate>
        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
        <h3 class="font-bold text-lg mb-6">{{ isEditing ? 'Modifica Piano' : 'Crea Nuovo Piano' }}</h3>

        <!-- Progress Steps -->
        <ul class="steps steps-horizontal w-full mb-8">
          <li class="step step-warning" :class="{ 'step-primary': currentStep >= 1 }">Dettagli Piano</li>
          <li class="step step-warning" :class="{ 'step-primary': currentStep >= 2 }">Esercizi</li>
        </ul>

        <!-- Step 1: Plan Details -->
        <div v-if="currentStep === 1" class="space-y-4">
          <div class="form-control">
            <label class="label" for="plan-name">
              <span class="label-text">Nome Piano</span>
            </label>
            <input
              id="plan-name"
              v-model="formData.name"
              type="text"
              placeholder="Es: Piano Principianti"
              class="input input-bordered input-warning w-full"
              required
            />
            <p v-if="formErrors.name" class="text-error text-xs mt-1">{{ formErrors.name }}</p>
          </div>

          <div class="form-control">
            <label class="label" for="plan-description">
              <span class="label-text">Descrizione</span>
            </label>
            <textarea
              id="plan-description"
              v-model="formData.description"
              class="textarea textarea-bordered textarea-warning w-full h-24"
              placeholder="Descrivi il piano di allenamento..."
            ></textarea>
          </div>

          <div class="form-control">
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
        </div>

        <!-- Step 2: Exercises -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div v-if="exerciseStore.loading" class="text-center">
            <span class="loading loading-spinner text-warning"></span>
            <p class="mt-2">Caricamento esercizi...</p>
          </div>
          <div v-else-if="exerciseStore.error" class="alert alert-error text-xs p-2 mb-2">
            {{ exerciseStore.error }}
          </div>
          <div v-else>
            <div v-for="(detail, index) in formData.exercise_details" :key="index" 
                 class="card bg-base-200 mb-4">
              <div class="card-body p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium">Esercizio #{{ index + 1 }}</h4>
                  <button type="button" @click="removeExerciseDetail(index)" 
                          class="btn btn-xs btn-circle btn-error">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="form-control">
                    <label class="label text-xs" :for="`exercise-id-${index}`">Esercizio</label>
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
                  
                  <div class="form-control">
                    <label class="label text-xs" :for="`sets-${index}`">Serie</label>
                    <input
                      :id="`sets-${index}`"
                      v-model.number="detail.sets"
                      type="number"
                      min="1"
                      placeholder="3"
                      class="input input-bordered input-sm w-full"
                      required
                    />
                  </div>
                  
                  <div class="form-control">
                    <label class="label text-xs" :for="`reps-${index}`">Reps</label>
                    <input
                      :id="`reps-${index}`"
                      v-model.number="detail.reps"
                      type="number"
                      min="1"
                      placeholder="10"
                      class="input input-bordered input-sm w-full"
                      required
                    />
                  </div>
                  
                  <div class="form-control">
                    <label class="label text-xs" :for="`rest-${index}`">Recupero (s)</label>
                    <input
                      :id="`rest-${index}`"
                      v-model.number="detail.rest_time_seconds"
                      type="number"
                      min="0"
                      placeholder="60"
                      class="input input-bordered input-sm w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="button" @click="addExerciseDetail" 
                    class="btn btn-outline btn-warning btn-sm w-full mt-2">
              <i class="fas fa-plus mr-2"></i>
              Aggiungi Esercizio
            </button>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="closeModal" :disabled="isSubmitting">
            Annulla
          </button>
          <button v-if="currentStep === 1" type="button" class="btn btn-warning" @click="nextStep">
            Avanti
          </button>
          <button v-if="currentStep === 2" type="button" class="btn btn-ghost" @click="prevStep">
            Indietro
          </button>
          <button v-if="currentStep === 2" type="submit" class="btn btn-warning" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
            {{ isEditing ? 'Aggiorna' : 'Crea' }}
          </button>
        </div>
      </form>
    </div>
    <div class="modal-backdrop" @click="closeModal"></div>
  </dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useExerciseStore } from '@/store/exercise';

const dialogRef = ref(null);
const currentStep = ref(1);

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
  exercise_details: []
};

const formData = ref(JSON.parse(JSON.stringify(initialFormData)));
const formErrors = ref({});

const isEditing = computed(() => !!props.planToEdit);

const nextStep = () => {
  if (validateStep1()) {
    currentStep.value = 2;
  }
};

const prevStep = () => {
  currentStep.value = 1;
};

const validateStep1 = () => {
  const errors = {};
  if (!formData.value.name.trim()) {
    errors.name = 'Il nome del piano è obbligatorio.';
  }
  if (!formData.value.difficulty_level) {
    errors.difficulty_level = 'Il livello di difficoltà è obbligatorio.';
  }
  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    dialogRef.value?.showModal();
    formErrors.value = {};
    currentStep.value = 1;
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
        exercise_details: props.planToEdit.exercise_details ? JSON.parse(JSON.stringify(props.planToEdit.exercise_details)).map(ed => ({
          exercise_id: ed.exercise_id,
          sets: ed.sets,
          reps: ed.reps,
          rest_time_seconds: ed.rest_time_seconds,
          id: ed.id || undefined
        })) : []
      };
      if (formData.value.exercise_details.length === 0) {
        addExerciseDetail();
      }
    } else {
      formData.value = JSON.parse(JSON.stringify(initialFormData));
      addExerciseDetail();
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

const submitForm = () => {
  if (validateStep1() && formData.value.exercise_details.length > 0) {
    emit('save', formData.value);
  }
};

const closeModal = () => {
  if (!props.isSubmitting) {
    dialogRef.value?.close();
    emit('close');
  }
};

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
  @apply max-h-[90vh] overflow-y-auto;
}

.modal-bottom {
  @apply sm:modal-middle;
}

.form-control {
  @apply space-y-1;
}

.label {
  @apply p-0;
}

.label-text {
  @apply text-sm font-medium;
}

.input, .select, .textarea {
  @apply text-base;
}

.modal-action {
  @apply mt-6 pt-4 border-t border-gray-700;
}

.card {
  @apply bg-gray-800 border border-gray-700;
}

/* Ensure buttons are touch-friendly on mobile */
.btn {
  @apply min-h-[2.5rem] px-4;
}

.steps {
  @apply text-sm;
}

.step {
  @apply text-gray-400;
}

.step-primary {
  @apply text-warning;
}
</style>
