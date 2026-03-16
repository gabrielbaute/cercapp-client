<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { usePlanCard } from './PlanCard';
import type { components } from '../../api/v1/schema';

export default defineComponent({
  name: 'PlanCard',
  props: {
    plan: {
      type: Object as PropType<components["schemas"]["InvestmentPlanResponse"]>,
      required: true
    }
  },
  setup(props) {
    return { ...usePlanCard(props as any) };
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-cercapp-light hover:shadow-md transition-shadow relative overflow-hidden flex flex-col h-full">
    <div :class="headerColor" class="absolute top-0 left-0 w-full h-1"></div>
    
    <div class="flex justify-between items-start mb-4 mt-2">
      <div class="flex items-center gap-2 max-w-[70%]">
        <h3 class="text-lg font-bold text-cercapp-navy truncate">{{ plan.plan_name }}</h3>
        <router-link :to="{ name: 'EditPlan', params: { id: plan.id } }" class="text-gray-400 hover:text-cercapp-gold transition-colors p-1" title="Editar Plan">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </router-link>
      </div>
      <span :class="statusClasses" class="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide shrink-0">
        {{ plan.status }}
      </span>
    </div>

    <div class="space-y-3 mb-6 flex-1">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Tipo de Inversión</span>
        <span class="font-medium text-gray-900">{{ plan.investment_type }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Pagos</span>
        <span class="font-medium text-gray-900">{{ plan.payments_period }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Capitalización</span>
        <span class="font-medium text-gray-900">{{ plan.capitalization_period }} Año(s)</span>
      </div>
    </div>

    <div class="pt-3 mb-4 border-t border-gray-100">
      <div class="flex justify-between items-center text-sm mb-1">
        <span class="text-gray-500">Vencimiento</span>
        <span class="text-cercapp-navy font-bold">{{ formattedMaturityDate }}</span>
      </div>
      <div class="flex justify-between items-center text-sm">
        <span class="text-gray-500">Plazo</span>
        <span :class="plan.is_ready_for_renewal ? 'text-green-600 font-bold' : 'text-cercapp-gold font-medium'">
          {{ timeRemainingText }}
        </span>
      </div>
    </div>

    <router-link 
      :to="{ name: 'PlanDetail', params: { id: plan.id } }"
      class="block w-full text-center bg-gray-50 hover:bg-gray-100 text-cercapp-navy font-semibold py-2 rounded-lg transition-colors border border-gray-200 mt-auto"
    >
      Ver Detalles
    </router-link>
  </div>
</template>