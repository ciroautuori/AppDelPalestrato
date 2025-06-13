<template>
  <dialog class="modal modal-bottom sm:modal-middle" :open="showModal">
    <div class="modal-box bg-gray-800 w-11/12 max-w-2xl">
      <button
        @click="$emit('close-modal')"
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      
      <h3 class="font-bold text-lg text-warning mb-6">
        {{ listType === 'followers' ? 'Follower' : 'Following' }}
      </h3>

      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <span class="loading loading-spinner loading-lg text-warning"></span>
      </div>

      <div v-else-if="error" class="alert alert-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <div v-else-if="users.length === 0" class="text-center py-8 text-gray-400">
        {{ listType === 'followers' ? 'Nessun follower' : 'Non sta seguendo nessuno' }}
      </div>

      <div v-else class="space-y-4 max-h-[60vh] overflow-y-auto">
        <div v-for="user in users" :key="user.id" class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div class="flex items-center space-x-4">
            <div class="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
              <span class="text-sm font-bold text-white">{{ user.email.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <p class="font-medium text-white">{{ user.email }}</p>
              <p class="text-sm text-gray-400 capitalize">{{ user.role }}</p>
            </div>
          </div>
          <button
            v-if="!isOwnProfile(user)"
            @click="handleFollowToggle(user)"
            class="btn btn-sm"
            :class="user.is_followed_by_current_user ? 'btn-outline' : 'btn-primary'"
            :disabled="isFollowLoading"
          >
            <span v-if="isFollowLoading" class="loading loading-spinner loading-xs"></span>
            {{ user.is_followed_by_current_user ? 'Segui già' : 'Segui' }}
          </button>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close-modal')">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useUserManagementStore } from '@/store/userManagement';

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  },
  listType: {
    type: String,
    required: true,
    validator: (value) => ['followers', 'following'].includes(value)
  },
  userId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['close-modal']);

const authStore = useAuthStore();
const userManagementStore = useUserManagementStore();

const users = ref([]);
const isLoading = ref(false);
const error = ref(null);
const isFollowLoading = ref(false);

const isOwnProfile = (user) => {
  return user.id === authStore.user?.id;
};

const loadUsers = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    if (props.listType === 'followers') {
      users.value = await userManagementStore.getUserFollowers(props.userId);
    } else {
      users.value = await userManagementStore.getUserFollowing(props.userId);
    }
  } catch (err) {
    error.value = err.response?.data?.detail || 'Errore nel caricamento degli utenti';
  } finally {
    isLoading.value = false;
  }
};

const handleFollowToggle = async (user) => {
  isFollowLoading.value = true;
  try {
    if (user.is_followed_by_current_user) {
      await userManagementStore.unfollowUser(user.id);
      user.followers_count--;
    } else {
      await userManagementStore.followUser(user.id);
      user.followers_count++;
    }
    user.is_followed_by_current_user = !user.is_followed_by_current_user;
  } catch (err) {
    error.value = err.response?.data?.detail || 'Errore durante l\'operazione di follow';
  } finally {
    isFollowLoading.value = false;
  }
};

watch(() => props.showModal, (newValue) => {
  if (newValue) {
    loadUsers();
  }
});

onMounted(() => {
  if (props.showModal) {
    loadUsers();
  }
});
</script> 