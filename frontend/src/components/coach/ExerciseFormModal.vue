<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" :class="{ 'modal-open': show }" @close="closeModal">
    <div class="modal-box bg-gray-800 w-11/12 max-w-2xl">
      <form @submit.prevent="submitForm" novalidate>
        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
        <h3 class="font-bold text-lg mb-6">{{ isEditing ? 'Modifica Esercizio' : 'Crea Nuovo Esercizio' }}</h3>

        <div class="space-y-4">
          <!-- Nome -->
          <div class="form-control">
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
          <div class="form-control">
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
          <div class="form-control">
            <label class="label" for="description">
              <span class="label-text">Descrizione</span>
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              class="textarea textarea-bordered textarea-warning w-full h-24"
              placeholder="Descrivi l'esercizio..."
            ></textarea>
          </div>

          <!-- URL Video -->
          <div class="form-control">
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
        </div>

        <!-- Action Buttons -->
        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="closeModal" :disabled="isSubmitting">Annulla</button>
          <button type="submit" class="btn btn-warning" :disabled="isSubmitting">
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

/* Ensure buttons are touch-friendly on mobile */
.btn {
  @apply min-h-[2.5rem] px-4;
}
</style> 