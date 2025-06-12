<template>
  <dialog ref="dialogRef" class="modal" :class="{ 'modal-open': show }" @close="closeModal">
    <div class="modal-box bg-gray-800 w-11/12 max-w-2xl">
      <form @submit.prevent="submitForm" novalidate>
        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
        <h3 class="font-bold text-lg mb-4">{{ isEditing ? 'Modifica Esercizio' : 'Crea Nuovo Esercizio' }}</h3>

        <!-- Nome -->
        <div class="form-control mb-4">
          <label class="label" for="exercise-name">
            <span class="label-text">Nome Esercizio</span>
          </label>
          <input
            id="exercise-name"
            v-model="formData.name"
            type="text"
            placeholder="Es: Squat"
            class="input input-bordered input-warning w-full"
            required
          />
          <p v-if="formErrors.name" class="text-error text-xs mt-1">{{ formErrors.name }}</p>
        </div>

        <!-- Gruppo Muscolare -->
        <div class="form-control mb-4">
          <label class="label" for="muscle-group">
            <span class="label-text">Gruppo Muscolare</span>
          </label>
          <select
            id="muscle-group"
            v-model="formData.muscle_group"
            class="select select-bordered select-warning w-full"
            required
          >
            <option disabled value="">Seleziona un gruppo muscolare</option>
            <option v-for="group in muscleGroups" :key="group" :value="group">
              {{ group }}
            </option>
          </select>
          <p v-if="formErrors.muscle_group" class="text-error text-xs mt-1">{{ formErrors.muscle_group }}</p>
        </div>

        <!-- Descrizione -->
        <div class="form-control mb-4">
          <label class="label" for="exercise-description">
            <span class="label-text">Descrizione (opzionale)</span>
          </label>
          <textarea
            id="exercise-description"
            v-model="formData.description"
            placeholder="Descrizione dell'esercizio"
            class="textarea textarea-bordered textarea-warning w-full"
            rows="3"
          ></textarea>
          <p v-if="formErrors.description" class="text-error text-xs mt-1">{{ formErrors.description }}</p>
        </div>

        <!-- URL Video (opzionale) -->
        <div class="form-control mb-4">
          <label class="label" for="video-url">
            <span class="label-text">URL Video (opzionale)</span>
          </label>
          <input
            id="video-url"
            v-model="formData.video_url"
            type="url"
            placeholder="https://..."
            class="input input-bordered input-warning w-full"
          />
          <p v-if="formErrors.video_url" class="text-error text-xs mt-1">{{ formErrors.video_url }}</p>
        </div>

        <!-- Azioni Modale -->
        <div class="modal-action flex-col sm:flex-row gap-2 mt-6">
          <button type="button" class="btn btn-ghost w-full sm:w-auto" @click="closeModal" :disabled="isSubmitting">Annulla</button>
          <button type="submit" class="btn btn-warning w-full sm:w-auto" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
            {{ isSubmitting ? (isEditing ? 'Salvataggio...' : 'Creazione...') : (isEditing ? 'Salva Modifiche' : 'Crea Esercizio') }}
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
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  exerciseToEdit: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const dialogRef = ref(null);

const muscleGroups = [
  'Petto',
  'Schiena',
  'Spalle',
  'Bicipiti',
  'Tricipiti',
  'Gambe',
  'Addominali',
  'Cardio'
];

const initialFormData = {
  name: '',
  description: '',
  muscle_group: '',
  video_url: ''
};

const formData = ref(JSON.parse(JSON.stringify(initialFormData)));
const formErrors = ref({});

const isEditing = computed(() => !!props.exerciseToEdit);

watch(() => props.show, (newVal) => {
  if (newVal) {
    dialogRef.value?.showModal();
    formErrors.value = {};
    if (isEditing.value && props.exerciseToEdit) {
      formData.value = {
        name: props.exerciseToEdit.name || '',
        description: props.exerciseToEdit.description || '',
        muscle_group: props.exerciseToEdit.muscle_group || '',
        video_url: props.exerciseToEdit.video_url || ''
      };
    } else {
      formData.value = JSON.parse(JSON.stringify(initialFormData));
    }
  } else {
    dialogRef.value?.close();
  }
});

const validateForm = () => {
  const errors = {};
  if (!formData.value.name.trim()) {
    errors.name = 'Il nome dell\'esercizio è obbligatorio.';
  }
  if (!formData.value.muscle_group) {
    errors.muscle_group = 'Il gruppo muscolare è obbligatorio.';
  }
  if (formData.value.video_url && !isValidUrl(formData.value.video_url)) {
    errors.video_url = 'L\'URL del video non è valido.';
  }
  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const submitForm = () => {
  if (validateForm()) {
    // Create a copy of the form data
    const payload = { ...formData.value };

    // Remove video_url if it's an empty string
    if (payload.video_url === '') {
      delete payload.video_url;
    }

    // Remove description if it's an empty string (since it's optional)
    if (payload.description === '') {
      delete payload.description;
    }

    emit('save', payload);
  }
};

const closeModal = () => {
  if (!props.isSubmitting) {
    dialogRef.value?.close();
    emit('close');
  }
};
</script>

<style scoped>
.modal-box {
  max-height: calc(100vh - 5em);
}

.modal:not(dialog[open]) {
  display: none;
}

.modal-open {
  display: grid;
}
</style> 