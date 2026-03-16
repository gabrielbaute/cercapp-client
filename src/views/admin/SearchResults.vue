<script lang="ts">
import { defineComponent } from 'vue';
// Añadimos las llaves {} y especificamos que es el archivo .ts
import { useSearchResults } from './SearchResults'; 

export default defineComponent({
  name: 'SearchResults',
  setup() { 
    return { ...useSearchResults() }; 
  }
});
</script>

<template>
  <div class="p-6 space-y-6 max-w-5xl mx-auto">
    
    <div class="border-b border-slate-100 pb-6 text-left">
      <h1 class="text-2xl font-bold text-slate-900">Resultados de la búsqueda</h1>
      <p class="text-sm text-slate-500 font-medium mt-1">
        Buscando coincidencias para: <span class="text-blue-600 font-bold px-2 py-0.5 bg-blue-50 rounded-md">"{{ searchQuery }}"</span>
      </p>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Rastreando la base de datos...
    </div>

    <div v-else-if="filteredResults.length === 0" class="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <p class="text-slate-500 font-medium">No se encontraron usuarios que coincidan con "{{ searchQuery }}".</p>
      <p class="text-xs text-slate-400 mt-1">Verifica el número de cédula o correo e intenta nuevamente.</p>
    </div>
    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
      
      <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-900">Usuarios Encontrados</h3>
        <span class="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">{{ filteredResults.length }} coincidencias</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th class="px-6 py-3">Nombre / Email</th>
              <th class="px-6 py-3">Identificación</th>
              <th class="px-6 py-3 text-center">Estado</th>
              <th class="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in filteredResults" :key="user.id" class="hover:bg-slate-50/50 transition-colors">
              
              <td class="px-6 py-4">
                <div class="font-bold text-slate-900">{{ user.first_name }} {{ user.last_name }}</div>
                <div class="text-[11px] text-slate-400 font-mono">{{ user.email }}</div>
              </td>

              <td class="px-6 py-4">
                <div class="text-slate-700 font-mono font-medium">{{ user.document_type }}-{{ user.document_number }}</div>
              </td>

              <td class="px-6 py-4 text-center">
                <span :class="user.status === 'ACTIVE' ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border">
                  {{ user.status }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <router-link :to="{ name: 'UserDetail', params: { id: user.id } }" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 font-bold text-xs transition-colors">
                  Ir al Perfil
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </router-link>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
</template>