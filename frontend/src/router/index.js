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
// import AthleteDashboardView from '@/views/AthleteDashboardView.vue'; // Old dashboard
import DashboardView from '../views/athlete/DashboardView.vue'; // New Athlete Dashboard
import ProfileView from '../views/athlete/ProfileView.vue';   // New Athlete Profile
import AccessDeniedView from '@/views/AccessDeniedView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Default redirect based on role
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore();
        if (!authStore.isUserAuthenticated) return '/login';
        switch (authStore.userRole) {
          case 'admin': return '/admin/dashboard';
          case 'coach': return '/coach/dashboard';
          case 'athlete': return '/athlete/dashboard';
          default: return '/login';
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'AuthLayout' }
    },
    // Admin Routes
    {
      path: '/admin',
      // component: AppLayout, // Assuming AppLayout is your default layout for authenticated users
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboardView, meta: { layout: 'AppLayout' } },
        { path: 'users', name: 'admin-users', component: UserManagementView, meta: { layout: 'AppLayout' } },
        { path: '', redirect: 'dashboard' }
      ]
    },
    // Coach Routes
    {
      path: '/coach',
      // component: AppLayout,
      meta: { requiresAuth: true, roles: ['coach'] },
      children: [
        { path: 'dashboard', name: 'coach-dashboard', component: CoachDashboardView, meta: { layout: 'AppLayout' } }, // Corrected name
        { path: 'my-athletes', name: 'coach-my-athletes', component: MyAthletesView, meta: { layout: 'AppLayout' } }, // Corrected name
        { path: 'my-plans', name: 'coach-my-plans', component: MyPlansView, meta: { layout: 'AppLayout' } }, // Corrected name
        { path: 'nutrition-plans', name: 'coach-nutrition-plans', component: NutritionPlansView, meta: { layout: 'AppLayout' } }, // Corrected name
        { path: 'exercises', name: 'coach-exercises', component: ExerciseManagementView, meta: { layout: 'AppLayout' } }, // Corrected name
        { path: 'workout-plans', name: 'coach-workout-plan-management', component: () => import('@/views/coach/WorkoutPlanManagement.vue'), meta: { layout: 'AppLayout' } }, // Corrected name
        { path: 'nutrition-plan-management', name: 'coach-nutrition-plan-management', component: () => import('@/views/coach/NutritionPlanManagement.vue'), meta: { layout: 'AppLayout' } }, // Corrected name
        { path: 'nutrition', name: 'coach-nutrition', component: () => import('@/views/coach/NutritionManagement.vue'), meta: { layout: 'AppLayout' } },
        { path: '', redirect: 'dashboard' }
      ]
    },
    // Athlete Routes
    {
      path: '/athlete',
      // component: AppLayout, // Assuming AppLayout handles the navigation for athletes
      meta: { requiresAuth: true, roles: ['athlete'] },
      children: [
        {
          path: 'dashboard',
          name: 'athlete-dashboard',
          component: DashboardView, // New Dashboard view
          meta: { layout: 'AppLayout' }
        },
        {
          path: 'profile',
          name: 'athlete-profile',
          component: ProfileView, // New Profile view
          meta: { layout: 'AppLayout' }
        },
        {
          path: 'history',
          name: 'athlete-history',
          component: () => import('@/views/athlete/HistoryView.vue'),
          meta: { layout: 'AppLayout' }
        },
        // {
        //   path: 'my-workout-plans', // Old route, to be removed or handled
        //   name: 'MyWorkoutPlans',
        //   component: () => import('@/views/athlete/MyWorkoutPlans.vue'),
        //   meta: { layout: 'AppLayout' }
        // },
        // {
        //   path: 'my-nutrition-plans', // Old route, to be removed or handled
        //   name: 'MyNutritionPlans',
        //   component: () => import('@/views/athlete/MyNutritionPlans.vue'),
        //   meta: { layout: 'AppLayout' }
        // },
        // {
        //   path: 'nutrition-plans', // Old route, to be removed or handled
        //   name: 'AthleteNutritionPlans',
        //   component: () => import('@/views/athlete/NutritionPlans.vue'),
        //   meta: { layout: 'AppLayout' }
        // },
        // Specific plan details might still be relevant if linked from somewhere
        {
          path: 'workout-plan/:id',
          name: 'WorkoutPlanDetail',
          component: () => import('@/views/athlete/WorkoutPlanDetail.vue'),
          meta: { layout: 'AppLayout' }
        },
        {
          path: 'nutrition-plan/:id',
          name: 'NutritionPlanDetail', // Corrected name for consistency
          component: () => import('@/views/athlete/NutritionPlanDetail.vue'),
          meta: { layout: 'AppLayout' }
        },
        // {
        //   path: 'nutrition-plans/:id', // Old, potentially duplicate if NutritionPlanDetail covers it
        //   name: 'AthleteNutritionPlanDetail',
        //   component: () => import('@/views/athlete/NutritionPlanDetail.vue'),
        //   meta: { layout: 'AppLayout' }
        // },
        { path: '', redirect: 'dashboard' } // Default for /athlete
      ]
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView,
      meta: { layout: 'AuthLayout' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false },
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isInitialized) {
    await authStore.initializeStore();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userIsAuthenticated = authStore.isUserAuthenticated;
  const userRole = authStore.userRole;
  const allowedRoles = to.meta.roles;

  if (requiresAuth && !userIsAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (requiresAuth && allowedRoles && !allowedRoles.includes(userRole)) {
    next({ name: 'access-denied' });
  } else {
    // Ensure AppLayout is applied if not specified at the child level but at parent
    if (to.matched.some(record => record.meta.requiresAuth) && !to.meta.layout) {
      const parentLayout = to.matched.find(record => record.meta.layout)?.meta.layout;
      if (parentLayout) {
        to.meta.layout = parentLayout;
      } else {
        // Default to AppLayout if authenticated route has no layout specified
        // and no parent layout is found (though this case should be rare with nested routes)
        to.meta.layout = 'AppLayout';
      }
    }
    next();
  }
});

export default router;