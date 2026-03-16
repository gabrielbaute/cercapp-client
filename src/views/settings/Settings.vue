<script lang="ts">
import { defineComponent } from 'vue';
import { useSettings } from './Settings';
import UpdateEmailModal from '../../components/settings/UpdateEmailModal.vue';
import UpdatePasswordModal from '../../components/settings/UpdatePasswordModal.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue'; // Nuestro modal reusable del Danger Zone

export default defineComponent({
  name: 'Settings',
  components: { UpdateEmailModal, UpdatePasswordModal, ConfirmModal },
  setup() { return { ...useSettings() }; }
});
</script>

<template>
  <div class="p-6 space-y-6 max-w-4xl mx-auto">

    <div class="border-b border-slate-100 pb-6 text-left">
      <h1 class="text-2xl font-bold text-slate-900">Configuración de la Cuenta</h1>
      <p class="text-sm text-slate-500 font-medium mt-1">Gestiona tu acceso, seguridad y preferencias de CercAPP.</p>
    </div>

    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Cargando preferencias...
    </div>

    <div v-else-if="user" class="space-y-8 text-left">
      
      <section class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 class="text-sm font-bold text-cercapp-navy uppercase tracking-widest">Seguridad y Acceso</h2>
        </div>
        
        <div class="divide-y divide-slate-100">
          
          <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div>
              <p class="text-sm font-bold text-slate-900">Correo Electrónico</p>
              <p class="text-sm text-slate-500 mt-0.5">{{ user.email }}</p>
            </div>
            <button @click="modals.email = true" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors shadow-sm shrink-0">
              Cambiar Correo
            </button>
          </div>

          <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div>
              <p class="text-sm font-bold text-slate-900">Contraseña</p>
              <p class="text-sm text-slate-500 mt-0.5">••••••••••••</p>
              <p class="text-[10px] text-slate-400 mt-1">Última actualización: Desconocida</p>
            </div>
            <button @click="modals.password = true" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors shadow-sm shrink-0">
              Cambiar Contraseña
            </button>
          </div>

        </div>
      </section>

      <section class="bg-white rounded-3xl shadow-sm border border-red-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-red-100 bg-red-50/50 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <h2 class="text-sm font-bold text-red-700 uppercase tracking-widest">Zona de Peligro</h2>
        </div>
        
        <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-red-50/10">
          <div>
            <p class="text-sm font-bold text-slate-900">Desactivar Cuenta</p>
            <p class="text-sm text-slate-500 mt-0.5 max-w-xl">
              Al desactivar tu cuenta perderás el acceso a la plataforma. Esta acción suspenderá tus credenciales inmediatamente. Para reactivarla, deberás comunicarte con soporte técnico.
            </p>
          </div>
          <button @click="confirmDeactivate" class="px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors shadow-sm shrink-0">
            Desactivar mi Cuenta
          </button>
        </div>
      </section>

    </div>

    <UpdateEmailModal 
      :show="modals.email" 
      :currentEmail="user?.email || ''" 
      :isLoading="isActionLoading" 
      @close="modals.email = false" 
      @save="updateEmail" 
    />
    
    <UpdatePasswordModal 
      :show="modals.password" 
      :isLoading="isActionLoading" 
      @close="modals.password = false" 
      @save="updatePassword" 
    />

    <ConfirmModal 
      :show="modals.deactivate" 
      title="Desactivar Cuenta Definitivamente" 
      message="¿Estás seguro de que deseas darte de baja? Perderás el acceso a tu portafolio y tu sesión se cerrará de inmediato." 
      type="danger" 
      :isLoading="isActionLoading" 
      @confirm="executeDeactivation" 
      @close="modals.deactivate = false" 
    />
    
  </div>
</template>