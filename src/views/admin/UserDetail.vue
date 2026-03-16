<script lang="ts">
import { defineComponent } from 'vue';
import useUserDetail from './UserDetail';
import InfoRow from '../../components/common/InfoRow.vue';
import PaymentStatusBadge from '../../components/common/PaymentStatusBadge.vue';
import InvestmentStatusBadge from '../../components/common/InvestmentStatusBadge.vue';
import PaymentHistoryChart from '../../components/common/PaymentHistoryChart.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';
import EditPaymentModal from '../../components/admin/EditPaymentModal.vue';
// Importamos el nuevo modal de usuario
import EditUserModal from '../../components/admin/EditUserModal.vue';

export default defineComponent({
  name: 'UserDetail',
  components: { 
    InfoRow, 
    PaymentStatusBadge, 
    InvestmentStatusBadge,
    PaymentHistoryChart,
    ConfirmModal,
    EditPaymentModal,
    EditUserModal
  },
  setup() {
    return { ...useUserDetail() };
  }
});
</script>

<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div class="flex items-center gap-4 text-left">
        <router-link to="/admin/users" class="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Perfil del Usuario</h1>
          <p class="text-sm text-slate-500" v-if="user">{{ user.first_name }} {{ user.last_name }}</p>
        </div>
      </div>

      <div class="flex gap-2" v-if="user">
        <button @click="modal.editUser = true" class="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors shadow-sm">
          Editar Perfil
        </button>
        <button @click="handleUserStatus" 
                class="px-4 py-2 rounded-lg font-bold text-xs text-white transition-colors shadow-sm"
                :class="user.status === 'BLOCKED' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'">
          {{ user.status === 'BLOCKED' ? 'Reactivar Acceso' : 'Bloquear Acceso' }}
        </button>
        <button @click="handleDeleteUser" class="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold text-xs hover:bg-red-100 transition-all">
          Eliminar Usuario
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Consolidando información financiera...
    </div>

    <div v-else-if="user" class="space-y-6">
      
      <section class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 h-80 w-full">
         <PaymentHistoryChart :payments="payments" title="Histórico de Capital Aportado ($)" />
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="space-y-6 text-left">
          <section class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b pb-2">Datos Personales</h2>
            <div class="space-y-1">
              <InfoRow label="Correo Electrónico" :value="user.email" />
              <InfoRow label="Documento" :value="`${user.document_type}-${user.document_number}`" />
              <InfoRow label="Teléfono" :value="user.phone_number || 'No registrado'" />
              <InfoRow label="Nacionalidad" :value="user.nationality" />
              <InfoRow label="Residencia" :value="user.country_residence" />
              
              <div class="pt-4 text-left">
                <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estado de Acceso</span>
                <span :class="user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'" class="font-bold text-sm">
                  ● {{ user.status }}
                </span>
              </div>
            </div>
          </section>
        </div>
        
        <div class="lg:col-span-2 space-y-6">
          
          <section class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 class="font-bold text-slate-900">Planes de Inversión</h3>
              <span class="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">{{ plans.length }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase">
                  <tr>
                    <th class="px-6 py-3">Nombre</th>
                    <th class="px-6 py-3">Tipo / Renovación</th>
                    <th class="px-6 py-3 text-center">Estado</th>
                    <th class="px-6 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="plan in plans" :key="plan.id" class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 font-bold text-slate-700">{{ plan.plan_name }}</td>
                    <td class="px-6 py-4">
                      <div class="text-slate-500">{{ plan.investment_type }}</div>
                      <div v-if="plan.is_ready_for_renewal" class="text-[10px] font-bold text-green-600 uppercase mt-1">✓ Listo para renovación</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <InvestmentStatusBadge :status="plan.status" />
                    </td>
                    <td class="px-6 py-4 text-right">
                      <router-link :to="{ name: 'InvestmentDetail', params: { id: plan.id } }" class="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 font-bold text-xs transition-colors">
                        Gestionar
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 class="font-bold text-slate-900">Historial de Pagos</h3>
              <span class="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">{{ payments.length }}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase">
                  <tr>
                    <th class="px-6 py-3">Monto / Fecha</th>
                    <th class="px-6 py-3 text-center">Estado</th>
                    <th class="px-6 py-3 text-right">Acciones de Gestión</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="payment in payments" :key="payment.id" class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-bold text-slate-900">$ {{ payment.divisa_amount }}</div>
                      <div class="text-[10px] text-slate-400">{{ payment.payment_date }}</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <PaymentStatusBadge :status="payment.status" />
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end gap-1.5">
                        
                        <button v-if="payment.status === 'PENDING'" @click="handlePaymentAction(payment, 'accept')" class="p-1.5 bg-green-50 text-green-600 border border-green-100 rounded-lg hover:bg-green-100 transition-colors" title="Aprobar">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </button>
                        
                        <button v-if="payment.status === 'PENDING'" @click="handlePaymentAction(payment, 'reject')" class="p-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg hover:bg-amber-100 transition-colors" title="Rechazar">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        
                        <button @click="handlePaymentAction(payment, 'edit')" class="p-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors" title="Editar">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        
                        <router-link :to="{ name: 'PaymentDetail', params: { id: payment.id } }" class="p-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors" title="Ver Detalles">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </router-link>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
    <EditUserModal :show="modal.editUser" :user="user" :isLoading="isActionLoading" @close="modal.editUser = false" @save="onSaveUser" />
    <EditPaymentModal :show="modal.editPayment" :payment="selectedPayment" :isLoading="isActionLoading" @close="modal.editPayment = false" @save="onSavePayment" />
    <ConfirmModal :show="modal.show" :title="modal.title" :message="modal.message" :type="modal.type" :isLoading="isActionLoading" @confirm="executeAction" @close="modal.show = false" />
    </div>
</template>