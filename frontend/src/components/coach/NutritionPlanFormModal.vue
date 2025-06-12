<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
    <div class="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl md:text-2xl font-bold mb-6 text-gray-800 dark:text-white">{{ modalTitle }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <label for="planName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Piano</label>
            <input
              type="text"
              id="planName"
              v-model="form.name"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="planDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrizione</label>
            <textarea
              id="planDescription"
              v-model="form.description"
              rows="3"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
        </div>

        <hr class="my-6 border-gray-200 dark:border-gray-600">

        <div>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 class="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">Pasti</h3>
            <button
              type="button"
              @click="addMeal"
              class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aggiungi Pasto
            </button>
          </div>

          <div v-if="form.meals.length === 0" class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Nessun pasto aggiunto. Clicca "Aggiungi Pasto" per iniziare.
          </div>

          <div v-for="(meal) in form.meals" :key="meal.id" class="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
              <input
                type="text"
                v-model="meal.name"
                placeholder="Nome del pasto (es. Colazione)"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                @click="removeMeal(meal.id)"
                class="w-full sm:w-auto px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Rimuovi Pasto
              </button>
            </div>

            <div class="pl-4 mt-4 border-l-2 border-gray-200 dark:border-gray-600">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4">
                <h4 class="text-md font-semibold text-gray-700 dark:text-gray-300">Alimenti per {{ meal.name || 'questo pasto' }}</h4>
                <button
                  type="button"
                  @click="addFoodItem(meal)"
                  class="w-full sm:w-auto px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Aggiungi Alimento
                </button>
              </div>

              <div v-if="!meal.foodItems || meal.foodItems.length === 0" class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Nessun alimento aggiunto a questo pasto.
              </div>

              <div v-for="(foodItem) in meal.foodItems" :key="foodItem.id" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-2 mb-3 items-center">
                <div class="lg:col-span-2">
                  <label :for="`foodName-${meal.id}-${foodItem.id}`" class="sr-only">Nome Alimento</label>
                  <input
                    :id="`foodName-${meal.id}-${foodItem.id}`"
                    type="text"
                    v-model="foodItem.name"
                    placeholder="Nome alimento"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                    required
                  />
                </div>
                <div>
                  <label :for="`foodQty-${meal.id}-${foodItem.id}`" class="sr-only">Quantità</label>
                  <input
                    :id="`foodQty-${meal.id}-${foodItem.id}`"
                    type="text"
                    v-model="foodItem.quantity"
                    placeholder="Qtà"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                  />
                </div>
                <div>
                  <label :for="`foodCal-${meal.id}-${foodItem.id}`" class="sr-only">Calorie</label>
                  <input
                    :id="`foodCal-${meal.id}-${foodItem.id}`"
                    type="number"
                    min="0"
                    v-model.number="foodItem.calories"
                    placeholder="Cal"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                  />
                </div>
                <div>
                  <label :for="`foodPro-${meal.id}-${foodItem.id}`" class="sr-only">Proteine</label>
                  <input
                    :id="`foodPro-${meal.id}-${foodItem.id}`"
                    type="number"
                    min="0"
                    v-model.number="foodItem.protein"
                    placeholder="Pro (g)"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                  />
                </div>
                <div>
                  <label :for="`foodCarb-${meal.id}-${foodItem.id}`" class="sr-only">Carboidrati</label>
                  <input
                    :id="`foodCarb-${meal.id}-${foodItem.id}`"
                    type="number"
                    min="0"
                    v-model.number="foodItem.carbs"
                    placeholder="Carb (g)"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                  />
                </div>
                <div>
                  <label :for="`foodFat-${meal.id}-${foodItem.id}`" class="sr-only">Grassi</label>
                  <input
                    :id="`foodFat-${meal.id}-${foodItem.id}`"
                    type="number"
                    min="0"
                    v-model.number="foodItem.fats"
                    placeholder="Fat (g)"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                  />
                </div>
                <div class="flex items-center justify-end">
                  <button
                    type="button"
                    @click="removeFoodItem(meal, foodItem.id)"
                    class="p-1 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Rimuovi Alimento"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            type="button"
            @click="close"
            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Annulla
          </button>
          <button
            type="submit"
            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            {{ submitButtonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue';

// Props
const props = defineProps({
  planToEdit: {
    type: Object,
    default: null,
  },
  visible: {
    type: Boolean,
    default: false,
  }
});

// Emits
const emit = defineEmits(['submit-form', 'close-modal']);

// Form state
const form = ref({
  id: null,
  name: '',
  description: '',
  meals: [], // Add meals array
});

// Watch for changes in planToEdit to pre-fill the form
watch(() => props.planToEdit, (newVal) => {
  if (newVal) {
    form.value.id = newVal.id;
    form.value.name = newVal.name;
    form.value.description = newVal.description;
    // Deep copy meals to allow local modifications without affecting store until save
    form.value.meals = JSON.parse(JSON.stringify(newVal.meals || []));
  } else {
    form.value.id = null;
    form.value.name = '';
    form.value.description = '';
    form.value.meals = []; // Reset meals
  }
}, { immediate: true, deep: true });

// Computed properties for modal title and button text
const modalTitle = computed(() => {
  return props.planToEdit ? 'Modifica Piano Nutrizionale' : 'Crea Nuovo Piano Nutrizionale';
});

const submitButtonText = computed(() => {
  return props.planToEdit ? 'Salva Modifiche' : 'Crea Piano';
});

// Handle form submission
const handleSubmit = () => {
  if (!form.value.name.trim() || !form.value.description.trim()) {
    // Basic validation: Parent should ideally handle more robust validation feedback
    return;
  }
  emit('submit-form', { ...form.value });
};

// Add Meal
const addMeal = () => {
  form.value.meals.push({
    id: `temp-meal-${Date.now()}`, // Temporary ID for new meals
    name: 'Nuovo Pasto',
    foodItems: [], // Initialize with empty food items
  });
};

// Remove Meal
const removeMeal = (idToRemove) => {
  form.value.meals = form.value.meals.filter(meal => meal.id !== idToRemove);
};

// Add Food Item to a Meal
const addFoodItem = (meal) => {
  if (!meal.foodItems) { // Ensure foodItems array exists
    meal.foodItems = [];
  }
  meal.foodItems.push({
    id: `temp-food-${Date.now()}`, // Temporary ID for new food items
    name: '',
    quantity: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
};

// Remove Food Item from a Meal
const removeFoodItem = (meal, foodItemIdToRemove) => {
  meal.foodItems = meal.foodItems.filter(item => item.id !== foodItemIdToRemove);
};

// Close modal
const close = () => {
  emit('close-modal');
};

</script>
