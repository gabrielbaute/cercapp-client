<script lang="ts">
import { defineComponent } from 'vue';
import usePlanDetail from './PlanDetail';
import PaymentListItem from '../../components/payments/PaymentListItem.vue';

export default defineComponent({
  name: 'PlanDetailView',
  components: { PaymentListItem },
  setup() {
    return { ...usePlanDetail() };
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <router-link to="/plans" class="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-cercapp-navy hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </router-link>
        <div v-if="plan">
          <h1 class="text-2xl font-bold text-cercapp-navy">{{ plan.plan_name }}</h1>
          <p class="text-sm text-gray-500 mt-1">
            Creado el {{ new Date(plan.created_at).toLocaleDateString() }}
          </p>
        </div>
      </div>

      <router-link v-if="plan" :to="{ name: 'EditPlan', params: { id: plan.id } }" class="bg-white border border-gray-200 text-cercapp-navy font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        Editar
      </router-link>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="animate-spin h-8 w-8 border-4 border-cercapp-navy border-t-transparent rounded-full"></span>
    </div>
    <div v-else-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
      {{ errorMessage }}
    </div>

    <template v-else-if="plan">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white p-5 rounded-xl shadow-sm border border-cercapp-light">
          <p class="text-sm text-gray-500 mb-1">Estado del Plan</p>
          <div class="flex items-center gap-2">
            <span :class="plan.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'" class="px-3 py-1 rounded-md text-sm font-bold tracking-wide">
              {{ plan.status }}
            </span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-sm border border-cercapp-light">
          <p class="text-sm text-gray-500 mb-1">Frecuencia de Pagos</p>
          <p class="text-lg font-bold text-cercapp-navy capitalize">{{ plan.payments_period.toLowerCase() }}</p>
          <p class="text-xs text-cercapp-gold font-semibold mt-1">{{ plan.investment_type }}</p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-sm border border-cercapp-light bg-gradient-to-br from-white to-blue-50">
          <p class="text-sm text-gray-500 mb-1">Capital Confirmado</p>
          <p class="text-3xl font-bold text-cercapp-navy">$ {{ totalInvested.toFixed(2) }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-cercapp-light overflow-hidden mt-8">
        <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-cercapp-navy">Historial de Aportes</h2>
          <button class="text-sm text-cercapp-gold font-semibold hover:underline">
            + Registrar Pago
          </button>
        </div>
        
        <div class="p-5">
          <div v-if="payments.length === 0" class="text-center py-8">
            <p class="text-gray-500">Aún no has registrado pagos para este plan.</p>
          </div>
          <div v-else class="space-y-3">
            <PaymentListItem 
              v-for="payment in payments" 
              :key="payment.id" 
              :payment="payment" 
            />
          </div>
        </div>
      </div>

    </template>
  </div>
</template>