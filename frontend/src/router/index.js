import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth'; // Importa lo store Pinia

// Importa i componenti delle viste
// Assicurati che questi percorsi siano corretti rispetto alla tua struttura di file
import LoginView from '../views/LoginView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';
import CoachDashboardView from '../views/CoachDashboardView.vue';
import AthleteDashboardView from '../views/AthleteDashboardView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true } // Per reindirizzare se già loggato
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/coach/dashboard',
    name: 'coach-dashboard',
    component: CoachDashboardView,
    meta: { requiresAuth: true, roles: ['coach'] }
  },
  {
    path: '/athlete/dashboard',
    name: 'athlete-dashboard',
    component: AthleteDashboardView,
    meta: { requiresAuth: true, roles: ['athlete'] }
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDeniedView
  },
  {
    // Catch-all route per 404
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  },
  {
    path: '/',
    name: 'home',
    // Questo è un placeholder, il redirect effettivo avverrà in beforeEach
    // Potrebbe anche reindirizzare a una landing page se esistesse
    redirect: () => {
      // La logica di redirect è gestita in router.beforeEach
      // Questo redirect di base serve come fallback se beforeEach non intercetta specificamente '/'
      // o se si vuole un comportamento di default esplicito per il path '/'.
      const authStore = useAuthStore();
      if (authStore.isUserAuthenticated) {
        const role = authStore.userRole;
        if (role === 'admin') return { name: 'admin-dashboard' };
        if (role === 'coach') return { name: 'coach-dashboard' };
        if (role === 'athlete') return { name: 'athlete-dashboard' };
        return { name: 'login' }; // Fallback se ruolo non gestito
      }
      return { name: 'login' };
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Usa createWebHistory per la modalità history
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore(); // Ottieni lo store Pinia

  // Assicurati che tryToLogin sia stato eseguito se lo stato non è ancora inizializzato
  // Questo è cruciale se l'utente ricarica la pagina o arriva direttamente a una route protetta.
  // isAuthenticated potrebbe essere false inizialmente finché tryToLogin non completa.
  // Tuttavia, tryToLogin è chiamato in main.js.
  // Se l'utente naviga molto velocemente, potremmo dover attendere che lo store sia pronto.
  // Per ora, assumiamo che lo stato sia sufficientemente aggiornato.
  // Un approccio più robusto potrebbe includere un flag "isReady" o attendere una promessa da tryToLogin.

  const requiresAuth = to.meta.requiresAuth;
  const requiredRoles = to.meta.roles;
  const requiresGuest = to.meta.requiresGuest; // Per pagine come /login, accessibili solo se non loggati

  // Gestione redirect per la route root '/'
  if (to.path === '/') {
    if (authStore.isUserAuthenticated) {
      const role = authStore.userRole;
      if (role === 'admin') return next({ name: 'admin-dashboard', replace: true });
      if (role === 'coach') return next({ name: 'coach-dashboard', replace: true });
      if (role === 'athlete') return next({ name: 'athlete-dashboard', replace: true });
      // Se l'utente è autenticato ma il ruolo non è gestito o non definito,
      // potrebbe essere un errore di configurazione o un utente con ruolo imprevisto.
      // Reindirizzare a login o a una pagina di errore generica.
      console.warn('Authenticated user with unhandled role:', role);
      return next({ name: 'login', replace: true }); // o access-denied
    } else {
      return next({ name: 'login', replace: true });
    }
  }

  // Se l'utente è già autenticato e tenta di accedere a una pagina "guest" (es. /login)
  if (requiresGuest && authStore.isUserAuthenticated) {
    const role = authStore.userRole;
    if (role === 'admin') return next({ name: 'admin-dashboard', replace: true });
    if (role === 'coach') return next({ name: 'coach-dashboard', replace: true });
    if (role === 'athlete') return next({ name: 'athlete-dashboard', replace: true });
    // Fallback se ruolo non gestito
    return next({ path: from.path || '/', replace: true }); // Torna indietro o alla home
  }

  // Se la route richiede autenticazione
  if (requiresAuth) {
    if (!authStore.isUserAuthenticated) {
      // Utente non autenticato, reindirizza a login
      // Salva la route di destinazione per reindirizzare dopo il login
      return next({ name: 'login', query: { redirect: to.fullPath }, replace: true });
    }

    // Utente autenticato, verifica i ruoli se richiesti
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = authStore.userRole;
      if (userRole && requiredRoles.includes(userRole)) {
        // L'utente ha il ruolo richiesto
        return next();
      } else {
        // L'utente non ha il ruolo richiesto
        console.warn(`Access denied for role '${userRole}' to route '${to.path}' requiring roles: ${requiredRoles}`);
        return next({ name: 'access-denied', replace: true });
      }
    }
    // La route richiede autenticazione ma non ruoli specifici
    return next();
  }

  // Se la route non richiede né autenticazione né è una guest page, permetti la navigazione
  return next();
});

export default router;
