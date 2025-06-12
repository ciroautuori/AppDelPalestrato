<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">I Miei Piani</h1>
      <button class="btn btn-primary" @click="openCreatePlanModal">
        <i class="fas fa-plus mr-2"></i>
        Crea Nuovo Piano
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="coachStore.plansLoading" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="coachStore.plansError" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ coachStore.plansError }}</span>
    </div>

    <!-- Plans List -->
    <div v-else-if="myPlans.length > 0">
      <PlansTable
        :plans="myPlans"
        @view-details="viewPlanDetails"
        @edit-plan="openEditPlanModal"
        @delete-plan="confirmDeletePlan"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <p class="text-lg text-gray-500">
        Non hai ancora creato nessun piano. Clicca 'Crea Nuovo Piano' per iniziare.
      </p>
    </div>

    <!-- Plan Form Modal -->
    <PlanFormModal
      :show="showPlanModal"
      :plan-to-edit="planToEdit"
      :is-submitting="isSubmittingForm"
      @close="closePlanModal"
      @save="handlePlanSave"
    />

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_plan_modal" class="modal" :class="{ 'modal-open': showDeleteModal }">
      <div class="modal-box bg-gray-800">
        <h3 class="font-bold text-lg">Conferma Eliminazione</h3>
        <p class="py-4">Sei sicuro di voler eliminare il piano "{{ planToDelete?.name }}"?</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeDeleteModal" :disabled="isDeleting">Annulla</button>
          <button
            class="btn btn-error"
            @click="executeDeletePlan"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="loading loading-spinner loading-sm"></span>
            Elimina
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeDeleteModal">close</button>
      </form>
    </dialog>
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCoachStore } from '@/store/coach';
import { useToastStore } from '@/store/toast';
import PlansTable from '@/components/coach/PlansTable.vue';
import PlanFormModal from '@/components/coach/PlanFormModal.vue';
import Toast from '@/components/Toast.vue'; // Assicurati che Toast sia importato se non è globale

const coachStore = useCoachStore();
const toastStore = useToastStore();

const myPlans = computed(() => coachStore.myPlans);

const showPlanModal = ref(false);
const planToEdit = ref(null);
const isSubmittingForm = ref(false); // Per il modale del form

const showDeleteModal = ref(false);
const planToDelete = ref(null);
const isDeleting = ref(false); // Per il modale di eliminazione

const openCreatePlanModal = () => {
  planToEdit.value = null;
  showPlanModal.value = true;
};

const openEditPlanModal = (plan) => {
  planToEdit.value = { ...plan }; // Pass a copy to avoid direct mutation if plan is reactive from store
  showPlanModal.value = true;
};

const closePlanModal = () => {
  showPlanModal.value = false;
  planToEdit.value = null;
};

const handlePlanSave = async (planData) => {
  isSubmittingForm.value = true;
  try {
    if (planToEdit.value && planToEdit.value.id) {
      await coachStore.updatePlan(planToEdit.value.id, planData);
      toastStore.showToast('Piano aggiornato con successo!', 'success');
    } else {
      await coachStore.createPlan(planData);
      toastStore.showToast('Piano creato con successo!', 'success');
    }
    closePlanModal();
    // Non è necessario chiamare fetchMyPlans manualmente se lo store lo fa già dopo create/update
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Errore durante il salvataggio del piano.';
    toastStore.showToast(message, 'error');
  } finally {
    isSubmittingForm.value = false;
  }
};

const confirmDeletePlan = (plan) => {
  planToDelete.value = plan;
  showDeleteModal.value = true;
  // Per DaisyUI modale, se si usa <dialog> e JS per controllarlo:
  // const modal = document.getElementById('delete_plan_modal');
  // if (modal) modal.showModal();
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  planToDelete.value = null;
  // const modal = document.getElementById('delete_plan_modal');
  // if (modal) modal.close();
};

const executeDeletePlan = async () => {
  if (!planToDelete.value || !planToDelete.value.id) return;

  isDeleting.value = true;
  try {
    await coachStore.deletePlan(planToDelete.value.id);
    toastStore.showToast('Piano eliminato con successo!', 'success');
    closeDeleteModal();
    // Non è necessario chiamare fetchMyPlans manualmente se lo store lo fa già dopo delete
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Errore durante l'eliminazione del piano.';
    toastStore.showToast(message, 'error');
  } finally {
    isDeleting.value = false;
  }
};

const viewPlanDetails = (plan) => {
  // TODO: Implementare la logica per visualizzare i dettagli del piano.
  // Potrebbe essere una navigazione a una nuova vista o un altro modale.
  console.log('View plan details:', plan);
  toastStore.showToast(`Dettagli per piano: ${plan.name} (ID: ${plan.id}) - Implementazione richiesta.`, 'info');
};

onMounted(async () => {
  // Il toast per errore fetch è già gestito nello store coach.js, ma possiamo aggiungerne uno qui se necessario
  // o affidarci a quello dello store.
  // Per ora, presumo che lo store gestisca la notifica di errore fetch iniziale.
  if (!coachStore.myPlans || coachStore.myPlans.length === 0) {
      try {
        await coachStore.fetchMyPlans();
      } catch (error) {
        // Lo store coach.js dovrebbe già gestire l'errore e impostare plansError
        // Se si vuole mostrare un toast anche qui in aggiunta:
        // const message = error.response?.data?.detail || 'Errore nel caricamento iniziale dei piani.';
        // toastStore.showToast(message, 'error');
        console.error("Failed to fetch plans on mount:", error);
      }
  }
});
</script>

<style scoped>
/* Stili specifici per MyPlansView, se necessari */
.container {
  max-width: 1200px; /* Esempio di larghezza massima */
}
.btn-primary {
  /* Assicurati che i colori siano allineati con DaisyUI o temi personalizzati */
}
.modal-box {
  /* Sovrascrivi o aggiungi stili al modal-box di DaisyUI se necessario */
}

/* Stile per l'icona nel bottone "Crea Nuovo Piano", se non si usa una libreria di icone CSS */
.btn-primary i.fas.fa-plus {
  /* Esempio se si usa FontAwesome via CSS. Se si usa SVG inline, non è necessario */
}
</style>
