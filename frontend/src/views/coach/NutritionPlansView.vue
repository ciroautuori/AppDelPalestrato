<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Piani Nutrizionali</h1>

    <div class="mb-4 flex justify-end">
      <button
        @click="openCreateModal"
        class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Crea Nuovo Piano
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 dark:text-gray-400">
      Caricamento...
    </div>

    <div v-else>
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
