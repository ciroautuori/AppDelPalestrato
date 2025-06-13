<template>
  <div v-if="isOpen" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Assegna Piano {{ planType === 'workout' ? 'di Allenamento' : 'Nutrizionale' }}</h3>
      <form @submit.prevent="handleAssignPlan">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Atleta</span>
          </label>
          <select v-model="selectedAthleteId" class="select select-bordered" required>
            <option disabled selected value="">Seleziona un atleta</option>
            <option v-for="athlete in athletes" :key="athlete.id" :value="athlete.id">
              {{ athlete.name || athlete.username }} <!-- Assuming athlete object has name or username -->
            </option>
          </select>
        </div>
        <div class="form-control w-full max-w-xs mt-4">
          <label class="label">
            <span class="label-text">Data di Inizio</span>
          </label>
          <input type="date" v-model="startDate" class="input input-bordered" required />
        </div>
        <div class="modal-action">
          <button type="submit" class="btn btn-primary" :disabled="isAssigning">
            <span v-if="isAssigning" class="loading loading-spinner loading-xs"></span>
            {{ isAssigning ? 'Assegnazione...' : 'Assegna' }}
          </button>
          <button type="button" class="btn" @click="closeModal" :disabled="isAssigning">Annulla</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCoachStore } from '@/stores/coach';
import { useToast } from 'vue-toastification';

const props = defineProps({
  isOpen: Boolean,
  plan: Object,
  athletes: Array,
  planType: String, // 'workout' or 'nutrition'
});

const emit = defineEmits(['close', 'plan-assigned']);

const coachStore = useCoachStore();
const toast = useToast();

const isAssigning = ref(false); // New ref for loading state

const selectedAthleteId = ref('');
const startDate = ref('');

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    selectedAthleteId.value = '';
    startDate.value = '';
  }
});

const closeModal = () => {
  emit('close');
};

const handleAssignPlan = async () => {
  if (!selectedAthleteId.value || !startDate.value) {
    toast.error('Per favore, seleziona un atleta e una data di inizio.');
    return;
  }

  isAssigning.value = true; // Set loading state

  const assignmentData = {
    user_id: selectedAthleteId.value,
    start_date: startDate.value,
  };

  if (props.planType === 'workout') {
    assignmentData.plan_id = props.plan.id;
  } else if (props.planType === 'nutrition') {
    assignmentData.nutrition_plan_id = props.plan.id;
  }

  try {
    if (props.planType === 'workout') {
      await coachStore.assignWorkoutPlan(assignmentData);
      toast.success(`Piano di Allenamento "${props.plan.name}" assegnato con successo!`);
    } else if (props.planType === 'nutrition') {
      await coachStore.assignNutritionPlan(assignmentData);
      toast.success(`Piano Nutrizionale "${props.plan.name}" assegnato con successo!`);
    }
    emit('plan-assigned');
    closeModal();
  } catch (error) {
    toast.error(error.message || 'Errore durante l'assegnazione del piano.');
    console.error('Failed to assign plan:', error);
  } finally {
    isAssigning.value = false; // Reset loading state
  }
};
</script>

<style scoped>
/* Styles for the modal if needed, DaisyUI classes are used primarily */
</style>
