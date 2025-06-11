<template>
  <dialog class="modal modal-bottom sm:modal-middle" :open="showModal">
    <div class="modal-box bg-neutral text-neutral-content">
      <form method="dialog">
        <button
          @click="$emit('close-modal')"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
      </form>
      <h3 class="font-bold text-lg text-warning mb-6">Assegna Piano ad Atleta</h3>

      <div class="space-y-4">
        <div>
          <label for="selectPlan" class="label">
            <span class="label-text text-base-content">Scegli Piano</span>
          </label>
          <select
            id="selectPlan"
            v-model="selectedPlanId"
            class="select select-bordered select-warning w-full"
            :disabled="plans.length === 0">
            <option :value="null" disabled>
              {{ plans.length === 0 ? 'Nessun piano disponibile' : 'Seleziona un piano' }}
            </option>
            <option v-for="plan in plans" :key="plan.id" :value="plan.id">
              {{ plan.name }} ({{ plan.difficulty_level }})
            </option>
          </select>
        </div>

        <div>
          <label for="selectAthlete" class="label">
            <span class="label-text text-base-content">Scegli Atleta</span>
          </label>
          <select
            id="selectAthlete"
            v-model="selectedAthleteId"
            class="select select-bordered select-warning w-full"
            :disabled="athletes.length === 0">
            <option :value="null" disabled>
              {{ athletes.length === 0 ? 'Nessun atleta disponibile' : 'Seleziona un atleta' }}
            </option>
            <option v-for="athlete in athletes" :key="athlete.id || athlete.pk" :value="athlete.id || athlete.pk">
              {{ athlete.first_name }} {{ athlete.last_name }} ({{ athlete.email }})
            </option>
          </select>
        </div>
      </div>

      <div class="modal-action mt-8">
        <button
          @click="$emit('close-modal')"
          class="btn btn-ghost"
          :disabled="isLoadingAssign">Annulla</button>
        <button
          @click="handleAssignPlan"
          class="btn btn-warning"
          :disabled="isLoadingAssign || !selectedPlanId || !selectedAthleteId">
          <span v-if="isLoadingAssign" class="loading loading-spinner loading-xs"></span>
          Assegna Piano
        </button>
      </div>
    </div>
     <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close-modal')">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  plans: {
    type: Array,
    required: true,
    default: () => [],
  },
  athletes: {
    type: Array,
    required: true,
    default: () => [],
  },
  isLoadingAssign: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['assign-plan', 'close-modal']);

const selectedPlanId = ref(null);
const selectedAthleteId = ref(null);

// Reset fields when modal is shown
watch(() => props.showModal, (isVisible) => {
  if (isVisible) {
    selectedPlanId.value = null;
    selectedAthleteId.value = null;
  }
});

const handleAssignPlan = () => {
  if (!selectedPlanId.value || !selectedAthleteId.value) {
    // This should ideally be handled by disabling the button,
    // but as a fallback:
    alert('Per favore, seleziona sia un piano che un atleta.'); // Replace with better notification
    return;
  }
  emit('assign-plan', {
    plan_id: selectedPlanId.value,
    athlete_id: selectedAthleteId.value,
  });
};
</script>

<style scoped>
/* DaisyUI styles are largely used. Add custom tweaks if necessary. */
.label-text {
    /* color: hsl(var(--nc)); Ensure good contrast if needed */
}
.modal-box {
  /* background-color: hsl(var(--n)); */ /* Using neutral bg from DaisyUI theme */
}
</style>
