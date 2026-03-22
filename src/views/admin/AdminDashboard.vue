<script setup lang="ts">
import { useAdminDashboard } from './AdminDashboard';
import AdminDailyPaymentsChart from '../../components/admin/AdminDailyPaymentsChart.vue';

const { 
  isLoading, 
  stats, 
  recentApprovedPayments,
  isCalcModalOpen, 
  isCalculating, 
  calcForm, 
  successMessage, 
  errorMessage, 
  openCalculationModal, 
  closeCalculationModal, 
  triggerCalculation 
} = useAdminDashboard();
</script>

<template>
  <div class="space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Centro de Control</h1>
        <p class="text-slate-500 mt-1">Resumen general del sistema y operaciones administrativas.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <router-link to="/admin/users" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-cercapp-gold/50 transition-all cursor-pointer group">
        <div class="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nuevos Usuarios (Mes)</p>
          <p class="text-2xl font-bold text-cercapp-navy leading-none mt-1">{{ isLoading ? '...' : stats.usersThisMonth }}</p>
          <p class="text-[10px] font-semibold text-slate-400 mt-1">Total Histórico: {{ stats.totalUsers }}</p>
        </div>
      </router-link>

      <router-link to="/admin/plans" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-cercapp-gold/50 transition-all cursor-pointer group">
        <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nuevos Planes (Mes)</p>
          <p class="text-2xl font-bold text-cercapp-navy leading-none mt-1">{{ isLoading ? '...' : stats.plansThisMonth }}</p>
          <p class="text-[10px] font-semibold text-slate-400 mt-1">Total Histórico: {{ stats.totalPlans }}</p>
        </div>
      </router-link>

      <router-link to="/admin/payments" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-cercapp-gold/50 transition-all cursor-pointer group">
        <div class="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capital Ingresado (Mes)</p>
          <p class="text-2xl font-bold text-cercapp-navy leading-none mt-1">{{ isLoading ? '...' : `$${stats.capitalThisMonth.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` }}</p>
          <p class="text-[10px] font-semibold text-slate-400 mt-1">Histórico: ${{ stats.totalCapital.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</p>
        </div>
      </router-link>

      <router-link to="/admin/payments" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-red-300 transition-all cursor-pointer group">
        <div class="p-3 bg-red-50 text-red-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pagos por Auditar</p>
          <p class="text-2xl font-bold text-red-600 leading-none mt-1">{{ isLoading ? '...' : stats.pendingPayments }}</p>
          <p class="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
             Revisión Pendiente
             <svg v-if="stats.pendingPayments > 0" class="w-3 h-3 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="5"></circle></svg>
          </p>
        </div>
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      <div class="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div class="mb-4">
          <h2 class="text-lg font-bold text-cercapp-navy">Flujo de Capital Reciente</h2>
          <p class="text-sm text-slate-500">Ingresos confirmados durante los últimos 30 días.</p>
        </div>
        <div class="h-72 w-full">
          <div v-if="isLoading" class="h-full flex items-center justify-center text-slate-400">
            Cargando datos financieros...
          </div>
          <AdminDailyPaymentsChart 
            v-else 
            :payments="recentApprovedPayments" 
            title="" 
          />
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <h2 class="text-lg font-bold text-cercapp-navy">Operaciones del Sistema</h2>
        
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-red-200 transition-colors">
          <div class="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          
          <div class="pl-2">
            <h3 class="text-md font-bold text-slate-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Cálculo Contable
            </h3>
            <p class="text-sm text-slate-500 mt-2 mb-4 leading-relaxed">
              Fuerza la ejecución del motor de cálculo de intereses para un mes específico. Ignorará automáticamente planes ya procesados.
            </p>
            <button @click="openCalculationModal" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2">
              Iniciar Cálculo
            </button>
          </div>
        </div>
      </div>

    </div>

    <div v-if="isCalcModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-slate-900/75 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="closeCalculationModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-100">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-bold text-slate-900" id="modal-title">Ejecutar Cálculo Contable</h3>
                <div class="mt-2">
                  <p class="text-sm text-slate-500">
                    Estás a punto de forzar el cálculo de intereses. Por favor, especifica el periodo a procesar.
                  </p>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Año</label>
                    <input v-model.number="calcForm.year" type="number" :disabled="isCalculating" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cercapp-navy outline-none bg-slate-50" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mes (1-12)</label>
                    <input v-model.number="calcForm.month" type="number" min="1" max="12" :disabled="isCalculating" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cercapp-navy outline-none bg-slate-50" />
                  </div>
                </div>

                <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 flex gap-2 items-start">
                  <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{{ errorMessage }}</span>
                </div>
                <div v-if="successMessage" class="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100 flex gap-2 items-start">
                  <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>{{ successMessage }}</span>
                </div>

              </div>
            </div>
          </div>
          
          <div class="bg-slate-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
            <button 
              @click="triggerCalculation" 
              :disabled="isCalculating || !!successMessage"
              class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-bold text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2 transition-colors"
            >
              <span v-if="isCalculating" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ isCalculating ? 'Procesando Motor Contable...' : 'Confirmar y Ejecutar' }}
            </button>
            <button 
              @click="closeCalculationModal" 
              :disabled="isCalculating"
              class="mt-3 w-full inline-flex justify-center rounded-xl border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>