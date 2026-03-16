<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{ show: boolean, currentEmail: string, isLoading: boolean }>();
const emit = defineEmits(['close', 'save']);

const email = ref('');

watch(() => props.show, (isOpen) => {
  if (isOpen) email.value = props.currentEmail;
});
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white rounded-3xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
      <div class="p-6 border-b border-slate-100 text-left">
        <h3 class="text-xl font-bold text-slate-900">Cambiar Correo Electrónico</h3>
        <p class="text-xs text-slate-500 mt-1">Este correo se usará para notificaciones y recuperación de cuenta.</p>
      </div>
      
      <div class="p-6 text-left">
        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nuevo Correo</label>
        <input v-model="email" type="email" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cercapp-navy transition-all text-sm" placeholder="nuevo@correo.com" />
      </div>

      <div class="bg-slate-50 p-4 flex gap-3 justify-end border-t border-slate-100">
        <button @click="emit('close')" class="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancelar</button>
        <button @click="emit('save', email)" :disabled="isLoading || !email" class="px-6 py-2 bg-cercapp-navy text-white rounded-xl font-bold text-sm hover:bg-cercapp-navy/90 disabled:opacity-50">
          {{ isLoading ? 'Guardando...' : 'Actualizar Correo' }}
        </button>
      </div>
    </div>
  </div>
</template>