<script lang="ts">
import { defineComponent } from 'vue';
import useInvestmentDetail from './InvestmentDetail';
import InfoRow from '../../components/common/InfoRow.vue';
import InvestmentStatusBadge from '../../components/common/InvestmentStatusBadge.vue';
import PaymentStatusBadge from '../../components/common/PaymentStatusBadge.vue';
import PaymentHistoryChart from '../../components/common/PaymentHistoryChart.vue';
import InterestHistoryChart from '../../components/common/InterestHistoryChart.vue'; // NUEVO
import ConfirmModal from '../../components/common/ConfirmModal.vue';
import EditPaymentModal from '../../components/admin/EditPaymentModal.vue';
import EditPlanModal from '../../components/admin/EditPlanModal.vue';

export default defineComponent({
  name: 'InvestmentDetail',
  components: { 
    InfoRow, InvestmentStatusBadge, PaymentStatusBadge, 
    PaymentHistoryChart, InterestHistoryChart, ConfirmModal, EditPaymentModal, EditPlanModal 
  },
  setup() { return { ...useInvestmentDetail() }; }
});
</script>

<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div class="flex items-center gap-4 text-left">
        <button @click="$router.back()" class="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div v-if="plan">
          <h1 class="text-2xl font-bold text-slate-900">{{ plan.plan_name }}</h1>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-xs font-mono text-slate-400">ID: {{ plan.id }}</span>
            <span v-if="typeof plan.days_remaining === 'number'" 
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight border"
                  :class="plan.days_remaining <= 5 ? 'text-red-600 bg-red-50 border-red-100' : 'text-blue-600 bg-blue-50 border-blue-100'">
              {{ plan.days_remaining }} días para vencimiento
            </span>
          </div>
        </div>
      </div>

      <div class="flex gap-2" v-if="plan">
        <button @click="modal.editPlan = true" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors shadow-sm">Editar Plan</button>
        <button @click="handleBlockPlan" class="px-4 py-2 rounded-lg font-bold text-xs text-white shadow-sm transition-colors" :class="plan.status === 'BLOCKED' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'">
          {{ plan.status === 'BLOCKED' ? 'Activar' : 'Bloquear' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Analizando registros financieros...
    </div>
    
    <div v-else-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-left">
      {{ errorMessage }}
    </div>

    <div v-else-if="plan" class="space-y-6">

      <section class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="flex border-b border-slate-100 bg-slate-50">
          <button 
            @click="activeChartTab = 'PAYMENTS'" 
            :class="activeChartTab === 'PAYMENTS' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'"
            class="px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors"
          >
            Aportes de Capital
          </button>
          <button 
            @click="activeChartTab = 'INTERESTS'" 
            :class="activeChartTab === 'INTERESTS' ? 'border-amber-500 text-amber-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'"
            class="px-6 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors"
          >
            Intereses Devengados
          </button>
        </div>
        
        <div class="p-4 h-80">
          <PaymentHistoryChart v-if="activeChartTab === 'PAYMENTS'" :payments="payments" title="Evolución de Capital Confirmado ($)" />
          <InterestHistoryChart v-if="activeChartTab === 'INTERESTS'" :interests="interests" title="Histórico de Rendimientos Mensuales ($)" />
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="text-left">
          <section class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Configuración Actual</h2>
            <div class="space-y-1">
              <InfoRow label="Modelo" :value="plan.investment_type" />
              <InfoRow label="Ciclo" :value="`${plan.capitalization_period} meses`" />
              <InfoRow label="Frecuencia Pago" :value="plan.payments_period" />
              
              <InfoRow label="Fecha Vencimiento" :value="plan.maturity_date ? new Date(plan.maturity_date).toLocaleDateString() : 'No definida'" />
              
              <InfoRow label="Días Restantes" :value="plan.days_remaining ?? 'N/A'" />
              
              <div class="flex flex-col py-2 border-b border-slate-50">
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Estatus de Renovación</span>
                <span :class="plan.is_ready_for_renewal ? 'text-green-600' : 'text-slate-400'" class="text-sm font-bold">
                  {{ plan.is_ready_for_renewal ? '✓ Listo para renovar' : 'En periodo de espera' }}
                </span>
              </div>

              <div class="pt-4">
                <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estatus del Plan</span>
                <InvestmentStatusBadge :status="plan.status" />
              </div>
            </div>
          </section>
        </div>

        <div class="lg:col-span-2">
          <section class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
            
            <div class="px-2 pt-2 bg-slate-50 border-b border-slate-100 flex gap-2">
              <button 
                @click="activeTableTab = 'PAYMENTS'" 
                :class="activeTableTab === 'PAYMENTS' ? 'bg-white border-slate-200 border-b-transparent text-slate-900 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
                class="px-4 py-2 text-xs font-bold uppercase rounded-t-lg border transition-all translate-y-[1px]"
              >
                Transacciones ({{ payments.length }})
              </button>
              <button 
                @click="activeTableTab = 'INTERESTS'" 
                :class="activeTableTab === 'INTERESTS' ? 'bg-white border-slate-200 border-b-transparent text-slate-900 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
                class="px-4 py-2 text-xs font-bold uppercase rounded-t-lg border transition-all translate-y-[1px]"
              >
                Auditoría de Intereses ({{ interests.length }})
              </button>
            </div>
            
            <div class="overflow-x-auto min-h-[300px]">
              
              <table v-if="activeTableTab === 'PAYMENTS'" class="w-full text-sm">
                <thead class="bg-white text-slate-400 text-[10px] font-bold uppercase border-b border-slate-100">
                  <tr>
                    <th class="px-6 py-3">Monto / Fecha</th>
                    <th class="px-6 py-3 text-center">Estado</th>
                    <th class="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="payments.length === 0">
                    <td colspan="3" class="px-6 py-8 text-center text-slate-400 italic">No hay transacciones registradas.</td>
                  </tr>
                  <tr v-for="pay in payments" :key="pay.id" class="hover:bg-slate-50/50">
                    <td class="px-6 py-4">
                      <div class="font-bold text-slate-900">$ {{ pay.divisa_amount }}</div>
                      <div class="text-[10px] text-slate-400">{{ pay.payment_date }}</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <PaymentStatusBadge :status="pay.status" />
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end gap-1">
                        <button v-if="pay.status === 'PENDING'" @click="handlePaymentAction(pay, 'accept')" class="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Aprobar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></button>
                        <button v-if="pay.status === 'PENDING'" @click="handlePaymentAction(pay, 'reject')" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Rechazar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                        <button v-if="pay.status === 'COMPLETED'" @click="handlePaymentAction(pay, 'refund')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Reembolsar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3"/></svg></button>
                        <button @click="handlePaymentAction(pay, 'edit')" class="p-1.5 text-slate-600 hover:bg-slate-50 rounded" title="Editar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                        <button @click="handlePaymentAction(pay, 'delete')" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Borrar"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                        <router-link :to="{ name: 'PaymentDetailAdmin', params: { id: pay.id } }" class="p-1.5 text-slate-400 hover:text-blue-600" title="Ver Recibo"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></router-link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table v-if="activeTableTab === 'INTERESTS'" class="w-full text-sm">
                <thead class="bg-white text-slate-400 text-[10px] font-bold uppercase border-b border-slate-100">
                  <tr>
                    <th class="px-6 py-3">Periodo (Mes/Año)</th>
                    <th class="px-6 py-3 text-center">Tasa Aplicada</th>
                    <th class="px-6 py-3 text-right">Capital Base</th>
                    <th class="px-6 py-3 text-right">Generado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-if="interests.length === 0">
                    <td colspan="4" class="px-6 py-8 text-center text-slate-400 italic">No se han generado intereses aún.</td>
                  </tr>
                  <tr v-for="int in [...interests].reverse()" :key="int.id" class="hover:bg-slate-50/50">
                    <td class="px-6 py-4">
                      <div class="font-bold text-slate-900">Mes {{ int.periodo_mes }}</div>
                      <div class="text-[10px] text-slate-400">{{ int.periodo_anio }}</div>
                    </td>
                    <td class="px-6 py-4 text-center font-mono text-slate-500">
                      {{ parseFloat(String(int.tasa_aplicada_anual)).toFixed(2) }}%
                    </td>
                    <td class="px-6 py-4 text-right text-slate-600">
                      $ {{ parseFloat(String(int.capital_social_base)).toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 text-right font-bold text-amber-600">
                      + $ {{ parseFloat(String(int.interes_periodo)).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
          </section>
        </div>
      </div>
    </div>

    <EditPlanModal v-if="plan" :show="modal.editPlan" :plan="plan" :isLoading="isActionLoading" @close="modal.editPlan = false" @save="onSavePlan" />
    <EditPaymentModal :show="modal.editPayment" :payment="selectedPayment" :isLoading="isActionLoading" @close="modal.editPayment = false" @save="onSavePayment" />
    <ConfirmModal :show="modal.show" :title="modal.title" :message="modal.message" :type="modal.type" :isLoading="isActionLoading" @confirm="executeAction" @close="modal.show = false" />
  </div>
</template>