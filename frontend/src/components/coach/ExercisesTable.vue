<template>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Gruppo Muscolare</th>
          <th>Descrizione</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="exercise in exercises" :key="exercise.id" class="hover">
          <td>{{ exercise.name }}</td>
          <td>{{ exercise.muscle_group }}</td>
          <td class="max-w-xs truncate">{{ exercise.description }}</td>
          <td class="flex gap-2">
            <button class="btn btn-sm btn-warning" @click="$emit('edit-exercise', exercise)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-error" @click="$emit('delete-exercise', exercise)">
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
  exercises: {
    type: Array,
    required: true
  }
});

defineEmits(['edit-exercise', 'delete-exercise']);
</script> 