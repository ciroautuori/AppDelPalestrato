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
        @view-plan="viewPlan"
        @edit-plan="openEditPlanModal"
        @delete-plan="confirmDeletePlan"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <p class="text-lg text-gray-600">
        Non hai ancora creato nessun piano. Clicca 'Crea Nuovo Piano' per iniziare.
      </p>
    </div>

    <!-- Plan Form Modal -->
    <PlanFormModal
      :show="showPlanModal"
      :plan-to-edit="planToEdit"
      :is-submitting="isSubmitting"
      @close="closePlanModal"
      @save="handlePlanSave"
    />

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_plan_modal" class="modal" :class="{ 'modal-open': showDeleteModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Conferma Eliminazione</h3>
        <p class="py-4">Sei sicuro di voler eliminare il piano "{{ planToDelete?.name }}"?</p>
        <div class="modal-action">
          <button class="btn" @click="showDeleteModal = false">Annulla</button>
          <button 
            class="btn btn-error" 
            @click="deletePlan"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
            Elimina
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showDeleteModal = false">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCoachStore } from '@/store/coach';
import { useToastStore } from '@/store/toast';
import PlansTable from '@/components/coach/PlansTable.vue';
import PlanFormModal from '@/components/coach/PlanFormModal.vue';

const coachStore = useCoachStore();
const toastStore = useToastStore();

// Computed properties
const myPlans = computed(() => coachStore.myPlans);

// State
const showPlanModal = ref(false);
const showDeleteModal = ref(false);
const planToEdit = ref(null);
const planToDelete = ref(null);
const isSubmitting = ref(false);

// Methods
const openCreatePlanModal = () => {
  planToEdit.value = null;
  showPlanModal.value = true;
};

const openEditPlanModal = (plan) => {
  planToEdit.value = plan;
  showPlanModal.value = true;
};

const closePlanModal = () => {
  showPlanModal.value = false;
  planToEdit.value = null;
};

const handlePlanSave = async (planData) => {
  isSubmitting.value = true;
  try {
    if (planToEdit.value) {
      await coachStore.updatePlan(planToEdit.value.id, planData);
      toastStore.showToast('Piano aggiornato con successo', 'success');
    } else {
      await coachStore.createPlan(planData);
      toastStore.showToast('Piano creato con successo', 'success');
    }
    closePlanModal();
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.detail || 'Errore durante il salvataggio del piano',
      'error'
    );
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDeletePlan = (plan) => {
  planToDelete.value = plan;
  showDeleteModal.value = true;
};

const deletePlan = async () => {
  if (!planToDelete.value) return;
  
  isSubmitting.value = true;
  try {
    await coachStore.deletePlan(planToDelete.value.id);
    showDeleteModal.value = false;
    planToDelete.value = null;
    toastStore.showToast('Piano eliminato con successo', 'success');
  } catch (error) {
    toastStore.showToast(
      error.response?.data?.detail || 'Errore durante l\'eliminazione del piano',
      'error'
    );
  } finally {
    isSubmitting.value = false;
  }
};

const viewPlan = (plan) => {
  // TODO: Implement view plan details
  console.log('View plan:', plan);
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await coachStore.fetchMyPlans();
  } catch (error) {
    toastStore.showToast('Errore nel caricamento dei piani', 'error');
  }
});
</script>
