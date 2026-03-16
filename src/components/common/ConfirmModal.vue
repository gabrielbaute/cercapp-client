<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConfirmModal',
  props: {
    show: { type: Boolean, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    confirmText: { type: String, default: 'Confirmar' },
    type: { type: String, default: 'info' }, // danger, warning, info
    isLoading: { type: Boolean, default: false }
  },
  emits: ['confirm', 'close'],
  setup(props, { emit }) {
    return {
      onConfirm: () => emit('confirm'),
      onClose: () => emit('close')
    };
  }
});
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
      <div class="p-6">
        <h3 class="text-xl font-bold text-slate-900 mb-2">{{ title }}</h3>
        <p class="text-slate-600 leading-relaxed">{{ message }}</p>
      </div>
      <div class="bg-slate-50 p-4 flex gap-3 justify-end border-t border-slate-100">
        <button @click="onClose" :disabled="isLoading" class="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          Cancelar
        </button>
        <button 
          @click="onConfirm" 
          :disabled="isLoading"
          class="px-6 py-2 text-sm font-bold text-white rounded-lg transition-all flex items-center gap-2"
          :class="{
            'bg-red-600 hover:bg-red-700': type === 'danger',
            'bg-amber-500 hover:bg-amber-600': type === 'warning',
            'bg-slate-900 hover:bg-slate-800': type === 'info'
          }"
        >
          <span v-if="isLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ isLoading ? 'Procesando...' : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>