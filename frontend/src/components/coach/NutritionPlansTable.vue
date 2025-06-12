<template>
  <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th scope="col" class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Nome
          </th>
          <th scope="col" class="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Descrizione
          </th>
          <th scope="col" class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Azioni
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="plans.length === 0">
          <td colspan="3" class="px-4 md:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Nessun piano nutrizionale trovato.
          </td>
        </tr>
        <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-100 dark:hover:bg-gray-600">
          <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
            {{ plan.name }}
          </td>
          <td class="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
            {{ plan.description }}
          </td>
          <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-2">
              <button @click="$emit('edit-plan', plan)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Modifica</button>
              <button @click="$emit('delete-plan', plan.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Elimina</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  plans: {
    type: Array,
    required: true,
  },
});

defineEmits(['edit-plan', 'delete-plan']);
</script>
