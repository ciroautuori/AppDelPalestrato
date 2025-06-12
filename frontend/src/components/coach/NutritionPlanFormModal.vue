<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full p-4 modal-bottom sm:modal-middle">
    <div class="bg-gray-800 p-4 md:p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl md:text-2xl font-bold mb-6 text-yellow-500">{{ modalTitle }}</h2>
      <form @submit.prevent="handleSubmit">
        <ul class="steps w-full mb-6">
          <li class="step" :class="{ 'step-primary': currentStep >= 1 }">Dati Piano</li>
          <li class="step" :class="{ 'step-primary': currentStep >= 2 }">Pasti</li>
          <li class="step" :class="{ 'step-primary': currentStep >= 3 }">Alimenti</li>
        </ul>
        <div v-if="currentStep === 1">
          <!-- Basic Info Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div class="form-control">
              <label for="planName" class="label">
                <span class="label-text text-gray-300">Nome Piano</span>
            </label>
            <input
              type="text"
              id="planName"
              v-model="form.name"
              required
              class="input input-bordered w-full bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div class="form-control">
            <label for="planDescription" class="label">
              <span class="label-text text-gray-300">Descrizione</span>
            </label>
            <textarea
              id="planDescription"
              v-model="form.description"
              rows="3"
              required
              class="textarea textarea-bordered w-full bg-gray-700 text-white border-gray-600"
            ></textarea>
          </div>
        </div>
        </div>
        <!-- Step 1 Navigation -->
        <div v-if="currentStep === 1" class="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            @click="close"
            class="btn btn-outline w-full sm:w-auto"
          >
            Annulla
          </button>
          <button
            type="button"
            @click="currentStep = 2"
            class="btn btn-warning w-full sm:w-auto"
          >
            Avanti
          </button>
        </div>

        <div v-if="currentStep === 2">
          <div class="divider text-gray-400">Pasti</div>

          <!-- Meals Section -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h3 class="text-lg font-semibold text-gray-300">Lista Pasti</h3>
            <button
              type="button"
              @click="addMeal"
              class="btn btn-outline btn-sm btn-warning w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Aggiungi Pasto
            </button>
          </div>

          <div v-if="form.meals.length === 0" class="text-sm text-gray-400 mb-4">
            Nessun pasto aggiunto. Clicca "Aggiungi Pasto" per iniziare.
          </div>

          <div v-for="(meal) in form.meals" :key="meal.id" class="card bg-gray-700 shadow-xl">
            <div class="card-body p-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                <input
                  type="text"
                  v-model="meal.name"
                  placeholder="Nome del pasto (es. Colazione)"
                  required
                  class="input input-bordered w-full bg-gray-600 text-white border-gray-500"
                />
                <button
                  type="button"
                  @click="removeMeal(meal.id)"
                  class="btn btn-outline btn-sm btn-error w-full sm:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Rimuovi Pasto
                </button>
              </div>
              <!-- Food items section removed from Step 2 -->
            </div>
          </div>
        </div>
        <!-- Step 2 Navigation -->
        <div v-if="currentStep === 2" class="flex justify-between space-x-4 mt-8">
          <button
            type="button"
            @click="currentStep = 1"
            class="btn btn-outline w-full sm:w-auto"
          >
            Indietro
          </button>
          <button
            type="button"
            @click="currentStep = 3"
            class="btn btn-warning w-full sm:w-auto"
          >
            Avanti
          </button>
        </div>
        </div> <!-- Closing v-if currentStep === 2 -->

        <div v-if="currentStep === 3">
          <!-- Full Meal Cards for Step 3 -->
          <div class="divider text-gray-400">Alimenti per Pasto</div>
          <div v-if="form.meals.length === 0" class="text-sm text-gray-400 my-4 text-center">
            Nessun pasto definito. Torna allo Step 2 per aggiungere pasti.
          </div>
          <div v-for="(meal) in form.meals" :key="`step3-meal-${meal.id}`" class="card bg-gray-700 shadow-xl mb-6">
            <div class="card-body p-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                <input
                  type="text"
                  v-model="meal.name"
                  placeholder="Nome del pasto (es. Colazione)"
                  required
                  class="input input-bordered w-full bg-gray-600 text-white border-gray-500"
                />
                <!-- Optional: Remove meal button can be kept or removed from step 3 -->
                 <button
                  type="button"
                  @click="removeMeal(meal.id)"
                  class="btn btn-outline btn-xs btn-error sm:w-auto"
                  title="Rimuovi intero pasto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <span class="hidden sm:inline">Rimuovi Pasto</span>
                </button>
              </div>

              <div class="divider text-gray-400 my-2">Alimenti</div>

              <div class="space-y-3">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                  <h4 class="text-md font-semibold text-gray-300">Alimenti per {{ meal.name || 'questo pasto' }}</h4>
                  <button
                    type="button"
                    @click="addFoodItem(meal)"
                    class="btn btn-outline btn-sm btn-success w-full sm:w-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    Aggiungi Alimento
                  </button>
                </div>

                <div v-if="!meal.foodItems || meal.foodItems.length === 0" class="text-xs text-gray-400 mb-3">
                  Nessun alimento aggiunto a questo pasto.
                </div>

                <div v-for="(foodItem) in meal.foodItems" :key="`step3-food-${foodItem.id}`" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-2 items-center bg-gray-600 p-2 rounded-lg">
                  <div class="lg:col-span-2">
                    <input
                      type="text"
                      v-model="foodItem.name"
                      placeholder="Nome alimento"
                      class="input input-bordered w-full bg-gray-700 text-white border-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      v-model="foodItem.quantity"
                      placeholder="Qtà"
                      class="input input-bordered w-full bg-gray-700 text-white border-gray-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      v-model.number="foodItem.calories"
                      placeholder="Cal"
                      class="input input-bordered w-full bg-gray-700 text-white border-gray-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      v-model.number="foodItem.protein"
                      placeholder="Pro (g)"
                      class="input input-bordered w-full bg-gray-700 text-white border-gray-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      v-model.number="foodItem.carbs"
                      placeholder="Carb (g)"
                      class="input input-bordered w-full bg-gray-700 text-white border-gray-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      v-model.number="foodItem.fats"
                      placeholder="Fat (g)"
                      class="input input-bordered w-full bg-gray-700 text-white border-gray-500"
                    />
                  </div>
                  <div class="flex items-center justify-end">
                    <button
                      type="button"
                      @click="removeFoodItem(meal, foodItem.id)"
                      class="btn btn-ghost btn-sm text-error"
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
        </div>
        <!-- Step 3 Navigation -->
        <div v-if="currentStep === 3" class="flex justify-between space-x-4 mt-8">
          <button
            type="button"
            @click="currentStep = 2"
            class="btn btn-outline w-full sm:w-auto"
          >
            Indietro
          </button>
          <button
            type="submit"
            class="btn btn-warning w-full sm:w-auto"
          >
            {{ submitButtonText }}
          </button>
        </div>

        <div class="divider"></div>

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

const currentStep = ref(1);

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
