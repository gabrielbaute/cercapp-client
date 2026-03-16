<script setup lang="ts">
import { useAuthStore } from '../../store/auth.store';
import { useRouter } from 'vue-router';
// Importamos el asset de la imagen para que Vite la procese
import logoSidebar from '../../assets/img/logo_dorado.png';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close-sidebar']);

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <div 
    v-if="isOpen" 
    @click="emit('close-sidebar')"
    class="fixed inset-0 bg-cercapp-navy/50 z-20 md:hidden transition-opacity"
  ></div>

  <aside 
    :class="[
      'fixed inset-y-0 left-0 z-30 w-64 bg-cercapp-navy text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    
    <div class="h-16 flex items-center justify-center border-b border-gray-700/50 shrink-0 px-6 py-2">
      <img :src="logoSidebar" alt="Cercapp Logo" class="h-full w-auto object-contain drop-shadow-md" />
    </div>
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
      
      <template v-if="authStore.isAdmin">
        <p class="px-4 text-xs font-semibold text-cercapp-gold uppercase tracking-wider mb-2 mt-4 first:mt-0">Panel de Control</p>
        
        <router-link to="/admin/users" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Usuarios
        </router-link>

        <router-link to="/admin/companies" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m-5 10v.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01"></path></svg>
          Compañías
        </router-link>

        <router-link to="/admin/plans" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Auditoría de Planes
        </router-link>
        
        <router-link to="/admin/payments" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Auditoría de Pagos
        </router-link>

        <router-link to="/admin/incidences" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Incidencias
        </router-link>
      </template>
      <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 first:mt-0">Principal</p>
      
      <router-link to="/dashboard" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        Dashboard
      </router-link>

      <router-link to="/plans" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        Mis Planes
      </router-link>

      <router-link to="/payments" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
        Mis Pagos
      </router-link>
      <hr class="border-gray-700/50 my-4" />


      <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Herramientas</p>
      
      <router-link to="/calculator" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        Calculadora
      </router-link>

      <router-link to="/incidences" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        Soporte
      </router-link>

      <hr class="border-gray-700/50 my-4" />

      <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mi Cuenta</p>
      
      <router-link to="/profile" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        Perfil
      </router-link>

      <router-link to="/settings" @click="emit('close-sidebar')" class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10" active-class="bg-cercapp-gold text-white font-semibold shadow-md">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        Configuración
      </router-link>

    </nav>
    <div class="p-4 border-t border-gray-700/50 shrink-0">
      <button 
        @click="handleLogout"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Cerrar Sesión
      </button>
    </div>
    </aside>
</template>

<style scoped>
/* Para hacer que el scroll de la barra lateral sea más elegante y delgado */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
</style>