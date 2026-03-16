<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';

export default defineComponent({
  name: 'EditPlanModal',
  props: {
    show: Boolean,
    plan: Object,
    isLoading: Boolean
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const form = reactive({
      plan_name: '',
      payments_period: '' // 'DAILY', 'WEEKLY', etc.
    });

    watch(() => props.plan, (newVal) => {
      if (newVal) {
        form.plan_name = newVal.plan_name;
        form.payments_period = newVal.payments_period;
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
        <h3 class="text-xl font-bold text-slate-900">Editar Plan de Inversión</h3>
      </div>
      
      <div class="p-6 space-y-4 text-left">
        <div>
          <label class="text-xs font-bold text-slate-400 uppercase">Nombre del Plan</label>
          <input v-model="form.plan_name" type="text" class="w-full mt-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
        </div>
        
        <div>
          <label class="text-xs font-bold text-slate-400 uppercase">Frecuencia de Pagos</label>
          <select v-model="form.payments_period" class="w-full mt-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500">
            <option value="DAILY">Diario</option>
            <option value="WEEKLY">Semanal</option>
            <option value="MONTHLY">Mensual</option>
            <option value="QUARTERLY">Trimestral</option>
          </select>
        </div>
      </div>

      <div class="bg-slate-50 p-4 flex gap-3 justify-end">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-semibold text-slate-500">Cancelar</button>
        <button @click="save" :disabled="isLoading" class="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">
          {{ isLoading ? 'Guardando...' : 'Actualizar Plan' }}
        </button>
      </div>

    </div>
    </div>
</template>