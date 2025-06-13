<template>
  <div class="container mx-auto p-4">
    <div class="mb-6">
      <button class="btn btn-ghost" @click="router.back()">
        <i class="fas fa-arrow-left mr-2"></i> Back
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <!-- Plan Details -->
    <div v-else-if="plan" class="space-y-6">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h1 class="text-3xl font-bold mb-2">{{ plan.name }}</h1>
          <p class="text-lg text-gray-600">{{ plan.description }}</p>
          
          <!-- Nutrition Summary -->
          <div class="stats shadow mt-4">
            <div class="stat">
              <div class="stat-title">Total Calories</div>
              <div class="stat-value">{{ plan.total_calories }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Protein</div>
              <div class="stat-value">{{ plan.total_protein }}g</div>
            </div>
            <div class="stat">
              <div class="stat-title">Carbs</div>
              <div class="stat-value">{{ plan.total_carbs }}g</div>
            </div>
            <div class="stat">
              <div class="stat-title">Fats</div>
              <div class="stat-value">{{ plan.total_fats }}g</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Meals List -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold">Meals</h2>
        <div v-for="meal in plan.meals" :key="meal.id" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-semibold">{{ meal.name }}</h3>
              <span class="badge badge-primary">{{ meal.time }}</span>
            </div>

            <!-- Food Items -->
            <div class="space-y-2">
              <div v-for="item in meal.food_items" :key="item.id" class="flex justify-between items-center p-2 bg-base-200 rounded">
                <div>
                  <span class="font-medium">{{ item.name }}</span>
                  <span class="text-sm text-gray-600 ml-2">{{ item.quantity }}</span>
                </div>
                <div class="text-sm">
                  <span class="mr-2">{{ item.calories }} cal</span>
                  <span class="mr-2">P: {{ item.protein }}g</span>
                  <span class="mr-2">C: {{ item.carbs }}g</span>
                  <span>F: {{ item.fats }}g</span>
                </div>
              </div>
            </div>

            <!-- Meal Summary -->
            <div class="stats shadow mt-4">
              <div class="stat">
                <div class="stat-title">Total Calories</div>
                <div class="stat-value">{{ meal.total_calories }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">Protein</div>
                <div class="stat-value">{{ meal.total_protein }}g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { nutritionService } from '@/services/nutritionService';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const plan = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await nutritionService.getNutritionPlanById(route.params.id);
    plan.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.detail || 'Error loading nutrition plan';
    useToast().error(error.value);
  } finally {
    isLoading.value = false;
  }
});
</script> 