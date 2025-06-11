import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = createRouter({
  history: createWebHistory(),
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
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/coach/dashboard',
      name: 'coach-dashboard',
      component: () => import('@/views/CoachDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['coach'] },
    },
    {
      path: '/athlete/dashboard',
      name: 'athlete-dashboard',
      component: () => import('@/views/AthleteDashboardView.vue'),
      meta: { requiresAuth: true, roles: ['athlete'] },
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: () => import('@/views/AccessDeniedView.vue'),
      meta: { requiresAuth: false },
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