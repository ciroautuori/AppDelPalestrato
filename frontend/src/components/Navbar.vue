<template>
  <nav class="bg-neutral shadow-lg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="text-xl font-bold text-brand-yellow">Fitness App</div>
        <div class="flex items-center space-x-4">
          <button class="btn btn-ghost text-brand-light hover:bg-brand-yellow hover:text-brand-dark">Home</button>
          <button class="btn btn-ghost text-brand-light hover:bg-brand-yellow hover:text-brand-dark">Dashboard</button>
          <div class="dropdown dropdown-end">
            <button class="btn btn-ghost text-brand-light hover:bg-brand-yellow hover:text-brand-dark">User</button>
            <ul class="dropdown-content menu p-2 shadow bg-neutral rounded-box w-52">
              <li><a class="text-brand-light hover:bg-brand-yellow hover:text-brand-dark">Profile</a></li>
              <li><a class="text-brand-light hover:bg-brand-yellow hover:text-brand-dark">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Add any necessary logic here
</script> 