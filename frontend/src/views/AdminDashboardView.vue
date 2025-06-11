<script setup>
import { useAuthStore } from '@/store/auth';
import { onMounted, ref, computed } from 'vue';
import { useUserManagementStore } from '@/store/userManagement';

const authStore = useAuthStore();
const userManagementStore = useUserManagementStore();
const showCreateModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'athlete'
});

const users = computed(() => userManagementStore.users);
const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return users.value.slice(start, end);
});

onMounted(() => {
  userManagementStore.fetchUsers();
});

const openCreateUserModal = () => {
  document.getElementById('createUserModal').showModal();
};

const closeCreateUserModal = () => {
  document.getElementById('createUserModal').close();
};

const handleCreateUser = async () => {
  try {
    await userManagementStore.addUser(newUser.value);
    showCreateModal.value = false;
    newUser.value = {
      name: '',
      email: '',
      password: '',
      role: 'athlete'
    };
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

const prevPage = () => {
  userManagementStore.fetchUsers(userManagementStore.pagination.currentPage - 1);
};

const nextPage = () => {
  userManagementStore.fetchUsers(userManagementStore.pagination.currentPage + 1);
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'badge badge-primary';
    case 'coach': return 'badge badge-secondary';
    case 'athlete': return 'badge badge-accent';
    default: return 'badge';
  }
};

const getStatusBadgeClass = (isActive) => {
  return isActive ? 'badge badge-success' : 'badge badge-error';
};
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <p class="text-gray-400">Benvenuto nella tua dashboard</p>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Utenti Totali</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ users.length }}</p>
        <p class="text-sm text-gray-400 mt-2">Utenti registrati</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Allenatori</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ users.filter(u => u.role === 'coach').length }}</p>
        <p class="text-sm text-gray-400 mt-2">Allenatori attivi</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Atleti</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ users.filter(u => u.role === 'athlete').length }}</p>
        <p class="text-sm text-gray-400 mt-2">Atleti registrati</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Attività Recenti</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">12</p>
        <p class="text-sm text-gray-400 mt-2">Nuove attività oggi</p>
      </div>
    </div>

    <!-- User Management Section -->
    <div class="bg-gray-800 rounded-lg border border-gray-700">
      <div class="p-6 border-b border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-white">Gestione Utenti</h2>
          <button
            @click="showCreateModal = true"
            class="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Nuovo Utente
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-700/50">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ruolo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stato</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-700/30">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                      <span class="text-lg font-medium text-white">{{ user.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-white">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-500/10 text-yellow-500': user.role === 'admin',
                    'bg-blue-500/10 text-blue-500': user.role === 'coach',
                    'bg-green-500/10 text-green-500': user.role === 'athlete'
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(user.isActive)">{{ user.isActive ? 'Attivo' : 'Non Attivo' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-yellow-500 hover:text-yellow-600 mr-3">Modifica</button>
                <button class="text-red-500 hover:text-red-600">Elimina</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage > 1 && (currentPage--)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
            >
              Precedente
            </button>
            <button
              @click="currentPage < totalPages && (currentPage++)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
            >
              Successivo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-400">
                Mostrando
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                a
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, users.length) }}</span>
                di
                <span class="font-medium">{{ users.length }}</span>
                risultati
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="currentPage > 1 && (currentPage--)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  <span class="sr-only">Precedente</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    currentPage === page
                      ? 'z-10 bg-yellow-500 border-yellow-500 text-black'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage < totalPages && (currentPage++)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  <span class="sr-only">Successivo</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-white mb-4">Crea Nuovo Utente</h3>
        <form @submit.prevent="handleCreateUser">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300">Nome</label>
              <input
                type="text"
                id="name"
                v-model="newUser.name"
                class="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                v-model="newUser.email"
                class="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                v-model="newUser.password"
                class="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label for="role" class="block text-sm font-medium text-gray-300">Ruolo</label>
              <select
                id="role"
                v-model="newUser.role"
                class="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              >
                <option value="admin">Admin</option>
                <option value="coach">Coach</option>
                <option value="athlete">Atleta</option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-800"
            >
              Annulla
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-800"
            >
              Crea Utente
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 