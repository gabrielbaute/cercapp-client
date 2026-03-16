<script lang="ts">
import { defineComponent } from 'vue';
import usePaymentsList from './PaymentsList';
import PaymentStatusBadge from '../../components/common/PaymentStatusBadge.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';
import EditPaymentModal from '../../components/admin/EditPaymentModal.vue';

export default defineComponent({
  name: 'PaymentsList',
  components: { PaymentStatusBadge, ConfirmModal, EditPaymentModal },
  setup() { return { ...usePaymentsList() }; }
});
</script>

<template>
  <div class="p-6 space-y-6">

    <div class="space-y-4 border-b border-slate-100 pb-6 text-left">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Auditoría de Pagos</h1>
        <p class="text-sm text-slate-500 font-medium italic">Gestión y conciliación de todas las transacciones del sistema.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Usuario (Email)</label>
          <input v-model="filters.email" type="text" placeholder="Buscar correo..." class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Estado del Pago</label>
          <select v-model="filters.status" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
            <option value="">Todos los Estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="COMPLETED">Completados</option>
            <option value="REJECTED">Rechazados</option>
            <option value="REFUNDED">Reembolsados</option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Método / Vía</label>
          <select v-model="filters.method" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
            <option value="">Cualquier Método</option>
            <option value="TRANSFERENCIA">Transferencia VES</option>
            <option value="PAGO_MOVIL">Pago Móvil</option>
            <option value="ZELLE">Zelle</option>
            <option value="BINANCE">Binance Pay</option>
            <option value="EFECTIVO">Efectivo</option>
          </select>
        </div>

        <div class="flex flex-col justify-end">
          <button @click="filters.thisMonth = !filters.thisMonth" 
                  :class="filters.thisMonth ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-500 border-slate-200'"
                  class="w-full p-2 rounded-lg text-xs font-bold border transition-all shadow-sm">
            {{ filters.thisMonth ? '✓ Pagos de este mes' : 'Pagos de este mes?' }}
          </button>
        </div>

      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Sincronizando transacciones con el servidor...
    </div>

    <div v-else-if="filteredPayments.length === 0" class="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <p class="text-slate-400 italic font-medium">No se encontraron transacciones que coincidan con los filtros.</p>
    </div>
    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <tr>
            <th class="px-6 py-4">Usuario</th>
            <th class="px-6 py-4">Detalle Financiero</th>
            <th class="px-6 py-4 text-center">Referencia</th>
            <th class="px-6 py-4 text-center">Estatus</th>
            <th class="px-6 py-4 text-right">Gestión</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="pay in filteredPayments" :key="pay.id" class="hover:bg-slate-50/50 transition-colors">
            
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900">{{ pay.user_first_name }} {{ pay.user_last_name }}</div>
              <div class="text-[11px] text-slate-400 font-mono">{{ pay.user_email }}</div>
            </td>

            <td class="px-6 py-4">
              <div class="font-bold text-green-700 text-base">$ {{ pay.divisa_amount }}</div>
              <div class="flex gap-2 items-center mt-0.5">
                <span class="text-[10px] text-slate-500 font-medium">{{ pay.payment_date }}</span>
                <span class="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ pay.payment_method }}</span>
              </div>
            </td>

            <td class="px-6 py-4 text-center">
              <div class="text-slate-900 font-mono text-xs">{{ pay.transaction_id || 'N/A' }}</div>
            </td>

            <td class="px-6 py-4 text-center">
              <PaymentStatusBadge :status="pay.status" />
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-1.5">
                
                <button v-if="pay.status === 'PENDING'" @click="handlePaymentAction(pay, 'accept')" class="p-2 bg-green-50 text-green-600 border border-green-100 rounded-lg hover:bg-green-100 transition-colors" title="Aprobar Transacción">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </button>
                
                <button v-if="pay.status === 'PENDING'" @click="handlePaymentAction(pay, 'reject')" class="p-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg hover:bg-amber-100 transition-colors" title="Rechazar Transacción">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                
                <button v-if="pay.status === 'COMPLETED'" @click="handlePaymentAction(pay, 'refund')" class="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors" title="Reembolsar Capital">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3"/></svg>
                </button>

                <button @click="handlePaymentAction(pay, 'edit')" class="p-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors" title="Corregir Datos">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>

                <button @click="handlePaymentAction(pay, 'delete')" class="p-2 bg-red-50 text-red-400 border border-red-100 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors" title="Borrar Permanentemente">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>

                <router-link :to="{ name: 'PaymentDetail', params: { id: pay.id } }" class="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors" title="Ver Expediente">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </router-link>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <button @click="changePage(pagination.page - 1)" 
              :disabled="pagination.page === 1" 
              class="px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs transition-colors">
        Anterior
      </button>
      <span class="text-sm text-slate-500 font-medium">Página {{ pagination.page }} de {{ totalPages }}</span>
      <button @click="changePage(pagination.page + 1)" 
              :disabled="pagination.page === totalPages" 
              class="px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs transition-colors">
        Siguiente
      </button>
    </div>
    <EditPaymentModal :show="modal.editPayment" :payment="selectedPayment" :isLoading="isActionLoading" @close="modal.editPayment = false" @save="onSavePayment" />
    <ConfirmModal :show="modal.show" :title="modal.title" :message="modal.message" :type="modal.type" :isLoading="isActionLoading" @confirm="executeAction" @close="modal.show = false" />
    </div>
</template>