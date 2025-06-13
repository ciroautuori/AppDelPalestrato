import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import LoginView from '@/views/LoginView.vue';
import AdminDashboardView from '@/views/AdminDashboardView.vue';
import UserManagementView from '@/views/admin/UserManagementView.vue'; // Added import
import CoachDashboardView from '@/views/coach/CoachDashboardView.vue'; // Corrected path
import MyAthletesView from '@/views/coach/MyAthletesView.vue'; // Added import
import MyPlansView from '@/views/coach/MyPlansView.vue';     // Added import
import ExerciseManagementView from '@/views/coach/ExerciseManagementView.vue';
import NutritionPlansView from '@/views/coach/NutritionPlansView.vue';
import AthleteDashboardView from '@/views/AthleteDashboardView.vue';
import AccessDeniedView from '@/views/AccessDeniedView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: (to) => {
        const authStore = useAuthStore();
        if (!authStore.isUserAuthenticated) return '/login';
        
        switch (authStore.userRole) {
          case 'admin':
            return '/admin/dashboard';
          case 'coach':
            return '/coach/dashboard';
          case 'athlete':
            return '/athlete/dashboard';
          default:
            return '/login';
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'AuthLayout' }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAuth: true, roles: ['admin'], layout: 'AppLayout' } // Updated meta
    },
    {
      path: '/admin/users', // New route for user management
      name: 'admin-users',
      component: UserManagementView,
      meta: { requiresAuth: true, roles: ['admin'], layout: 'AppLayout' }
    },
    {
      path: '/coach/dashboard',
      name: 'CoachDashboard', // Changed name for consistency
      component: CoachDashboardView,
      meta: { requiresAuth: true, roles: ['coach'], layout: 'AppLayout' } // Updated meta
    },
    {
      path: '/coach/my-athletes',
      name: 'CoachMyAthletes',
      component: MyAthletesView,
      meta: { requiresAuth: true, roles: ['coach'], layout: 'AppLayout' }
    },
    {
      path: '/coach/my-plans',
      name: 'CoachMyPlans',
      component: MyPlansView,
      meta: { requiresAuth: true, roles: ['coach'], layout: 'AppLayout' }
    },
    {
      path: '/coach/nutrition-plans',
      name: 'CoachNutritionPlans',
      component: NutritionPlansView, // The component to be created
      meta: { requiresAuth: true, roles: ['coach'], layout: 'AppLayout' }
    },
    {
      path: '/coach/exercises',
      name: 'CoachExercises',
      component: ExerciseManagementView,
      meta: { requiresAuth: true, roles: ['coach'], layout: 'AppLayout' }
    },
    {
      path: '/coach/workout-plans',
      name: 'CoachWorkoutPlanManagement',
      component: () => import('@/views/coach/WorkoutPlanManagement.vue'),
      meta: { requiresAuth: true, roles: ['coach'], layout: 'AppLayout' }
    },
    {
      path: '/coach/nutrition-plan-management',
      name: 'CoachNutritionPlanManagement',
      component: () => import('@/views/coach/NutritionPlanManagement.vue'),
      meta: { requiresAuth: true, roles: ['coach'], layout: 'AppLayout' }
    },
    {
      path: '/athlete/dashboard',
      name: 'athlete-dashboard',
      component: AthleteDashboardView,
      // Assuming athlete routes also need auth and role protection if they become more specific
      meta: { requiresAuth: true, roles: ['athlete'], layout: 'AppLayout' }
    },
    {
      path: '/athlete/history',
      name: 'athlete-history',
      component: () => import('@/views/athlete/HistoryView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['athlete'], // ensure 'roles' is used for consistency with the guard
        layout: 'AppLayout'
      }
    },
    {
      path: '/athlete/my-workout-plans',
      name: 'MyWorkoutPlans',
      component: () => import('@/views/athlete/MyWorkoutPlans.vue'),
      meta: { requiresAuth: true, roles: ['athlete'], layout: 'AppLayout' }
    },
    {
      path: '/athlete/my-nutrition-plans',
      name: 'MyNutritionPlans',
      component: () => import('@/views/athlete/MyNutritionPlans.vue'),
      meta: { requiresAuth: true, roles: ['athlete'], layout: 'AppLayout' }
    },
    {
      path: '/athlete/workout-plan/:id',
      name: 'WorkoutPlanDetail',
      component: () => import('@/views/athlete/WorkoutPlanDetail.vue'),
      meta: { requiresAuth: true, roles: ['athlete'], layout: 'AppLayout' }
    },
    {
      path: '/athlete/nutrition-plan/:id',
      name: 'NutritionPlanDetail',
      component: () => import('@/views/athlete/NutritionPlanDetail.vue'),
      meta: { requiresAuth: true, roles: ['athlete'], layout: 'AppLayout' }
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView,
      meta: { layout: 'AuthLayout' }
    },
    {
      path: '/coach/nutrition',
      name: 'CoachNutrition',
      component: () => import('@/views/coach/NutritionManagement.vue'),
      meta: { requiresAuth: true, roles: ['coach'] } // ensure 'roles' is used
    },
    {
      path: '/athlete/nutrition-plans', // This existing route might conflict or be for a different purpose
      name: 'AthleteNutritionPlans',
      component: () => import('@/views/athlete/NutritionPlans.vue'),
      meta: { requiresAuth: true, roles: ['athlete'] } // ensure 'roles' is used
    },
    {
      path: '/athlete/nutrition-plans/:id', // This existing route might conflict or be for a different purpose
      name: 'AthleteNutritionPlanDetail',
      component: () => import('@/views/athlete/NutritionPlanDetail.vue'),
      meta: { requiresAuth: true, roles: ['athlete'] } // ensure 'roles' is used
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  // Ensure store is initialized, especially on first load/refresh
  if (!authStore.isInitialized) {
    await authStore.initializeStore(); // Assuming initializeStore checks for token and fetches user
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userIsAuthenticated = authStore.isUserAuthenticated;
  const userRole = authStore.userRole;

  const allowedRoles = to.meta.roles; // This is an array

  if (requiresAuth && !userIsAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (requiresAuth && allowedRoles && !allowedRoles.includes(userRole)) {
    // If 'allowedRoles' is an array and 'userRole' is a string, this check is correct.
    next({ name: 'access-denied' });
  } else {
    next();
  }
});

export default router;