<template>
  <div class="p-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-yellow-500">Piani Nutrizionali</h1>
      <button
        @click="openCreateModal"
        class="btn btn-warning w-full sm:w-auto"
        :disabled="isLoading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Crea Nuovo Piano
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="loading loading-spinner loading-lg text-warning"></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="alert alert-error mb-4">
      <span>{{ error }}</span>
    </div>

    <!-- Content -->
    <div v-else class="overflow-x-auto bg-gray-800 rounded-lg shadow">
      <NutritionPlansTable
        :plans="nutritionPlans"
        @edit-plan="openEditModal"
        @delete-plan="handleDeletePlan"
      />
    </div>

    <NutritionPlanFormModal
      :visible="isModalOpen"
      :plan-to-edit="planToEdit"
      @submit-form="handleFormSubmit"
      @close-modal="closeModal"
    />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useNutritionStore } from '@/store/nutrition';
import NutritionPlansTable from '@/components/coach/NutritionPlansTable.vue';
import NutritionPlanFormModal from '@/components/coach/NutritionPlanFormModal.vue';

const nutritionStore = useNutritionStore();

const nutritionPlans = computed(() => nutritionStore.nutritionPlans);
const isLoading = computed(() => nutritionStore.isLoading);
const error = computed(() => nutritionStore.error);

const isModalOpen = ref(false);
const planToEdit = ref(null);

const openCreateModal = () => {
  planToEdit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (plan) => {
  planToEdit.value = { ...plan };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  planToEdit.value = null;
};

const handleFormSubmit = async (planData) => {
  if (planData.id) {
    await nutritionStore.updateNutritionPlan(planData.id, planData);
  } else {
    await nutritionStore.createNutritionPlan(planData);
  }
  closeModal();
};

const handleDeletePlan = async (planId) => {
  if (confirm('Sei sicuro di voler eliminare questo piano?')) {
    await nutritionStore.deleteNutritionPlan(planId);
  }
};

onMounted(() => {
  nutritionStore.fetchNutritionPlans();
});
</script>
