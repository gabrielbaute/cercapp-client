<script lang="ts">
import { defineComponent } from 'vue';
import usePaymentDetail from './PaymentDetail';
import InfoRow from '../../components/common/InfoRow.vue';
import PaymentStatusBadge from '../../components/common/PaymentStatusBadge.vue';
import EditPaymentModal from '../../components/admin/EditPaymentModal.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';

export default defineComponent({
  name: 'PaymentDetail',
  components: { InfoRow, PaymentStatusBadge, EditPaymentModal, ConfirmModal },
  setup() { return { ...usePaymentDetail() }; }
});
</script>

<template>
  <div class="p-6 space-y-6 max-w-5xl mx-auto">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 text-left">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Gestión de Transacción</h1>
          <p class="text-sm text-slate-500" v-if="payment">ID Pago: {{ payment.id }}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2" v-if="payment">
        <button @click="modal.edit = true" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors">Editar Datos</button>
        
        <button v-if="payment.status === 'PENDING'" @click="handleStatusAction('accept')" class="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-xs hover:bg-green-700">Aprobar Pago</button>
        <button v-if="payment.status === 'PENDING'" @click="handleStatusAction('reject')" class="px-4 py-2 bg-amber-500 text-white rounded-lg font-bold text-xs hover:bg-amber-600">Rechazar Pago</button>
        
        <button v-if="payment.status === 'COMPLETED'" @click="handleStatusAction('refund')" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors">Reembolsar</button>
        
        <button @click="handleStatusAction('delete')" class="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold text-xs hover:bg-red-100 transition-colors">Eliminar</button>
      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Cargando información de la transacción...
    </div>
    <div v-else-if="payment" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <section class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Datos de la Transacción</h2>
        <div class="space-y-1">
          <InfoRow label="Monto Divisa" :value="`$ ${payment.divisa_amount}`" />
          <InfoRow label="Monto VES" :value="payment.ves_amount ? `Bs. ${payment.ves_amount}` : 'No aplica'" />
          <InfoRow label="Vía de Pago" :value="payment.payment_method" />
          <InfoRow label="ID / Referencia" :value="payment.transaction_id || 'SIN REFERENCIA'" />
          <div class="pt-4">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1 text-left">Estado del Pago</span>
            <PaymentStatusBadge :status="payment.status" />
          </div>
        </div>
      </section>
      <section class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Auditoría del Sistema</h2>
        <div class="space-y-1">
          <InfoRow label="Fecha Declarada" :value="payment.payment_date" />
          <InfoRow label="Fecha Creación" :value="new Date(payment.created_at).toLocaleString()" />
          <InfoRow label="Fecha Procesado" :value="payment.processed_at ? new Date(payment.processed_at).toLocaleString() : 'PENDIENTE'" />
          <InfoRow label="Última Actualización" :value="new Date(payment.updated_at).toLocaleString()" />
        </div>
      </section>
      </div>


    <EditPaymentModal :show="modal.edit" :payment="payment" :isLoading="isActionLoading" @close="modal.edit = false" @save="onUpdateSave" />
    
    <ConfirmModal :show="modal.show" :title="modal.title" :message="modal.message" :type="modal.type" :isLoading="isActionLoading" @confirm="executeAction" @close="modal.show = false" />
    
    </div>
</template>