<script lang="ts">
import { defineComponent } from 'vue';
import useMyPayments from './MyPayments';
import PaymentListItem from '../../components/payments/PaymentListItem.vue';

export default defineComponent({
  name: 'MyPaymentsView',
  components: { PaymentListItem },
  setup() {
    return { ...useMyPayments() };
  }
});
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Mis Pagos</h1>
        <p class="text-gray-500 mt-1">Historial de aportes a tus planes de inversión.</p>
      </div>
      <router-link to="/payments/create" class="bg-cercapp-gold hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Registrar Pago
      </router-link>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-cercapp-light flex items-center gap-4">
      <label class="text-sm font-bold text-cercapp-navy shrink-0">Filtrar por estado:</label>
      <select 
        v-model="currentFilter" 
        class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-cercapp-gold focus:border-cercapp-gold block w-full sm:w-auto p-2 outline-none"
      >
        <option value="ACTIVE">Activos (Ocultar Cancelados)</option>
        <option value="ALL">Todos los pagos</option>
        <option value="PENDING">Solo Pendientes</option>
        <option value="COMPLETED">Solo Completados</option>
        <option value="REJECTED">Solo Rechazados</option>
        <option value="CANCELLED">Solo Cancelados</option>
      </select>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="animate-spin h-8 w-8 border-4 border-cercapp-navy border-t-transparent rounded-full"></span>
    </div>
    
    <div v-else-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
      {{ errorMessage }}
    </div>

    <div v-else-if="filteredPayments.length === 0" class="bg-white rounded-2xl p-12 text-center border border-cercapp-light shadow-sm">
      <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      </div>
      <h3 class="text-lg font-bold text-cercapp-navy">Sin resultados</h3>
      <p class="text-gray-500 mt-1 max-w-sm mx-auto">No se encontraron pagos con el filtro seleccionado.</p>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-sm border border-cercapp-light overflow-hidden">
      <div class="space-y-0 divide-y divide-gray-100">
        <PaymentListItem v-for="payment in filteredPayments" :key="payment.id" :payment="payment">
          
          <template #actions v-if="payment.status === 'PENDING'">
            <button 
              @click="cancelPayment(payment.id)"
              class="ml-3 px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors"
              title="Anular pago por error"
            >
              Anular
            </button>
          </template>

        </PaymentListItem>
      </div>
    </div>

  </div>
</template>