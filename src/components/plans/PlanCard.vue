<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { usePlanCard } from './PlanCard';
import type { components } from '../../api/v1/schema';

type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"];

export default defineComponent({
  name: 'PlanCard',
  props: {
    plan: {
      type: Object as PropType<InvestmentPlan>,
      required: true
    },
    capital: {
      type: Number,
      required: false
    },
    interests: {
      type: Number,
      required: false
    }
  },
  setup(props) {
    return { ...usePlanCard(props as any) };
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full text-left">
    
    <div :class="headerColor" class="absolute top-0 left-0 w-full h-1"></div>
    
    <div class="flex justify-between items-start mb-4 mt-2">
      <div class="flex items-center gap-2 max-w-[70%]">
        <h3 class="text-lg font-bold text-cercapp-navy truncate">{{ plan.plan_name }}</h3>
        <router-link :to="{ name: 'EditPlan', params: { id: plan.id } }" class="text-slate-400 hover:text-cercapp-gold transition-colors p-1" title="Editar Plan">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </router-link>
      </div>
      <span :class="statusClasses" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0">
        {{ plan.status }}
      </span>
    </div>

    <div class="mb-5 p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex justify-between items-center h-16">
      
      <template v-if="isFetchingFinancials">
        <div class="w-24 h-8 bg-slate-200 rounded animate-pulse"></div>
        <div class="w-24 h-8 bg-slate-200 rounded animate-pulse"></div>
      </template>

      <template v-else>
        <div>
          <p class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Capital</p>
          <p class="text-lg font-bold text-cercapp-navy">$ {{ displayCapital }}</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Intereses</p>
          <p class="text-lg font-bold text-cercapp-gold">+ $ {{ displayInterests }}</p>
        </div>
      </template>
    </div>

    <div class="space-y-3 mb-6 flex-1">
      <div class="flex justify-between text-sm">
        <span class="text-slate-500 font-medium">Tipo de Inversión</span>
        <span class="font-bold text-slate-900">{{ plan.investment_type }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-slate-500 font-medium">Pagos</span>
        <span class="font-bold text-slate-900">{{ plan.payments_period }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-slate-500 font-medium">Capitalización</span>
        <span class="font-bold text-slate-900">{{ plan.capitalization_period }} Año(s)</span>
      </div>
    </div>

    <div class="pt-4 mb-5 border-t border-slate-100">
      <div class="flex justify-between items-center text-sm mb-1">
        <span class="text-slate-500 font-medium">Vencimiento</span>
        <span class="text-cercapp-navy font-bold">{{ formattedMaturityDate }}</span>
      </div>
      <div class="flex justify-between items-center text-sm">
        <span class="text-slate-500 font-medium">Plazo</span>
        <span :class="plan.is_ready_for_renewal ? 'text-green-600 font-bold' : 'text-cercapp-gold font-bold'">
          {{ timeRemainingText }}
        </span>
      </div>
    </div>

    <router-link 
      :to="{ name: 'PlanDetail', params: { id: plan.id } }"
      class="block w-full text-center bg-slate-50 hover:bg-slate-100 text-cercapp-navy font-bold text-sm py-2.5 rounded-xl transition-colors border border-slate-200 mt-auto shadow-sm"
    >
      Ver Expediente Detallado
    </router-link>
    
  </div>
</template>