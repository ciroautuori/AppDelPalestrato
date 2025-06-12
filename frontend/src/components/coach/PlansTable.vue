<template>
  <div class="overflow-x-auto bg-gray-800 rounded-lg shadow">
    <table class="table w-full">
      <thead>
        <tr class="text-gray-400">
          <th>ID</th>
          <th>Nome</th>
          <th>Descrizione</th>
          <th class="text-right">Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!plans || plans.length === 0">
          <td colspan="4" class="text-center py-4">Nessun piano trovato.</td>
        </tr>
        <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-700">
          <td>{{ plan.id }}</td>
          <td>{{ plan.name }}</td>
          <td>{{ plan.description }}</td>
          <td class="text-right">
            <div class="flex flex-col sm:flex-row gap-2 justify-end">
              <button @click="$emit('view-details', plan)" class="btn btn-xs btn-info w-full sm:w-auto">Dettagli</button>
              <button @click="$emit('edit-plan', plan)" class="btn btn-xs btn-warning w-full sm:w-auto">Modifica</button>
              <button @click="$emit('delete-plan', plan)" class="btn btn-xs btn-error w-full sm:w-auto">Elimina</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  plans: {
    type: Array,
    required: true,
    default: () => []
  }
});

defineEmits(['view-details', 'edit-plan', 'delete-plan']);
</script>

<style scoped>
.table th,
.table td {
  white-space: nowrap; /* Prevent text wrapping in table cells */
  padding: 0.75rem; /* Standard padding */
}
.btn-xs {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
