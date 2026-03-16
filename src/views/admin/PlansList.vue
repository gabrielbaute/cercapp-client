<script lang="ts">
import { defineComponent } from 'vue';
import usePlansList from './PlansList';
import InvestmentStatusBadge from '../../components/common/InvestmentStatusBadge.vue';
import EditPlanModal from '../../components/admin/EditPlanModal.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';

export default defineComponent({
  name: 'PlansList',
  components: { InvestmentStatusBadge, EditPlanModal, ConfirmModal },
  setup() { return { ...usePlansList() }; }
});
</script>

<template>
  <div class="p-6 space-y-6">

    <div class="space-y-4 border-b border-slate-100 pb-6 text-left">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Auditoría de Inversiones</h1>
        <p class="text-sm text-slate-500 font-medium italic">Gestión global de planes y rendimientos.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Buscar por Correo</label>
          <input v-model="filters.email" type="text" placeholder="ejemplo@correo.com" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Tipo de Plan</label>
          <select v-model="filters.type" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
            <option value="">Todos los Tipos</option>
            <option value="PREMIUM">Premium</option>
            <option value="STANDART">Standart</option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Estado</label>
          <select v-model="filters.status" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
            <option value="">Cualquier Estado</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
            <option value="BLOCKED">Bloqueados</option>
          </select>
        </div>

        <div class="flex flex-col justify-end">
          <button @click="filters.expiringThisMonth = !filters.expiringThisMonth" 
                  :class="filters.expiringThisMonth ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-500 border-slate-200'"
                  class="w-full p-2 rounded-lg text-xs font-bold border transition-all shadow-sm">
            {{ filters.expiringThisMonth ? '✓ Vencen este mes' : 'Vencen este mes?' }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Consultando base de datos...
    </div>

    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <tr>
            <th class="px-6 py-4">Inversionista</th>
            <th class="px-6 py-4">Información del Plan</th>
            <th class="px-6 py-4 text-center">Vencimiento</th>
            <th class="px-6 py-4 text-center">Estado</th>
            <th class="px-6 py-4 text-right">Gestión</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="plan in filteredPlans" :key="plan.id" class="hover:bg-slate-50/50 transition-colors">
            
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900">{{ plan.user_first_name }} {{ plan.user_last_name }}</div>
              <div class="text-[11px] text-slate-400 font-mono">{{ plan.user_email }}</div>
            </td>

            <td class="px-6 py-4">
              <div class="font-bold text-slate-700">{{ plan.plan_name }}</div>
              <div class="flex gap-2 items-center mt-0.5">
                <span class="text-[10px] text-slate-400 font-bold uppercase">{{ plan.investment_type }}</span>
                <span v-if="plan.is_ready_for_renewal" class="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full border border-green-100 font-bold uppercase">Listo Renovar</span>
              </div>
            </td>

            <td class="px-6 py-4 text-center">
              <div class="text-slate-900 font-bold">{{ plan.days_remaining }} <span class="text-[10px] text-slate-400 font-normal">días</span></div>
              <div class="text-[10px] text-slate-400 uppercase">{{ plan.maturity_date ? new Date(plan.maturity_date).toLocaleDateString() : 'N/A' }}</div>
            </td>

            <td class="px-6 py-4 text-center">
              <InvestmentStatusBadge :status="plan.status" />
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-1.5">
                <button @click="handleEdit(plan)" class="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors" title="Editar Configuración">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <router-link :to="{ name: 'InvestmentDetail', params: { id: plan.id } }" class="p-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors" title="Ver Expediente">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EditPlanModal :show="modal.edit" :plan="modal.selectedPlan" :isLoading="isActionLoading" @close="modal.edit = false" @save="onSaveEdit" />
    <ConfirmModal :show="modal.show" :title="modal.title" :message="modal.message" :type="modal.type" :isLoading="isActionLoading" @confirm="executeAction" @close="modal.show = false" />
    </div>
</template>