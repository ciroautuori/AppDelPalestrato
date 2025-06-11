<script setup>
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-warning">Athlete Dashboard</h1>
      <div class="text-base-content">
        Welcome, {{ authStore.user?.email }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Placeholder Cards -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">My Training</h2>
          <p>View and track your training program</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">View Program</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Progress</h2>
          <p>Track your performance and achievements</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">View Progress</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">My Coach</h2>
          <p>View your coach's information and contact details</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">Contact Coach</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 