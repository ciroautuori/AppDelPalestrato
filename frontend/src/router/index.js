import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import LoginView from '@/views/LoginView.vue';
import AdminDashboardView from '@/views/AdminDashboardView.vue';
import CoachDashboardView from '@/views/CoachDashboardView.vue';
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
      meta: { layout: 'AppLayout' }
    },
    {
      path: '/coach/dashboard',
      name: 'coach-dashboard',
      component: CoachDashboardView,
      meta: { layout: 'AppLayout' }
    },
    {
      path: '/athlete/dashboard',
      name: 'athlete-dashboard',
      component: AthleteDashboardView,
      meta: { layout: 'AppLayout' }
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
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const allowedRoles = to.meta.roles;

  if (requiresAuth && !authStore.isUserAuthenticated) {
    next('/login');
  } else if (requiresAuth && allowedRoles && !allowedRoles.includes(authStore.userRole)) {
    next('/access-denied');
  } else {
    next();
  }
});

export default router; 