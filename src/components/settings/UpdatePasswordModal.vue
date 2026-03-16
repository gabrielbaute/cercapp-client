<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{ show: boolean, isLoading: boolean }>();
const emit = defineEmits(['close', 'save']);

const password = ref('');
const confirmPassword = ref('');
const error = ref('');

watch(() => props.show, (isOpen) => {
  if (isOpen) { password.value = ''; confirmPassword.value = ''; error.value = ''; }
});

const handleSave = () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }
  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres.';
    return;
  }
  emit('save', password.value);
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white rounded-3xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
      <div class="p-6 border-b border-slate-100 text-left">
        <h3 class="text-xl font-bold text-slate-900">Cambiar Contraseña</h3>
        <p class="text-xs text-slate-500 mt-1">Asegúrate de usar una contraseña fuerte y no compartirla.</p>
      </div>
      
      <div class="p-6 space-y-4 text-left">
        <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">{{ error }}</div>
        
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nueva Contraseña</label>
          <input v-model="password" type="password" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cercapp-navy text-sm" placeholder="••••••••" />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirmar Contraseña</label>
          <input v-model="confirmPassword" type="password" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cercapp-navy text-sm" placeholder="••••••••" />
        </div>
      </div>

      <div class="bg-slate-50 p-4 flex gap-3 justify-end border-t border-slate-100">
        <button @click="emit('close')" class="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancelar</button>
        <button @click="handleSave" :disabled="isLoading || !password || !confirmPassword" class="px-6 py-2 bg-cercapp-navy text-white rounded-xl font-bold text-sm hover:bg-cercapp-navy/90 disabled:opacity-50">
          {{ isLoading ? 'Guardando...' : 'Actualizar Contraseña' }}
        </button>
      </div>
    </div>
  </div>
</template>