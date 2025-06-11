<script setup>
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-warning">Coach Dashboard</h1>
      <div class="text-base-content">
        Welcome, {{ authStore.user?.email }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Placeholder Cards -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Athletes</h2>
          <p>Manage your athletes and their training programs</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">View Athletes</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Training Programs</h2>
          <p>Create and manage training programs</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">Manage Programs</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Progress Reports</h2>
          <p>Track and analyze athlete progress</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">View Reports</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 