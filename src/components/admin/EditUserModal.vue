<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import { COUNTRIES } from '../../utils/countries'; // Importamos la lista centralizada

export default defineComponent({
  name: 'EditUserModal',
  props: {
    show: Boolean,
    user: Object,
    isLoading: Boolean
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    // 1. Estado reactivo ampliado con todos los campos de UserUpdate
    const form = reactive({
      first_name: '',
      middle_name: '',
      last_name: '',
      last_name_2: '',
      birth_date: '',
      document_type: '',
      document_number: '',
      phone_number: '',
      email: '',
      nationality: '',
      country_residence: '',
      status: ''
    });

    // 2. Poblamos el formulario cuando se abre el modal y se recibe el usuario
    watch(() => props.user, (newVal) => {
      if (newVal) {
        form.first_name = newVal.first_name || '';
        form.middle_name = newVal.middle_name || '';
        form.last_name = newVal.last_name || '';
        form.last_name_2 = newVal.last_name_2 || '';
        
        // Manejo de fecha para el input type="date" (YYYY-MM-DD)
        if (newVal.birth_date) {
          form.birth_date = newVal.birth_date.split('T')[0];
        } else {
          form.birth_date = '';
        }

        form.document_type = newVal.document_type || 'V';
        form.document_number = newVal.document_number || '';
        form.phone_number = newVal.phone_number || '';
        form.email = newVal.email || '';
        form.nationality = newVal.nationality || '';
        form.country_residence = newVal.country_residence || '';
        form.status = newVal.status || 'ACTIVE';
      }
    }, { immediate: true });

    return { 
      form, 
      COUNTRIES,
      save: () => emit('save', { ...form }) 
    };
  }
});
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white rounded-3xl shadow-xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
      
      <div class="p-6 border-b border-slate-100 text-left shrink-0">
        <h3 class="text-xl font-bold text-slate-900">Expediente del Usuario (KYC)</h3>
        <p class="text-xs text-slate-500 mt-1">Modifica los datos personales y de contacto del inversor.</p>
      </div>
      
      <div class="p-6 space-y-6 text-left overflow-y-auto custom-scrollbar">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primer Nombre</label>
            <input v-model="form.first_name" type="text" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Segundo Nombre</label>
            <input v-model="form.middle_name" type="text" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primer Apellido</label>
            <input v-model="form.last_name" type="text" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Segundo Apellido</label>
            <input v-model="form.last_name_2" type="text" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="col-span-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo Doc.</label>
            <select v-model="form.document_type" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy">
              <option value="V">V</option>
              <option value="E">E</option>
              <option value="J">J</option>
            </select>
          </div>
          <div class="col-span-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Número</label>
            <input v-model="form.document_number" type="text" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy" />
          </div>
          <div class="col-span-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nacimiento</label>
            <input v-model="form.birth_date" type="date" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nacionalidad</label>
            <select v-model="form.nationality" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy">
              <option value="">No especificada</option>
              <option v-for="country in COUNTRIES" :key="country" :value="country">{{ country }}</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">País de Residencia</label>
            <select v-model="form.country_residence" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy">
              <option value="">No especificado</option>
              <option v-for="country in COUNTRIES" :key="country" :value="country">{{ country }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="col-span-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teléfono</label>
            <input v-model="form.phone_number" type="text" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy" />
          </div>
          <div class="col-span-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
            <input v-model="form.email" type="email" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy" />
          </div>
          <div class="col-span-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acceso</label>
            <select v-model="form.status" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy font-bold">
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="BLOCKED">Bloqueado</option>
            </select>
          </div>
        </div>

      </div>
      <div class="bg-slate-50 p-4 flex gap-3 justify-end border-t border-slate-100 shrink-0">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
        <button @click="save" :disabled="isLoading" class="px-6 py-2 bg-cercapp-navy text-white rounded-xl font-bold text-sm hover:bg-cercapp-navy/90 disabled:opacity-50 transition-colors shadow-sm">
          {{ isLoading ? 'Guardando...' : 'Guardar Expediente' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
</style>