<script lang="ts">
import { defineComponent } from 'vue';
import useUserList from './UsersList'; // Asegúrate de que el nombre del archivo coincida
import ConfirmModal from '../../components/common/ConfirmModal.vue';

export default defineComponent({
  name: 'UserList',
  components: { ConfirmModal },
  setup() {
    return { ...useUserList() };
  }
});
</script>

<template>
  <div class="p-6 space-y-6">
    
    <div class="space-y-4 border-b border-slate-100 pb-6 text-left">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Panel Administrativo: Usuarios</h1>
        <p class="text-sm text-slate-500 font-medium italic">Gestión global de cuentas naturales (Límite: 50).</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        <div class="md:col-span-2">
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Buscar por Nombre, Correo o Documento</label>
          <input v-model="filters.search" type="text" placeholder="Ej. Juan Pérez, juan@correo.com..." class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Estado de la Cuenta</label>
          <select v-model="filters.status" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
            <option value="">Todos los Estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
            <option value="BLOCKED">Bloqueados</option>
          </select>
        </div>

      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Cargando datos desde la API...
    </div>

    <div v-else-if="filteredUsers.length === 0" class="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <p class="text-slate-400 italic">No se encontraron usuarios con los criterios de búsqueda.</p>
    </div>
    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
          <tr>
            <th class="px-6 py-4">Nombre / Email</th>
            <th class="px-6 py-4">Documento</th>
            <th class="px-6 py-4 text-center">Estado</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50 transition-colors">
            
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900">{{ user.first_name }} {{ user.last_name }}</div>
              <div class="text-xs text-slate-500">{{ user.email }}</div>
            </td>
            
            <td class="px-6 py-4 text-sm text-slate-600">
              {{ user.document_type }}-{{ user.document_number }}
            </td>
            
            <td class="px-6 py-4 text-center">
              <span :class="{
                'bg-green-100 text-green-700': user.status === 'ACTIVE',
                'bg-red-100 text-red-700': user.status === 'BLOCKED',
                'bg-slate-100 text-slate-700': user.status === 'INACTIVE'
              }" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                {{ user.status }}
              </span>
            </td>
            
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end items-center gap-1">
                
                <router-link :to="{ name: 'UserDetail', params: { id: user.id } }" class="p-2 text-slate-400 hover:text-blue-600" title="Ver Perfil">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </router-link>

                <button v-if="user.status !== 'ACTIVE'" @click="confirmActivate(user)" class="p-2 text-green-500 hover:bg-green-50 rounded" title="Activar">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>

                <button v-if="user.status === 'ACTIVE'" @click="confirmDeactivate(user)" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded" title="Desactivar">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                </button>

                <button v-if="user.status !== 'BLOCKED'" @click="handleStatusAction(user)" class="p-2 text-amber-500 hover:bg-amber-50 rounded" title="Bloquear Acceso">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </button>

                <button @click="confirmDelete(user)" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Eliminar">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>

              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
      <span class="text-sm text-slate-500">Página {{ pagination.page }} de {{ totalPages }}</span>
      <div class="flex gap-2">
        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-50">Anterior</button>
        <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === totalPages" class="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg disabled:opacity-50">Siguiente</button>
      </div>
    </div>

    <ConfirmModal 
      :show="modal.show" 
      :title="modal.title" 
      :message="modal.message" 
      :type="modal.type"
      :isLoading="isActionLoading"
      @confirm="executeAction"
      @close="modal.show = false"
    />
    </div>
</template>