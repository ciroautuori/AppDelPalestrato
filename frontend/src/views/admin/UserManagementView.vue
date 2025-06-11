<script setup>
import { onMounted, ref, computed } from 'vue';
import { useUserManagementStore } from '@/store/userManagement';
import { useToastStore } from '@/store/toast';
import Toast from '@/components/Toast.vue';

const userManagementStore = useUserManagementStore();
const toastStore = useToastStore();
// const showCreateModal = ref(false); // Not directly used for modal.showModal() logic
const currentPage = ref(1); // For client-side pagination example, see paginatedUsers
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

// Use store's getters for users and pagination if available
const users = computed(() => userManagementStore.getUsers); // Assuming getUsers is the reactive list from store
const serverPagination = computed(() => userManagementStore.pagination);


onMounted(() => {
  userManagementStore.fetchUsers(currentPage.value); // Fetch initial page
});

const openCreateUserModal = () => {
  newUser.value = {
    name: '',
    email: '',
    password: '',
    role: 'athlete',
    coach_id: null
  };
  if (createModal.value) {
    createModal.value.showModal();
  }
};

const closeCreateUserModal = () => {
  if (createModal.value) {
    createModal.value.close();
  }
};

const openEditModal = (user) => {
  editingUser.value = { ...user };
  // Ensure coach_id is null if not provided or empty, for the input field
  if (editingUser.value.role !== 'athlete') {
    editingUser.value.coach_id = null;
  } else if (editingUser.value.coach_id === undefined || editingUser.value.coach_id === '') {
    editingUser.value.coach_id = null;
  }
  if (editModal.value) {
    editModal.value.showModal();
  }
};

const closeEditModal = () => {
  if (editModal.value) {
    editModal.value.close();
  }
};

const handleCreateUser = async () => {
  try {
    // Ensure coach_id is null if role is not athlete, or if it's empty string
    if (newUser.value.role !== 'athlete' || newUser.value.coach_id === '') {
      newUser.value.coach_id = null;
    }
    await userManagementStore.createUser(newUser.value);
    toastStore.showToast('Utente creato con successo', 'success');
    closeCreateUserModal();
    userManagementStore.fetchUsers(serverPagination.value?.currentPage || 1);
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Errore nella creazione dell\'utente';
    toastStore.showToast(message, 'error');
  }
};

const handleUpdateUser = async () => {
  try {
    // Ensure coach_id is null if role is not athlete, or if it's empty string
    if (editingUser.value.role !== 'athlete' || editingUser.value.coach_id === '') {
      editingUser.value.coach_id = null;
    }
    await userManagementStore.updateUser(editingUser.value.id, editingUser.value);
    toastStore.showToast('Utente aggiornato con successo', 'success');
    closeEditModal();
    userManagementStore.fetchUsers(serverPagination.value?.currentPage || 1);
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Errore nell\'aggiornamento dell\'utente';
    toastStore.showToast(message, 'error');
  }
};

const toggleUserStatus = async (user) => {
  try {
    const updatedUserData = { is_active: !user.is_active };
    await userManagementStore.updateUser(user.id, updatedUserData);
    toastStore.showToast(
      `Utente ${updatedUserData.is_active ? 'attivato' : 'disattivato'} con successo`,
      'success'
    );
    userManagementStore.fetchUsers(serverPagination.value?.currentPage || 1);
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Errore nella modifica dello stato dell\'utente';
    toastStore.showToast(message, 'error');
  }
};

const changePage = (page) => {
  if (page > 0 && page <= (serverPagination.value?.totalPages || 1)) {
    currentPage.value = page; // Keep local current page for potential client-side needs
    userManagementStore.fetchUsers(page);
  }
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

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 class="text-2xl font-bold text-yellow-500">Gestione Utenti</h1>
      <button @click="openCreateUserModal" class="btn btn-warning w-full sm:w-auto" :disabled="userManagementStore.loading">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Nuovo Utente
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="userManagementStore.loading && !users.length" class="flex justify-center items-center py-8">
      <div class="loading loading-spinner loading-lg text-warning"></div>
    </div>

    <!-- Error Message -->
    <div v-if="userManagementStore.errorMessage" class="alert alert-error mb-4">
      <span>{{ userManagementStore.errorMessage }}</span>
    </div>

    <!-- Tabella Utenti -->
    <div v-if="!userManagementStore.loading || users.length" class="overflow-x-auto bg-gray-800 rounded-lg shadow">
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
          <tr v-if="userManagementStore.loading && users.length" class="text-center">
            <td colspan="6">
              <div class="loading loading-spinner text-warning"></div>
            </td>
          </tr>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-700">
            <td class="hidden sm:table-cell">{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="getRoleBadgeClass(user.role)">
                {{ user.role }}
              </span>
            </td>
            <td class="hidden md:table-cell">{{ user.coach_id || '-' }}</td>
            <td>
              <span :class="getStatusBadgeClass(user.is_active)">
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
          <tr v-if="!userManagementStore.loading && users.length === 0 && !userManagementStore.errorMessage">
            <td colspan="6" class="text-center py-4">Nessun utente trovato.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginazione -->
    <div v-if="serverPagination && serverPagination.totalPages > 1 && (!userManagementStore.loading || users.length)" class="flex justify-center items-center mt-6">
      <div class="btn-group">
        <button
          @click="changePage(serverPagination.currentPage - 1)"
          class="btn btn-outline btn-sm"
          :disabled="serverPagination.currentPage === 1 || userManagementStore.loading">
          «
        </button>
        <button
            v-for="pageNumber in Array.from({ length: serverPagination.totalPages }, (_, i) => i + 1)"
            :key="pageNumber"
            @click="changePage(pageNumber)"
            class="btn btn-outline btn-sm"
            :class="{ 'btn-active btn-warning': pageNumber === serverPagination.currentPage }"
            :disabled="userManagementStore.loading">
            {{ pageNumber }}
        </button>
        <button
          @click="changePage(serverPagination.currentPage + 1)"
          class="btn btn-outline btn-sm"
          :disabled="serverPagination.currentPage === serverPagination.totalPages || userManagementStore.loading">
          »
        </button>
      </div>
    </div>


    <!-- Modale Creazione Utente -->
    <dialog ref="createModal" class="modal">
      <div class="modal-box bg-gray-800 w-11/12 max-w-md">
        <form @submit.prevent="handleCreateUser" novalidate>
          <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeCreateModal">✕</button>
          <h3 class="font-bold text-lg mb-4">Nuovo Utente</h3>

          <div class="form-control">
            <label class="label" for="create-name">
              <span class="label-text">Nome (Opzionale)</span>
            </label>
            <input
              id="create-name"
              v-model="newUser.name"
              type="text"
              placeholder="Mario Rossi"
              class="input input-bordered input-warning w-full"
            />
          </div>

          <div class="form-control">
            <label class="label" for="create-email">
              <span class="label-text">Email</span>
            </label>
            <input
              id="create-email"
              v-model="newUser.email"
              type="email"
              placeholder="utente@esempio.com"
              class="input input-bordered input-warning w-full"
              required
            />
          </div>
          <div class="form-control">
            <label class="label" for="create-password">
              <span class="label-text">Password</span>
            </label>
            <input
              id="create-password"
              v-model="newUser.password"
              type="password"
              placeholder="********"
              class="input input-bordered input-warning w-full"
              required
            />
          </div>
          <div class="form-control">
            <label class="label" for="create-role">
              <span class="label-text">Ruolo</span>
            </label>
            <select
              id="create-role"
              v-model="newUser.role"
              class="select select-bordered select-warning w-full"
              required
            >
              <option value="athlete">Atleta</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="form-control" v-if="newUser.role === 'athlete'">
            <label class="label" for="create-coach_id">
              <span class="label-text">Coach ID (Opzionale se atleta)</span>
            </label>
            <input
              id="create-coach_id"
              v-model.number="newUser.coach_id"
              type="number"
              min="1"
              placeholder="ID del coach"
              class="input input-bordered input-warning w-full"
            />
          </div>
          <div class="modal-action flex-col sm:flex-row gap-2 mt-6">
            <button type="button" class="btn btn-ghost w-full sm:w-auto" @click="closeCreateUserModal" :disabled="userManagementStore.loading">Annulla</button>
            <button type="submit" class="btn btn-warning w-full sm:w-auto" :disabled="userManagementStore.loading">
              <span v-if="userManagementStore.loading" class="loading loading-spinner loading-xs"></span>
              {{ userManagementStore.loading ? 'Creazione...' : 'Crea Utente' }}
            </button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Modale Modifica Utente -->
    <dialog ref="editModal" class="modal">
      <div class="modal-box bg-gray-800 w-11/12 max-w-md">
        <form @submit.prevent="handleUpdateUser" novalidate>
           <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeEditModal">✕</button>
          <h3 class="font-bold text-lg mb-4">Modifica Utente</h3>

          <div class="form-control">
            <label class="label" for="edit-email">
              <span class="label-text">Email</span>
            </label>
            <input
              id="edit-email"
              v-model="editingUser.email"
              type="email"
              class="input input-bordered input-warning w-full"
              readonly
            />
          </div>
          <div class="form-control">
            <label class="label" for="edit-role">
              <span class="label-text">Ruolo</span>
            </label>
            <select
              id="edit-role"
              v-model="editingUser.role"
              class="select select-bordered select-warning w-full"
              required
            >
              <option value="athlete">Atleta</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="form-control" v-if="editingUser.role === 'athlete'">
            <label class="label" for="edit-coach_id">
              <span class="label-text">Coach ID (Opzionale se atleta)</span>
            </label>
            <input
              id="edit-coach_id"
              v-model.number="editingUser.coach_id"
              type="number"
              min="1"
              placeholder="ID del coach"
              class="input input-bordered input-warning w-full"
            />
          </div>
           <div class="form-control">
            <label class="label cursor-pointer py-3" for="edit-is_active">
              <span class="label-text">Stato Attivo</span>
              <input
                id="edit-is_active"
                type="checkbox"
                v-model="editingUser.is_active"
                class="toggle toggle-warning"
              />
            </label>
          </div>
          <div class="modal-action flex-col sm:flex-row gap-2 mt-6">
            <button type="button" class="btn btn-ghost w-full sm:w-auto" @click="closeEditModal" :disabled="userManagementStore.loading">Annulla</button>
            <button type="submit" class="btn btn-warning w-full sm:w-auto" :disabled="userManagementStore.loading">
              <span v-if="userManagementStore.loading" class="loading loading-spinner loading-xs"></span>
              {{ userManagementStore.loading ? 'Salvataggio...' : 'Salva Modifiche' }}
            </button>
          </div>
        </form>
      </div>
    </dialog>

  </div>
</template>

<style scoped>
/* Styles for User Management View */
.modal-box {
  max-height: calc(100vh - 5em); /* Consider viewport height for modals */
  overflow-y: auto;
}
.table th, .table td {
  white-space: nowrap; /* Prevent text wrapping in table cells */
}
/* DaisyUI specific: ensure modal backdrop is clickable to close */
.modal:not(dialog[open]) {
  display: none;
}
.modal-open .modal {
    display: grid;
    place-items: center;
}
</style>
