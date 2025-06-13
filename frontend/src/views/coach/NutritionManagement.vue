<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Nutrition Plans Management</h1>

    <!-- Loading State -->
    <div v-if="coachStore.isLoading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="coachStore.error" class="alert alert-error">
      <span>{{ coachStore.error }}</span>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Create Plan Button -->
      <div class="mb-6">
        <button class="btn btn-primary" @click="openCreatePlanModal">
          Create New Plan
        </button>
      </div>

      <!-- Plans List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="plan in coachStore.nutritionPlans" :key="plan.id" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{{ plan.name }}</h2>
            <p>{{ plan.description }}</p>
            <div class="stats shadow">
              <div class="stat">
                <div class="stat-title">Calories</div>
                <div class="stat-value">{{ plan.total_calories }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">Protein</div>
                <div class="stat-value">{{ plan.total_protein }}g</div>
              </div>
            </div>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-primary" @click="openAssignModal(plan)">
                Assign Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Plan Modal -->
    <dialog id="assign_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Assign Nutrition Plan</h3>
        <form @submit.prevent="handleAssignPlan">
          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">Select Athlete</span>
            </label>
            <select v-model="selectedAthleteId" class="select select-bordered w-full" required>
              <option value="">Choose an athlete</option>
              <option v-for="athlete in coachStore.athletes" :key="athlete.id" :value="athlete.id">
                {{ athlete.email }}
              </option>
            </select>
          </div>

          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">Start Date</span>
            </label>
            <input type="date" v-model="startDate" class="input input-bordered w-full" required />
          </div>

          <div class="modal-action">
            <button type="button" class="btn" @click="closeAssignModal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="coachStore.isLoading">
              {{ coachStore.isLoading ? 'Assigning...' : 'Assign Plan' }}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCoachStore } from '@/stores/coach';

const coachStore = useCoachStore();
const selectedAthleteId = ref('');
const startDate = ref('');
const selectedPlan = ref(null);

onMounted(async () => {
  await coachStore.fetchCoachData();
});

const openAssignModal = (plan) => {
  selectedPlan.value = plan;
  selectedAthleteId.value = '';
  startDate.value = '';
  document.getElementById('assign_modal').showModal();
};

const closeAssignModal = () => {
  document.getElementById('assign_modal').close();
  selectedPlan.value = null;
};

const handleAssignPlan = async () => {
  if (!selectedPlan.value || !selectedAthleteId.value || !startDate.value) return;

  try {
    await coachStore.assignPlan({
      nutrition_plan_id: selectedPlan.value.id,
      athlete_id: selectedAthleteId.value,
      start_date: startDate.value
    });
    closeAssignModal();
  } catch (error) {
    // Error is already handled in the store
    console.error('Error assigning plan:', error);
  }
};
</script> 