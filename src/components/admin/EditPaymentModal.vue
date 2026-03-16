<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';

export default defineComponent({
  name: 'EditPaymentModal',
  props: {
    show: Boolean,
    payment: Object,
    isLoading: Boolean
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const form = reactive({
      divisa_amount: 0,
      payment_date: '',
      transaction_id: '',
      payment_method: ''
    });

    // Sincronizar formulario cuando el pago cambia
    watch(() => props.payment, (newVal) => {
      if (newVal) {
        form.divisa_amount = newVal.divisa_amount;
        form.payment_date = newVal.payment_date;
        form.transaction_id = newVal.transaction_id;
        form.payment_method = newVal.payment_method;
      }
    }, { immediate: true });

    return { form, save: () => emit('save', { ...form }) };
  }
});
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
      <div class="p-6 border-b border-slate-100 text-left">
        <h3 class="text-xl font-bold text-slate-900">Editar Información de Pago</h3>
      </div>
      
      <div class="p-6 space-y-4 text-left">
        <div>
          <label class="text-xs font-bold text-slate-400 uppercase">Monto Divisa ($)</label>
          <input v-model="form.divisa_amount" type="number" class="w-full mt-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
        </div>
        
        <div>
          <label class="text-xs font-bold text-slate-400 uppercase">Fecha de Pago</label>
          <input v-model="form.payment_date" type="date" class="w-full mt-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
        </div>

        <div>
          <label class="text-xs font-bold text-slate-400 uppercase">ID de Transacción / Referencia</label>
          <input v-model="form.transaction_id" type="text" class="w-full mt-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
        </div>
      </div>

      <div class="bg-slate-50 p-4 flex gap-3 justify-end">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-semibold text-slate-500">Cancelar</button>
        <button @click="save" :disabled="isLoading" class="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">
          {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </div>
    </div>
</template>