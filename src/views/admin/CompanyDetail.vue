<script lang="ts">
import { defineComponent } from 'vue';
import useCompanyDetail from './CompanyDetail';
import InfoRow from '../../components/common/InfoRow.vue';

export default defineComponent({
  name: 'CompanyDetail',
  components: { InfoRow },
  setup() { return { ...useCompanyDetail() }; }
});
</script>

<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 text-left">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div v-if="company">
          <h1 class="text-2xl font-bold text-slate-900">{{ company.company_name || company.name || 'Expediente Empresarial' }}</h1>
          <p class="text-sm text-slate-500 font-mono">ID: {{ company.id }}</p>
        </div>
      </div>
      
      <div v-if="company" class="flex gap-2">
        <span :class="company.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : (company.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700')" class="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider">
          ESTADO: {{ company.status || 'DESCONOCIDO' }}
        </span>
      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Recuperando información de la empresa...
    </div>

    <div v-else-if="errorMessage" class="py-20 text-center">
      <div class="bg-red-50 text-red-600 p-6 rounded-2xl inline-block border border-red-100">
        <p class="font-bold mb-2">{{ errorMessage }}</p>
        <button @click="$router.back()" class="text-sm underline">Volver al directorio</button>
      </div>
    </div>
    <div v-else-if="company" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="space-y-6 text-left">
        <section class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Información Fiscal</h2>
          <div class="space-y-1">
            <InfoRow label="Razón Social" :value="company.company_name || company.name || 'No especificado'" />
            <InfoRow label="Documento Fiscal (RIF)" :value="company.document_number || company.tax_id || 'No registrado'" />
            <InfoRow label="Correo de Contacto" :value="company.email" />
            <InfoRow label="Teléfono" :value="company.phone_number || 'No especificado'" />
            <InfoRow label="País de Registro" :value="company.country || company.country_residence || 'No especificado'" />
            <InfoRow label="Fecha de Registro" :value="new Date(company.created_at).toLocaleDateString()" />
          </div>
        </section>
      </div>
      <div class="lg:col-span-2">
        <section class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left h-full">
          <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 class="font-bold text-slate-900">Personal y Usuarios Afiliados</h3>
            <span class="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">{{ users.length }} usuarios</span>
          </div>
          
          <div v-if="users.length === 0" class="p-10 text-center text-slate-400 italic">
            No hay usuarios registrados bajo esta empresa.
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th class="px-6 py-3">Nombre del Usuario</th>
                  <th class="px-6 py-3">Documento</th>
                  <th class="px-6 py-3 text-center">Estado</th>
                  <th class="px-6 py-3 text-right">Ver Perfil</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors">
                  
                  <td class="px-6 py-4">
                    <div class="font-bold text-slate-900">{{ user.first_name }} {{ user.last_name }}</div>
                    <div class="text-[11px] text-slate-400 font-mono">{{ user.email }}</div>
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-slate-700 font-mono font-medium">{{ user.document_type }}-{{ user.document_number }}</div>
                  </td>

                  <td class="px-6 py-4 text-center">
                    <span :class="user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'" class="text-[10px] font-bold uppercase">
                      ● {{ user.status }}
                    </span>
                  </td>

                  <td class="px-6 py-4 text-right">
                    <router-link :to="{ name: 'UserDetail', params: { id: user.id } }" class="p-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors inline-block" title="Ir al Perfil del Usuario">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </router-link>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      </div>
    </div>
</template>