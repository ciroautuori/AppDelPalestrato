<template>
  <dialog class="modal modal-bottom sm:modal-middle" :open="showModal">
    <div class="modal-box bg-gray-800 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
      <form @submit.prevent="handleSubmit">
        <button
          @click="$emit('close-modal')"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
        
        <h3 class="font-bold text-lg text-warning mb-6">Registra Allenamento</h3>

        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <span class="loading loading-spinner loading-lg text-warning"></span>
        </div>

        <div v-else-if="error" class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <div v-else class="space-y-6">
          <!-- Esercizi del Piano -->
          <div v-for="(exercise, index) in workoutPlan.exercise_details" :key="exercise.id" 
               class="card bg-gray-700 shadow-xl">
            <div class="card-body p-4">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="text-lg font-semibold text-warning">{{ exercise.exercise.name }}</h4>
                  <p class="text-sm text-gray-300">Target: {{ exercise.sets }} serie x {{ exercise.reps }} ripetizioni</p>
                </div>
              </div>

              <!-- Serie -->
              <div class="space-y-3">
                <div v-for="setIndex in parseInt(exercise.sets)" :key="setIndex" 
                     class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div class="text-sm font-medium text-gray-300">
                    Serie {{ setIndex }}
                  </div>
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-xs">Peso (kg)</span>
                    </label>
                    <input
                      type="number"
                      v-model.number="exerciseLogs[index].sets_data[setIndex - 1].weight"
                      min="0"
                      step="0.5"
                      class="input input-bordered input-sm w-full"
                      :placeholder="'Es: 80'"
                    />
                  </div>
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text text-xs">Ripetizioni</span>
                    </label>
                    <input
                      type="number"
                      v-model.number="exerciseLogs[index].sets_data[setIndex - 1].reps"
                      min="0"
                      class="input input-bordered input-sm w-full"
                      :placeholder="'Es: 10'"
                    />
                  </div>
                </div>
              </div>

              <!-- Note per l'esercizio -->
              <div class="mt-4">
                <label class="label">
                  <span class="label-text text-xs">Note per questo esercizio</span>
                </label>
                <textarea
                  v-model="exerciseLogs[index].notes"
                  class="textarea textarea-bordered w-full text-sm"
                  rows="2"
                  placeholder="Es: Ho avuto difficoltà con l'ultima serie..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Note generali -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-warning">Note generali sull'allenamento</span>
            </label>
            <textarea
              v-model="generalNotes"
              class="textarea textarea-bordered w-full"
              rows="3"
              placeholder="Es: Ho avuto un ottimo allenamento, mi sono sentito forte..."
            ></textarea>
          </div>
        </div>

        <!-- Azioni -->
        <div class="modal-action">
          <button
            type="button"
            @click="$emit('close-modal')"
            class="btn btn-ghost"
            :disabled="isSubmitting">Annulla</button>
          <button
            type="submit"
            class="btn btn-warning"
            :disabled="isSubmitting || !isFormValid">
            <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
            Salva Allenamento
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close-modal')">close</button>
    </form>
  </dialog>

  <!-- PR Celebration Modal -->
  <PRCelebrationModal
    v-model="showPRCelebration"
    :record="newPR"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAthleteStore } from '@/store/athlete';
import { useToastStore } from '@/store/toast';
import { usePRStore } from '@/store/pr';
import PRCelebrationModal from '@/components/modals/PRCelebrationModal.vue';

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  },
  workoutPlan: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close-modal']);

const athleteStore = useAthleteStore();
const toastStore = useToastStore();
const prStore = usePRStore();
const isLoading = ref(false);
const error = ref(null);
const isSubmitting = ref(false);
const generalNotes = ref('');
const showPRCelebration = ref(false);
const newPR = ref(null);

// Inizializza i log degli esercizi
const exerciseLogs = ref([]);

// Inizializza i log quando il piano cambia
watch(() => props.workoutPlan, (newPlan) => {
  if (newPlan && newPlan.exercise_details) {
    exerciseLogs.value = newPlan.exercise_details.map(exercise => ({
      exercise_id: exercise.exercise.id,
      sets_data: Array(parseInt(exercise.sets)).fill().map(() => ({
        weight: null,
        reps: null
      })),
      notes: ''
    }));
  }
}, { immediate: true });

// Validazione del form
const isFormValid = computed(() => {
  if (!exerciseLogs.value.length) return false;
  
  return exerciseLogs.value.every(exerciseLog => 
    exerciseLog.sets_data.every(set => 
      set.weight !== null && set.weight >= 0 && 
      set.reps !== null && set.reps >= 0
    )
  );
});

// Gestione del submit
const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const payload = {
      workout_plan_id: props.workoutPlan.id,
      notes: generalNotes.value,
      exercise_logs: exerciseLogs.value
    };

    const response = await athleteStore.logWorkout(payload);
    
    // Check if a new PR was achieved
    if (response.new_pr_achieved) {
      // Get the latest PR from the store
      await prStore.fetchPersonalRecords();
      const latestPR = prStore.getPersonalRecords[0]; // Assuming the latest PR is the first one
      newPR.value = latestPR;
      showPRCelebration.value = true;
    }

    toastStore.showToast('Allenamento registrato con successo!', 'success');
    emit('close-modal');
  } catch (err) {
    error.value = err.response?.data?.detail || 'Errore durante il salvataggio dell\'allenamento';
    toastStore.showToast(error.value, 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-box {
  @apply bg-gray-800 text-white;
}

.input, .textarea {
  @apply bg-gray-700 border-gray-600 text-white;
}

.input:focus, .textarea:focus {
  @apply border-warning;
}

.label-text {
  @apply text-gray-300;
}

/* Stili per i numeri negativi */
input[type="number"]:invalid {
  @apply border-error;
}
</style> 