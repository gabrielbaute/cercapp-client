<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';

const authStore = useAuthStore();
const router = useRouter();

// Definimos los eventos que este componente puede emitir hacia su padre
const emit = defineEmits(['toggle-sidebar']);

// Estado reactivo para la barra de búsqueda
const searchQuery = ref('');

// Función para ejecutar la búsqueda y redirigir
const executeSearch = () => {
  const query = searchQuery.value.trim();
  if (query) {
    // Redirigimos a la vista de resultados pasando el query param
    router.push({ name: 'SearchResults', query: { q: query } });
    // Opcional: limpiar la barra después de buscar
    // searchQuery.value = ''; 
  }
};
</script>

<template>
  <header class="h-16 bg-white border-b border-cercapp-light flex items-center justify-between px-4 sm:px-6 shadow-sm z-10">
    
    <button 
      @click="emit('toggle-sidebar')" 
      class="md:hidden p-2 -ml-2 text-cercapp-navy hover:bg-gray-100 rounded-lg transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
    </button>

    <div class="flex-1 flex justify-center px-4 lg:px-8">
      <div v-if="authStore.isAdmin" class="w-full max-w-lg relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input 
          v-model="searchQuery" 
          @keyup.enter="executeSearch"
          type="text" 
          placeholder="Buscar usuario por nombre, cédula o correo..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:bg-white focus:border-cercapp-navy focus:ring-1 focus:ring-cercapp-navy outline-none transition-all"
        >
      </div>
    </div>
    <div class="flex items-center gap-3 sm:gap-4">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-bold text-cercapp-navy">
          {{ authStore.user?.first_name || authStore.company?.business_name || 'Usuario' }}
        </p>
        <p class="text-xs text-gray-500">
          {{ authStore.isAdmin ? 'Administrador' : (authStore.isCompany ? 'Empresa' : 'Inversor') }}
        </p>
      </div>
      <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cercapp-navy text-cercapp-gold flex items-center justify-center font-bold text-base sm:text-lg">
        {{ (authStore.user?.first_name?.[0] || authStore.company?.business_name?.[0] || 'U').toUpperCase() }}
      </div>
    </div>
    </header>
</template>