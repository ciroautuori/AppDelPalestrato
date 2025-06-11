<template>
  <div class="p-4 md:p-8 min-h-screen bg-base-200 text-base-content">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 class="text-3xl md:text-4xl font-bold text-primary mb-4 md:mb-0">I Miei Piani di Allenamento</h1>
      <button @click="openCreatePlanModal()" class="btn btn-warning btn-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Crea Nuovo Piano
      </button>
    </div>

    <div v-if="authStore.user && authStore.user.pk">
      <div v-if="planStore.isLoading && !isSubmittingPlan && !isAssigningPlan" class="flex justify-center items-center py-10">
        <span class="loading loading-spinner loading-lg text-warning"></span>
        <p class="ml-4 text-lg">Caricamento piani...</p>
      </div>

      <div v-else-if="planStore.error && !showPlanModal && !showAssignModal" class="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Errore nel caricamento dei piani: {{ planStore.error }}</span>
        </div>
      </div>

      <div v-else-if="coachAthleteManagementStore.errorAthletes && showAssignModal" class="alert alert-warning shadow-lg mb-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>Attenzione: {{ coachAthleteManagementStore.errorAthletes }}. La lista atleti potrebbe non essere completa.</span>
        </div>
      </div>

      <div v-else-if="planStore.plans.length === 0 && !planStore.isLoading" class="text-center py-10">
        <p class="text-xl">Nessun piano di allenamento trovato. Inizia creando il tuo primo piano!</p>
      </div>

      <div v-else>
        <div class="overflow-x-auto bg-neutral text-neutral-content shadow-md rounded-lg">
          <table class="table w-full">
            <thead class="bg-base-300">
              <tr>
                <th class="text-warning">Nome Piano</th>
                <th class="text-warning">Difficoltà</th>
                <th class="text-warning">Durata</th>
                <th class="text-warning">Num. Esercizi</th>
                <th class="text-warning">Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in planStore.plans" :key="plan.id" class="hover:bg-base-100/50">
                <td>{{ plan.name }}</td>
                <td>{{ plan.difficulty_level || 'N/A' }}</td>
                <td>{{ plan.duration_weeks ? `${plan.duration_weeks} sett.` : 'N/A' }}</td>
                <td>{{ plan.exercises ? plan.exercises.length : 'N/A' }}</td>
                <td class="space-x-1 whitespace-nowrap">
                  <button @click="openEditPlanModal(plan)" class="btn btn-xs btn-outline btn-info" :disabled="isSubmittingPlan || isAssigningPlan">Modifica</button>
                  <button
                    @click="handleDeletePlan(plan.id)"
                    :disabled="isSubmittingPlan || isAssigningPlan"
                    class="btn btn-xs btn-outline btn-error">
                      <span v-if="isSubmittingPlan && currentPlan && currentPlan.id === plan.id" class="loading loading-spinner loading-xs"></span>
                      Elimina
                  </button>
                  <button @click="openAssignPlanModal(plan)" class="btn btn-xs btn-outline btn-success" :disabled="isSubmittingPlan || isAssigningPlan">Assegna</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center items-center mt-8 space-x-2" v-if="planStore.pagination.totalPages > 1">
          <button
            @click="changePage(planStore.pagination.currentPage - 1)"
            :disabled="planStore.pagination.currentPage <= 1 || isSubmittingPlan || isAssigningPlan"
            class="btn btn-sm btn-outline btn-warning">
            Precedente
          </button>
          <span class="text-sm">
            Pagina {{ planStore.pagination.currentPage }} di {{ planStore.pagination.totalPages }}
          </span>
          <button
            @click="changePage(planStore.pagination.currentPage + 1)"
            :disabled="planStore.pagination.currentPage >= planStore.pagination.totalPages || isSubmittingPlan || isAssigningPlan"
            class="btn btn-sm btn-outline btn-warning">
            Successivo
          </button>
        </div>
      </div>
    </div>
     <div v-else class="alert alert-info">
      <p>Effettua il login come coach per visualizzare e gestire i tuoi piani.</p>
    </div>

    <!-- Plan Form Modal (Create/Edit) -->
    <dialog id="plan_form_modal" class="modal modal-bottom sm:modal-middle" :open="showPlanModal">
      <div class="modal-box w-11/12 max-w-4xl bg-base-100 text-base-content">
        <form method="dialog">
          <button @click="closePlanModal()" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
        </form>
        <h3 class="font-bold text-lg text-warning mb-4">
          {{ currentPlan && currentPlan.id ? 'Modifica Piano Esistente' : 'Crea Nuovo Piano' }}
        </h3>
        <div class="py-4">
          <PlanForm
            :initialPlanData="currentPlan"
            :isLoadingSubmit="isSubmittingPlan"
            @submit-plan="handlePlanSubmit"
            @cancel="closePlanModal"
          />
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closePlanModal()">close</button>
      </form>
    </dialog>

    <!-- Assign Plan Modal -->
    <AssignPlanModal
      :showModal="showAssignModal"
      :plans="[planToAssign].filter(Boolean)"
      :athletes="coachAthleteManagementStore.athletes"
      :isLoadingAssign="isAssigningPlan"
      @assign-plan="handleAssignPlanAttempt"
      @close-modal="closeAssignModal"
    />

  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { usePlanManagementStore } from '@/store/planManagement';
import { useAuthStore } from '@/store/auth';
import { useCoachAthleteManagementStore } from '@/store/coachAthleteManagement'; // Added
import { assignPlan as assignPlanService } from '@/services/assignmentService'; // Added
import PlanForm from '@/components/plans/PlanForm.vue';
import AssignPlanModal from '@/components/plans/AssignPlanModal.vue'; // Added

const planStore = usePlanManagementStore();
const authStore = useAuthStore();
const coachAthleteManagementStore = useCoachAthleteManagementStore(); // Added

const coachId = computed(() => authStore.user?.pk);

// State for PlanForm Modal
const showPlanModal = ref(false);
const currentPlan = ref(null); // For editing
const isSubmittingPlan = ref(false); // For PlanForm loading state

// State for AssignPlanModal
const showAssignModal = ref(false); // Added
const planToAssign = ref(null); // Added - holds the specific plan to be assigned
const isAssigningPlan = ref(false); // Added

onMounted(async () => {
  if (coachId.value) {
    await planStore.fetchCoachPlans(coachId.value, { page: 1, perPage: 10 });
    // Fetch athletes needed for assignment modal, can be deferred until modal opens if preferred
    if (coachAthleteManagementStore.athletes.length === 0) {
        await coachAthleteManagementStore.fetchCoachAthletes(coachId.value, { page: 1, perPage: 1000 }); // Fetch all for now
    }
  }
});

const changePage = (page) => {
  if (page > 0 && page <= planStore.pagination.totalPages && coachId.value) {
    planStore.fetchCoachPlans(coachId.value, { page: page, perPage: planStore.pagination.perPage });
  }
};

// --- PlanForm Modal Logic ---
const openCreatePlanModal = () => {
  currentPlan.value = null;
  showPlanModal.value = true;
};

const openEditPlanModal = (plan) => {
  const planCopy = JSON.parse(JSON.stringify(plan));
  if (planCopy.exercises && Array.isArray(planCopy.exercises)) {
    planCopy.exercise_details = planCopy.exercises.map(ex => ({
      id: ex.id,
      exercise_id: ex.exercise?.id || ex.exercise,
      sets: ex.sets,
      reps: ex.reps,
      rest_time: ex.rest_time,
      order: ex.order,
    }));
  } else {
    planCopy.exercise_details = [];
  }
  currentPlan.value = planCopy;
  showPlanModal.value = true;
};

const closePlanModal = () => {
  showPlanModal.value = false;
  currentPlan.value = null;
  planStore.error = null;
};

const handlePlanSubmit = async (planData) => {
  if (!coachId.value) {
    alert('Errore: ID Coach non disponibile.');
    return;
  }
  isSubmittingPlan.value = true;
  planStore.error = null;
  try {
    if (currentPlan.value && currentPlan.value.id) {
      await planStore.editPlan(currentPlan.value.id, planData, coachId.value);
      alert('Piano aggiornato con successo!');
    } else {
      await planStore.addPlan(planData, coachId.value);
      alert('Piano creato con successo!');
    }
    closePlanModal();
  } catch (error) {
    alert(`Errore durante il salvataggio del piano: ${planStore.error || 'Si è verificato un errore imprevisto.'}`);
  } finally {
    isSubmittingPlan.value = false;
  }
};

const handleDeletePlan = async (planId) => {
  if (!coachId.value) {
    alert('Impossibile eliminare il piano: ID coach non trovato.');
    return;
  }
  const confirmed = window.confirm('Sei sicuro di voler eliminare questo piano? L\'azione è irreversibile.');
  if (confirmed) {
    isSubmittingPlan.value = true; // Using general submitting flag
    planStore.error = null;
    try {
      await planStore.removePlan(planId, coachId.value);
      alert('Piano eliminato con successo!');
      if (planStore.plans.length === 0 && planStore.pagination.currentPage > 1) {
        changePage(planStore.pagination.currentPage - 1);
      }
    } catch (error) {
      alert(`Errore durante l'eliminazione del piano: ${planStore.error || 'Si è verificato un errore imprevisto.'}`);
    } finally {
      isSubmittingPlan.value = false;
    }
  }
};

// --- AssignPlan Modal Logic ---
const openAssignPlanModal = async (plan) => {
  planToAssign.value = plan; // Set the specific plan to be assigned
  // Ensure athletes are loaded if not already
  if (coachId.value && coachAthleteManagementStore.athletes.length === 0 && !coachAthleteManagementStore.isLoadingAthletes) {
    try {
        await coachAthleteManagementStore.fetchCoachAthletes(coachId.value, { page: 1, perPage: 1000 }); // fetch all athletes for selection
    } catch(err) {
        // Error is handled in store and will be shown by errorAthletes state
        console.error("Failed to fetch athletes for assignment modal:", err);
    }
  }
  showAssignModal.value = true;
};

const closeAssignModal = () => {
  showAssignModal.value = false;
  planToAssign.value = null; // Clear the plan to assign
  // coachAthleteManagementStore.errorAthletes = null; // Optionally clear athlete error
};

const handleAssignPlanAttempt = async (assignmentData) => {
  isAssigningPlan.value = true;
  try {
    await assignPlanService(assignmentData); // Using imported service directly
    alert('Piano assegnato con successo!'); // Replace with a toast notification
    closeAssignModal();
  } catch (error) {
    // Assuming assignPlanService throws an error with a message or response data
    const errorMessage = error.response?.data?.detail || error.message || 'Errore sconosciuto durante l\'assegnazione.';
    alert(`Errore durante l'assegnazione del piano: ${errorMessage}`); // Replace with a toast
    // Optionally, set an error in a local ref or a store if you want to display it within the modal
  } finally {
    isAssigningPlan.value = false;
  }
};

</script>

<style scoped>
.table th.text-warning {
   color: hsl(var(--wa));
}
.table th {
  background-color: hsl(var(--n));
  color: hsl(var(--nc));
}
.hover\:bg-base-100\/50:hover {
    --tw-bg-opacity: 0.5;
    background-color: hsl(var(--b1) / var(--tw-bg-opacity));
}

/* Modal styles */
.modal-box {
  /* Default DaisyUI modal-box is fine, customize if needed */
}
</style>
