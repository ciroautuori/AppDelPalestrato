<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Gestione Piani Nutrizionali</h1>

    <div v-if="coachStore.isLoading" class="text-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="coachStore.error" class="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Errore: {{ coachStore.error }}</span>
      </div>
    </div>

    <div v-else-if="!coachStore.nutritionPlans || coachStore.nutritionPlans.length === 0" class="text-center text-gray-500">
      Nessun piano nutrizionale trovato.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Nome Piano</th>
            <th>Descrizione</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in coachStore.nutritionPlans" :key="plan.id">
            <td>{{ plan.name }}</td>
            <td>{{ plan.description }}</td>
            <td>
              <button class="btn btn-sm btn-primary" @click="openAssignModal(plan)">
                Assegna
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AssignPlanModal
      :is-open="isModalOpen"
      :plan="selectedPlan"
      :athletes="coachStore.athletes"
      plan-type="nutrition"
      @close="closeAssignModal"
      @plan-assigned="handlePlanAssigned"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCoachStore } from '@/stores/coach';
import AssignPlanModal from '@/components/modals/AssignPlanModal.vue';
import { useToast } from 'vue-toastification';

const coachStore = useCoachStore();
const toast = useToast();

const isModalOpen = ref(false);
const selectedPlan = ref(null);

onMounted(() => {
  coachStore.fetchCoachNutritionData();
});

const openAssignModal = (plan) => {
  selectedPlan.value = plan;
  isModalOpen.value = true;
};

const closeAssignModal = () => {
  isModalOpen.value = false;
  selectedPlan.value = null;
};

const handlePlanAssigned = () => {
  // Optionally refresh data or give more specific feedback
  // toast.success('Piano assegnato con successo!'); // Handled in modal for now
  closeAssignModal();
};
</script>
