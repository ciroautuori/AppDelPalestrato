<template>
  <table class="table w-full">
    <thead>
      <tr class="text-gray-400">
        <th>Nome</th>
        <th class="hidden md:table-cell">Descrizione</th>
        <th class="text-right">Azioni</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="plans.length === 0" class="text-center">
        <td colspan="3" class="py-4">Nessun piano nutrizionale trovato.</td>
      </tr>
      <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-700">
        <td>{{ plan.name }}</td>
        <td class="hidden md:table-cell">{{ plan.description }}</td>
        <td class="text-right">
          <div class="flex flex-col sm:flex-row gap-2 justify-end">
            <button
              @click="$emit('edit-plan', plan)"
              class="btn btn-xs btn-warning w-full sm:w-auto"
            >
              Modifica
            </button>
            <button
              @click="$emit('delete-plan', plan)"
              class="btn btn-xs btn-error w-full sm:w-auto"
            >
              Elimina
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
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
