<script setup>
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-warning">Admin Dashboard</h1>
      <div class="text-base-content">
        Welcome, {{ authStore.user?.email }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Placeholder Cards -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Users Management</h2>
          <p>Manage system users and their roles</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">Manage Users</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">System Settings</h2>
          <p>Configure system-wide settings and preferences</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">Settings</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">Analytics</h2>
          <p>View system usage and performance metrics</p>
          <div class="card-actions justify-end">
            <button class="btn btn-warning">View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 