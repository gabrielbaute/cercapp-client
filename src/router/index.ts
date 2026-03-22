import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../store/auth.store';
import DashboardLayout from '../layouts/DashboardLayout.vue'; // 1. Importamos el Shell

const routes: Array<RouteRecordRaw> = [
  // ==========================================
  // RUTAS PÚBLICAS (Solo Invitados)
  // No usan el DashboardLayout
  // ==========================================
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: () => import('../views/auth/RegisterUser.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register/company',
    name: 'RegisterCompany',
    component: () => import('../views/auth/RegisterCompany.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/recover-password',
    name: 'RecoverPassword',
    component: () => import('../views/auth/RecoverPassword.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/auth/ResetPassword.vue'),
    meta: { requiresGuest: true }
  },

  // ==========================================
  // RUTAS PRIVADAS (Con DashboardLayout)
  // ==========================================
  {
    path: '/', // Actúa como prefijo base para todas las hijas protegidas
    component: DashboardLayout, // 2. El componente padre envuelve a todos los hijos
    meta: { requiresAuth: true }, // Protege todo el bloque de una vez
    children: [
      // RUTAS GENERALES
      {
        path: 'dashboard', // Sin el '/' inicial para que se anexe al path del padre
        name: 'Dashboard',
        component: () => import('../views/dashboard/Dashboard.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/profile/Profile.vue'),
      },

      // PLANES DE INVERSIÓN
      {
        path: 'plans',
        name: 'MyPlans',
        component: () => import('../views/plans/MyPlans.vue'),
      },
      {
        path: 'plans/create',
        name: 'CreatePlan',
        component: () => import('../views/plans/CreatePlan.vue'),
      },
      {
        path: 'plans/:id',
        name: 'PlanDetail',
        component: () => import('../views/plans/PlanDetail.vue'),
        props: true
      },
      {
        path: 'plans/:id/edit',
        name: 'EditPlan',
        component: () => import('../views/plans/EditPlan.vue'),
        props: true
      },

      // PAGOS
      {
        path: 'payments',
        name: 'MyPayments',
        component: () => import('../views/payments/MyPayments.vue'),
      },
      {
        path: 'payments/create',
        name: 'CreatePayment',
        component: () => import('../views/payments/CreatePayment.vue'),
      },
      {
        path: 'payments/:id',
        name: 'PaymentDetail',
        component: () => import('../views/payments/PaymentDetail.vue'),
        props: true
      },

      // INCIDENCIAS
      {
        path: 'incidences',
        name: 'MyIncidences',
        component: () => import('../views/incidences/MyIncidences.vue'),
      },
      {
        path: 'incidences/create',
        name: 'CreateIncidence',
        component: () => import('../views/incidences/CreateIncidence.vue'),
      },
      // RUTAS DE PERFIL DE USUARIO
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/profile/Profile.vue'),
      },
      {
        path: 'profile/edit', // NUEVA RUTA
        name: 'EditProfile',
        component: () => import('../views/profile/EditProfile.vue'),
      },
      {
        path: 'settings/settings',
        name: 'Settings',
        component: () => import('../views/settings/Settings.vue'),
      },
      // RUTAS ESPECÍFICAS DE EMPRESA
      {
        path: 'company/users',
        name: 'CompanyUsers',
        component: () => import('../views/company/CompanyUsers.vue'),
        meta: { requiresCompany: true } // Mantenemos la protección de roles
      },

      // RUTAS DE ADMINISTRADOR
      {
        path: 'admin/users',
        name: 'AdminUsers',
        component: () => import('../views/admin/UsersList.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/companies',
        name: 'AdminCompanies',
        component: () => import('../views/admin/CompaniesList.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/plans',
        name: 'Plans',
        component: () => import('../views/admin/PlansList.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/payments',
        name: 'Payments',
        component: () => import('../views/admin/PaymentsList.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/incidences',
        name: 'Incidences',
        component: () => import('../views/admin/IncidencesList.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/incidences/:id',
        name: 'IncidenceDetail',
        component: () => import('../views/admin/IncidenceDetail.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: '/admin/users/:id',
        name: 'UserDetail',
        component: () => import('../views/admin/UserDetail.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: '/admin/companies/:id',
        name: 'CompanyDetail',
        component: () => import('../views/admin/CompanyDetail.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: '/admin/investment/:id',
        name: 'InvestmentDetail',
        component: () => import('../views/admin/InvestmentDetail.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: '/admin/payment/:id',
        name: 'PaymentDetailAdmin',
        component: () => import('../views/admin/PaymentDetail.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: '/admin/search',
        name: 'SearchResults',
        component: () => import('../views/admin/SearchResults.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'calculator',
        name: 'Calculator',
        component: () => import('../views/calculator/Calculator.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/settings/Settings.vue'),
      },
    ]
  },

  // ==========================================
  // MANEJO DE ERRORES (404)
  // ==========================================
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('../views/errors/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// NAVIGATION GUARD MODERNIZADO (Vue Router v4)
// Eliminamos 'from' y 'next' de los parámetros porque ya no los necesitamos
router.beforeEach((to) => {
  const authStore = useAuthStore();
  
  const isAuth = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;
  const isCompany = authStore.isCompany;

  // Utilizamos .matched para revisar el meta de los componentes padre e hijos
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresCompany = to.matched.some(record => record.meta.requiresCompany);

  // En lugar de next({ ... }), hacemos un simple return
  if (requiresAuth && !isAuth) {
    return { name: 'Login' };
  } 
  
  if (requiresGuest && isAuth) {
    return { name: 'Dashboard' };
  } 
  
  if (requiresAdmin && !isAdmin) {
    return { name: 'Dashboard' };
  } 
  
  if (requiresCompany && !isCompany && !isAdmin) {
    return { name: 'Dashboard' };
  }

  // Si todas las validaciones pasan, retornamos true para permitir la navegación
  return true;
});

export default router;