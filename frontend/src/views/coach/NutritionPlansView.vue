<template>
  <div class="p-4 md:p-6 lg:p-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">Piani Nutrizionali</h1>
      <button
        @click="openCreateModal"
        class="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Crea Nuovo Piano
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <NutritionPlansTable
          :plans="nutritionPlans"
          @edit-plan="openEditModal"
          @delete-plan="handleDeletePlan"
        />
      </div>
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
