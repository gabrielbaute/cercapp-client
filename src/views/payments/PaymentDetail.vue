<script lang="ts">
import { defineComponent } from 'vue';
import usePaymentDetail from './PaymentDetail';
import ConfirmModal from '../../components/common/ConfirmModal.vue'; // Importamos el modal

export default defineComponent({
  name: 'PaymentDetailView',
  components: { ConfirmModal }, // Registramos el componente
  setup() {
    return { ...usePaymentDetail() };
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    
    <div class="flex items-center gap-4">
      <router-link to="/payments" class="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-cercapp-navy hover:bg-gray-50 transition-colors shadow-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <div class="text-left">
        <h1 class="text-2xl font-bold text-cercapp-navy">Detalle del Pago</h1>
        <p class="text-sm text-gray-500 mt-1">Revisa la información de tu reporte.</p>
      </div>
    </div>
    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="animate-spin h-8 w-8 border-4 border-cercapp-navy border-t-transparent rounded-full"></span>
    </div>
    <div v-else-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
      {{ errorMessage }}
    </div>
    <div v-else-if="payment" class="bg-white rounded-2xl shadow-sm border border-cercapp-light overflow-hidden">
      
      <div class="p-8 text-center border-b border-gray-100 bg-gray-50 relative">
        <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Monto Reportado</p>
        <h2 class="text-4xl font-bold text-cercapp-navy mb-4">$ {{ parseFloat(String(payment.divisa_amount)).toFixed(2) }}</h2>
        <span :class="statusClasses" class="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
          {{ payment.status }}
        </span>
      </div>

      <div class="p-8 text-left">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          
          <div>
            <p class="text-sm text-gray-500 mb-1">Plan Destino</p>
            <p class="font-semibold text-cercapp-navy flex items-center gap-2">
              <svg class="w-4 h-4 text-cercapp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ associatedPlan ? associatedPlan.plan_name : 'Cargando plan...' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Método de Pago</p>
            <p class="font-semibold text-gray-900 capitalize">{{ payment.payment_method.replace('_', ' ') }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Referencia / Comprobante</p>
            <p class="font-semibold text-gray-900 font-mono">{{ payment.transaction_id || 'N/A' }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Fecha de Emisión</p>
            <p class="font-semibold text-gray-900">{{ payment.payment_date }}</p>
          </div>

          <div class="md:col-span-2 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-400 text-center">
              Reporte creado el {{ new Date(payment.created_at).toLocaleString() }}
            </p>
          </div>

        </div>
      </div>

      <div v-if="payment.status === 'PENDING'" class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button 
          @click="confirmCancelPayment" 
          class="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          Anular Reporte
        </button>
      </div>

    </div>
    <ConfirmModal 
      :show="modal.show" 
      :title="modal.title" 
      :message="modal.message" 
      :type="modal.type"
      :isLoading="isCancelling"
      @confirm="executeCancelPayment"
      @close="modal.show = false"
    />
    </div>
</template>