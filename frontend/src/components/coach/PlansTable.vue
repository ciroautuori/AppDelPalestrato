<template>
  <div class="overflow-x-auto bg-base-100 rounded-lg shadow">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrizione</th>
          <th>Esercizi</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plan in plans" :key="plan.id" class="hover:bg-base-200">
          <td class="font-medium">{{ plan.name }}</td>
          <td>{{ plan.description || 'Nessuna descrizione' }}</td>
          <td>{{ plan.exercises?.length || 0 }} esercizi</td>
          <td class="space-x-2">
            <button 
              class="btn btn-sm btn-ghost" 
              @click="$emit('view-plan', plan)"
              title="Visualizza dettagli"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button 
              class="btn btn-sm btn-ghost" 
              @click="$emit('edit-plan', plan)"
              title="Modifica piano"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              class="btn btn-sm btn-ghost text-error" 
              @click="$emit('delete-plan', plan)"
              title="Elimina piano"
            >
              <i class="fas fa-trash"></i>
            </button>
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
    required: true
  }
});

defineEmits(['view-plan', 'edit-plan', 'delete-plan']);
</script> 