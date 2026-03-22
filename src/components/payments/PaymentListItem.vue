<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { usePaymentListItem } from './PaymentListItem';
import type { components } from '../../api/v1/schema';

type Payment = components["schemas"]["PaymentResponse"] | components["schemas"]["PaymentCompanyResponse"];

export default defineComponent({
  name: 'PaymentListItem',
  props: {
    payment: {
      type: Object as PropType<Payment>,
      required: true
    }
  },
  setup(props) {
    return { ...usePaymentListItem(props) };
  }
});
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm gap-4">
    
    <div class="flex items-center gap-4">
      <div :class="payment.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      
      <div>
        <router-link 
          :to="{ name: 'PaymentDetail', params: { id: payment.id } }" 
          class="font-bold text-cercapp-navy hover:text-cercapp-gold hover:underline capitalize transition-colors cursor-pointer block"
        >
          {{ formattedMethod }}
        </router-link>
        <p class="text-xs text-gray-500 mt-0.5">{{ payment.payment_date }} • Ref: {{ payment.transaction_id || 'N/A' }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
      
      <div class="text-right mr-2">
        <p class="font-bold text-gray-900">$ {{ parseFloat(String(payment.divisa_amount)).toFixed(2) }}</p>
        <span :class="statusBadge.class" class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
          {{ statusBadge.text }}
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <slot name="actions"></slot>
        
        <router-link 
          :to="{ name: 'PaymentDetail', params: { id: payment.id } }" 
          class="p-2 text-slate-400 hover:text-cercapp-navy hover:bg-slate-100 rounded-lg transition-colors" 
          title="Ver Detalles Completos"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </router-link>
      </div>

    </div>
  </div>
</template>