<script setup>
import { useAuthStore } from '@/store/auth';
import { onMounted, ref, computed } from 'vue';
import { useUserManagementStore } from '@/store/userManagement';
import { useToastStore } from '@/store/toast';
import Toast from '@/components/Toast.vue';

const authStore = useAuthStore();
const userManagementStore = useUserManagementStore();
const toastStore = useToastStore();
const showCreateModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

const createModal = ref(null);
const editModal = ref(null);

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'athlete',
  coach_id: null
});

const editingUser = ref({
  id: null,
  email: '',
  role: '',
  coach_id: null,
  is_active: true
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
  createModal.value.showModal();
};

const closeCreateUserModal = () => {
  createModal.value.close();
  newUser.value = {
    name: '',
    email: '',
    password: '',
    role: 'athlete',
    coach_id: null
  };
};

const openEditModal = (user) => {
  editingUser.value = { ...user };
  editModal.value.showModal();
};

const closeEditModal = () => {
  editModal.value.close();
  editingUser.value = {
    id: null,
    email: '',
    role: '',
    coach_id: null,
    is_active: true
  };
};

const handleCreateUser = async () => {
  try {
    await userManagementStore.createUser(newUser.value);
    toastStore.showToast('Utente creato con successo', 'success');
    closeCreateUserModal();
  } catch (error) {
    toastStore.showToast(error.message || 'Errore nella creazione dell\'utente', 'error');
  }
};

const handleUpdateUser = async () => {
  try {
    await userManagementStore.updateUser(editingUser.value.id, editingUser.value);
    toastStore.showToast('Utente aggiornato con successo', 'success');
    closeEditModal();
  } catch (error) {
    toastStore.showToast(error.message || 'Errore nell\'aggiornamento dell\'utente', 'error');
  }
};

const toggleUserStatus = async (user) => {
  try {
    await userManagementStore.updateUser(user.id, { is_active: !user.is_active });
    toastStore.showToast(
      `Utente ${user.is_active ? 'disattivato' : 'attivato'} con successo`,
      'success'
    );
  } catch (error) {
    toastStore.showToast(error.message || 'Errore nella modifica dello stato dell\'utente', 'error');
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
  <div class="p-4">
    <Toast />
    
    <!-- Header con titolo e pulsante nuovo utente -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <button @click="openCreateUserModal" class="btn btn-warning w-full sm:w-auto" :disabled="userManagementStore.loading">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Nuovo Utente
      </button>
    </div>

    <!-- Statistiche -->
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
        <p class="text-3xl font-bold text-white">{{ userManagementStore.getUsers.length }}</p>
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
        <p class="text-3xl font-bold text-white">{{ userManagementStore.getUsers.filter(u => u.role === 'coach').length }}</p>
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
        <p class="text-3xl font-bold text-white">{{ userManagementStore.getUsers.filter(u => u.role === 'athlete').length }}</p>
        <p class="text-sm text-gray-400 mt-2">Atleti registrati</p>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Utenti Attivi</h3>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-white">{{ userManagementStore.getUsers.filter(u => u.is_active).length }}</p>
        <p class="text-sm text-gray-400 mt-2">Utenti attivi</p>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="userManagementStore.loading" class="flex justify-center items-center py-8">
      <div class="loading loading-spinner loading-lg text-warning"></div>
    </div>

    <!-- Error Message -->
    <div v-if="userManagementStore.errorMessage" class="alert alert-error mb-4">
      <span>{{ userManagementStore.errorMessage }}</span>
    </div>

    <!-- Tabella Utenti -->
    <div v-if="!userManagementStore.loading" class="overflow-x-auto bg-gray-800 rounded-lg shadow">
      <table class="table w-full">
        <thead>
          <tr class="text-gray-400">
            <th class="hidden sm:table-cell">ID</th>
            <th>Email</th>
            <th>Ruolo</th>
            <th class="hidden md:table-cell">Coach Assegnato</th>
            <th>Stato</th>
            <th class="text-right">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userManagementStore.getUsers" :key="user.id" class="hover:bg-gray-700">
            <td class="hidden sm:table-cell">{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="[
                'badge',
                user.role === 'admin' ? 'badge-primary' :
                user.role === 'coach' ? 'badge-secondary' :
                'badge-accent'
              ]">
                {{ user.role }}
              </span>
            </td>
            <td class="hidden md:table-cell">{{ user.coach_id || '-' }}</td>
            <td>
              <span :class="[
                'badge',
                user.is_active ? 'badge-success' : 'badge-error'
              ]">
                {{ user.is_active ? 'Attivo' : 'Disattivo' }}
              </span>
            </td>
            <td class="text-right">
              <div class="flex flex-col sm:flex-row gap-2 justify-end">
                <button @click="openEditModal(user)" class="btn btn-xs btn-warning w-full sm:w-auto" :disabled="userManagementStore.loading">
                  Modifica
                </button>
                <button 
                  v-if="user.email !== 'admin@example.com'"
                  @click="toggleUserStatus(user)"
                  :class="[
                    'btn btn-xs w-full sm:w-auto',
                    user.is_active ? 'btn-error' : 'btn-success'
                  ]"
                  :disabled="userManagementStore.loading"
                >
                  {{ user.is_active ? 'Disattiva' : 'Attiva' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modale Creazione Utente -->
    <dialog ref="createModal" class="modal">
      <div class="modal-box bg-gray-800 w-11/12 max-w-md">
        <h3 class="font-bold text-lg mb-4">Nuovo Utente</h3>
        <form @submit.prevent="handleCreateUser">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input 
              v-model="newUser.email"
              type="email"
              class="input input-bordered bg-gray-700"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input 
              v-model="newUser.password"
              type="password"
              class="input input-bordered bg-gray-700"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Ruolo</span>
            </label>
            <select 
              v-model="newUser.role"
              class="select select-bordered bg-gray-700"
              required
            >
              <option value="admin">Admin</option>
              <option value="coach">Coach</option>
              <option value="athlete">Atleta</option>
            </select>
          </div>
          <div class="form-control" v-if="newUser.role === 'athlete'">
            <label class="label">
              <span class="label-text">Coach ID</span>
            </label>
            <input 
              v-model="newUser.coach_id"
              type="number"
              class="input input-bordered bg-gray-700"
              required
            />
          </div>
          <div class="modal-action flex-col sm:flex-row gap-2">
            <button type="button" class="btn w-full sm:w-auto" @click="closeCreateModal" :disabled="userManagementStore.loading">Annulla</button>
            <button type="submit" class="btn btn-warning w-full sm:w-auto" :disabled="userManagementStore.loading">
              {{ userManagementStore.loading ? 'Creazione...' : 'Crea' }}
            </button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Modale Modifica Utente -->
    <dialog ref="editModal" class="modal">
      <div class="modal-box bg-gray-800 w-11/12 max-w-md">
        <h3 class="font-bold text-lg mb-4">Modifica Utente</h3>
        <form @submit.prevent="handleUpdateUser">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input 
              v-model="editingUser.email"
              type="email"
              class="input input-bordered bg-gray-700"
              readonly
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Ruolo</span>
            </label>
            <select 
              v-model="editingUser.role"
              class="select select-bordered bg-gray-700"
              required
            >
              <option value="admin">Admin</option>
              <option value="coach">Coach</option>
              <option value="athlete">Atleta</option>
            </select>
          </div>
          <div class="form-control" v-if="editingUser.role === 'athlete'">
            <label class="label">
              <span class="label-text">Coach ID</span>
            </label>
            <input 
              v-model="editingUser.coach_id"
              type="number"
              class="input input-bordered bg-gray-700"
              required
            />
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Stato Attivo</span>
              <input 
                type="checkbox"
                v-model="editingUser.is_active"
                class="toggle toggle-warning"
              />
            </label>
          </div>
          <div class="modal-action flex-col sm:flex-row gap-2">
            <button type="button" class="btn w-full sm:w-auto" @click="closeEditModal" :disabled="userManagementStore.loading">Annulla</button>
            <button type="submit" class="btn btn-warning w-full sm:w-auto" :disabled="userManagementStore.loading">
              {{ userManagementStore.loading ? 'Salvataggio...' : 'Salva' }}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template> 