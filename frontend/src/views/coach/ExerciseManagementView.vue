<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestione Esercizi</h1>
      <button class="btn btn-primary" @click="openCreateExerciseModal">
        <i class="fas fa-plus mr-2"></i>
        Crea Nuovo Esercizio
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="exerciseStore.loading" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="exerciseStore.error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ exerciseStore.error }}</span>
    </div>

    <!-- Exercises List -->
    <div v-else-if="exercises && exercises.length > 0">
      <ExercisesTable
        :exercises="exercises"
        @edit-exercise="openEditExerciseModal"
        @delete-exercise="confirmDeleteExercise"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <p class="text-lg text-gray-500">
        Nessun esercizio trovato. Clicca 'Crea Nuovo Esercizio' per iniziare.
      </p>
    </div>

    <!-- Exercise Form Modal -->
    <ExerciseFormModal
      :show="showExerciseModal"
      :exercise-to-edit="exerciseToEdit"
      :is-submitting="isSubmittingForm"
      @close="closeExerciseModal"
      @save="handleExerciseSave"
    />

    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'modal-open': showDeleteModal }">
      <div class="modal-box bg-gray-800">
        <h3 class="font-bold text-lg">Conferma Eliminazione</h3>
        <p class="py-4">Sei sicuro di voler eliminare l'esercizio "{{ exerciseToDelete?.name }}"?</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeDeleteModal" :disabled="isDeleting">Annulla</button>
          <button
            class="btn btn-error"
            @click="executeDeleteExercise"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="loading loading-spinner loading-sm"></span>
            Elimina
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="closeDeleteModal"></div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useExerciseStore } from '@/store/exercise';
import { useToastStore } from '@/store/toast';
import ExercisesTable from '@/components/coach/ExercisesTable.vue';
import ExerciseFormModal from '@/components/coach/ExerciseFormModal.vue';
import Toast from '@/components/Toast.vue';

const exerciseStore = useExerciseStore();
const toastStore = useToastStore();

const exercises = computed(() => exerciseStore.exercises || []);

const showExerciseModal = ref(false);
const exerciseToEdit = ref(null);
const isSubmittingForm = ref(false);

const showDeleteModal = ref(false);
const exerciseToDelete = ref(null);
const isDeleting = ref(false);

const openCreateExerciseModal = () => {
  exerciseToEdit.value = null;
  showExerciseModal.value = true;
};

const openEditExerciseModal = (exercise) => {
  exerciseToEdit.value = { ...exercise };
  showExerciseModal.value = true;
};

const closeExerciseModal = () => {
  showExerciseModal.value = false;
  exerciseToEdit.value = null;
};

const handleExerciseSave = async (exerciseData) => {
  isSubmittingForm.value = true;
  try {
    if (exerciseToEdit.value?.id) {
      await exerciseStore.updateExercise(exerciseToEdit.value.id, exerciseData);
      toastStore.showToast('Esercizio aggiornato con successo!', 'success');
    } else {
      await exerciseStore.createExercise(exerciseData);
      toastStore.showToast('Esercizio creato con successo!', 'success');
    }
    closeExerciseModal();
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Errore durante il salvataggio dell\'esercizio.';
    toastStore.showToast(message, 'error');
  } finally {
    isSubmittingForm.value = false;
  }
};

const confirmDeleteExercise = (exercise) => {
  exerciseToDelete.value = exercise;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  exerciseToDelete.value = null;
};

const executeDeleteExercise = async () => {
  if (!exerciseToDelete.value?.id) return;

  isDeleting.value = true;
  try {
    await exerciseStore.deleteExercise(exerciseToDelete.value.id);
    toastStore.showToast('Esercizio eliminato con successo!', 'success');
    closeDeleteModal();
  } catch (error) {
    const message = error.response?.data?.detail || error.message || "Errore durante l'eliminazione dell'esercizio";
    toastStore.showToast(message, 'error');
  } finally {
    isDeleting.value = false;
  }
};

onMounted(async () => {
  if (!exerciseStore.exercises?.length) {
    try {
      await exerciseStore.fetchExercises();
    } catch (error) {
      console.error("Failed to fetch exercises on mount:", error);
    }
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style> 