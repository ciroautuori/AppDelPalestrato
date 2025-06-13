<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="bg-error text-error-content p-4 rounded-lg mb-4">
      {{ error }}
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- Profile Header -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ userInitials }}</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">{{ profile.email }}</h1>
              <p class="text-gray-400 capitalize">{{ profile.role }}</p>
            </div>
          </div>
          <button
            v-if="!isOwnProfile"
            @click="handleFollowToggle"
            class="btn"
            :class="profile.is_followed_by_current_user ? 'btn-outline' : 'btn-primary'"
            :disabled="isFollowLoading"
          >
            <span v-if="isFollowLoading" class="loading loading-spinner loading-xs"></span>
            {{ profile.is_followed_by_current_user ? 'Segui già' : 'Segui' }}
          </button>
        </div>

        <!-- Follow Stats -->
        <div class="flex space-x-8 mt-6">
          <button
            @click="openFollowList('followers')"
            class="flex flex-col items-center cursor-pointer hover:text-warning"
          >
            <span class="text-2xl font-bold">{{ profile.followers_count }}</span>
            <span class="text-sm text-gray-400">Follower</span>
          </button>
          <button
            @click="openFollowList('following')"
            class="flex flex-col items-center cursor-pointer hover:text-warning"
          >
            <span class="text-2xl font-bold">{{ profile.following_count }}</span>
            <span class="text-sm text-gray-400">Following</span>
          </button>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Records -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-bold text-white mb-4">Record Personali</h2>
          <div v-if="personalRecords.length === 0" class="text-gray-400">
            Nessun record personale disponibile.
          </div>
          <div v-else class="space-y-4">
            <div v-for="record in personalRecords" :key="record.id" class="bg-gray-700 rounded p-4">
              <h3 class="font-semibold text-warning">{{ record.exercise.name }}</h3>
              <p class="text-gray-300">{{ record.weight }} kg × {{ record.reps }} ripetizioni</p>
              <p class="text-sm text-gray-400">{{ formatDate(record.date_achieved) }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-bold text-white mb-4">Attività Recenti</h2>
          <div v-if="recentActivity.length === 0" class="text-gray-400">
            Nessuna attività recente.
          </div>
          <div v-else class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="bg-gray-700 rounded p-4">
              <p class="text-gray-300">{{ activity.description }}</p>
              <p class="text-sm text-gray-400">{{ formatDate(activity.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Follow List Modal -->
    <FollowListModal
      v-if="showFollowList"
      :show-modal="showFollowList"
      :list-type="followListType"
      :user-id="profileId"
      @close-modal="closeFollowList"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { useUserManagementStore } from '@/store/userManagement';
import { usePRStore } from '@/store/pr';
import FollowListModal from '@/components/modals/FollowListModal.vue';

const route = useRoute();
const authStore = useAuthStore();
const userManagementStore = useUserManagementStore();
const prStore = usePRStore();

const profileId = computed(() => route.params.id);
const isOwnProfile = computed(() => profileId.value === authStore.user?.id);

const isLoading = ref(false);
const error = ref(null);
const profile = ref(null);
const personalRecords = ref([]);
const recentActivity = ref([]);
const isFollowLoading = ref(false);
const showFollowList = ref(false);
const followListType = ref('');

const userInitials = computed(() => {
  if (!profile.value?.email) return '';
  return profile.value.email.charAt(0).toUpperCase();
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const loadProfile = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    profile.value = await userManagementStore.getUserProfile(profileId.value);
    if (profile.value.role === 'athlete') {
      personalRecords.value = await prStore.getPersonalRecords(profileId.value);
    }
    // Load recent activity (you'll need to implement this)
    // recentActivity.value = await activityService.getRecentActivity(profileId.value);
  } catch (err) {
    error.value = err.response?.data?.detail || 'Errore nel caricamento del profilo';
  } finally {
    isLoading.value = false;
  }
};

const handleFollowToggle = async () => {
  if (!profile.value) return;
  
  isFollowLoading.value = true;
  try {
    if (profile.value.is_followed_by_current_user) {
      await userManagementStore.unfollowUser(profileId.value);
      profile.value.followers_count--;
    } else {
      await userManagementStore.followUser(profileId.value);
      profile.value.followers_count++;
    }
    profile.value.is_followed_by_current_user = !profile.value.is_followed_by_current_user;
  } catch (err) {
    error.value = err.response?.data?.detail || 'Errore durante l\'operazione di follow';
  } finally {
    isFollowLoading.value = false;
  }
};

const openFollowList = (type) => {
  followListType.value = type;
  showFollowList.value = true;
};

const closeFollowList = () => {
  showFollowList.value = false;
  followListType.value = '';
};

onMounted(() => {
  loadProfile();
});
</script> 