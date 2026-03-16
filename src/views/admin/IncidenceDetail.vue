<script lang="ts">
import { defineComponent } from 'vue';
import useIncidenceDetail from './IncidenceDetail';
import InfoRow from '../../components/common/InfoRow.vue';
import IncidenceStatusBadge from '../../components/common/IncidenceStatusBadge.vue';

export default defineComponent({
  name: 'IncidenceDetail',
  components: { InfoRow, IncidenceStatusBadge },
  setup() { return { ...useIncidenceDetail() }; }
});
</script>

<template>
  <div class="p-6 space-y-6 max-w-6xl mx-auto">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 text-left">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Expediente de Incidencia</h1>
          <p class="text-sm text-slate-500 font-mono" v-if="incidence">Ticket ID: {{ incidence.id }}</p>
        </div>
      </div>

      <div v-if="incidence">
        <button @click="openProcessModal" class="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm shadow-sm hover:bg-slate-800 transition-all">
          Procesar Ticket
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Cargando expediente del ticket...
    </div>
    <div v-else-if="incidence" class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      
      <div class="space-y-6">
        
        <section class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Datos del Remitente</h2>
          <div class="space-y-1">
            <InfoRow label="Nombre" :value="`${incidence.user_first_name} ${incidence.user_last_name}`" />
            <InfoRow label="Documento" :value="incidence.user_document_number || 'N/A'" />
            <InfoRow label="Correo Electrónico" :value="incidence.user_email" />
            <InfoRow label="Fecha de Emisión" :value="new Date(incidence.created_at).toLocaleString()" />
            <div class="pt-4">
              <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Estatus Actual</span>
              <IncidenceStatusBadge :status="incidence.status" />
            </div>
          </div>
        </section>

        <section class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Descripción del Problema</h2>
          <p class="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">{{ incidence.content }}</p>
        </section>

        <section v-if="incidence.admin_comment" class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h2 class="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Respuesta de Administración
          </h2>
          <p class="text-blue-900 whitespace-pre-wrap text-sm leading-relaxed">{{ incidence.admin_comment }}</p>
          <div class="mt-4 text-[10px] text-blue-400 font-bold uppercase" v-if="incidence.processed_at">
            Procesado el: {{ new Date(incidence.processed_at).toLocaleString() }}
          </div>
        </section>

      </div>
      <div class="h-full">
        <section class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
          <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Evidencia Adjunta</h2>
          
          <div class="flex-1 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center relative min-h-[300px]">
            
            <div v-if="!imageUrl" class="text-center text-slate-400">
              <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <p class="text-sm font-medium">Sin archivo adjunto</p>
            </div>

            <div v-else-if="imageHasError" class="text-center text-red-400">
              <svg class="w-12 h-12 mx-auto mb-2 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <p class="text-sm font-medium">El archivo no pudo ser cargado o no es una imagen válida.</p>
              <a :href="imageUrl" target="_blank" class="text-xs text-blue-500 hover:underline mt-2 inline-block">Intentar abrir directamente</a>
            </div>

            <img v-else :src="imageUrl" @error="onImageError" alt="Evidencia de la incidencia" class="w-full h-full object-contain" />
            
          </div>
        </section>
      </div>
      </div>


    <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        <div class="p-6 border-b border-slate-100 text-left">
          <h3 class="text-xl font-bold text-slate-900">Procesar Ticket de Soporte</h3>
        </div>
        
        <div class="p-6 space-y-4 text-left">
          
          <div>
            <label class="text-xs font-bold text-slate-400 uppercase">Actualizar Estado</label>
            <select v-model="modal.status" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 font-medium">
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En Revisión (En progreso)</option>
              <option value="RESOLVED">Resuelta (Cerrada)</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-bold text-slate-400 uppercase">Respuesta Oficial (Comentario de Admin)</label>
            <textarea v-model="modal.admin_comment" rows="4" placeholder="Escribe la respuesta o resolución del caso aquí..." class="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"></textarea>
            <p class="text-[10px] text-slate-400 mt-1">Este comentario será visible en el registro de resolución.</p>
          </div>

        </div>

        <div class="bg-slate-50 p-4 flex gap-3 justify-end">
          <button @click="closeProcessModal" class="px-4 py-2 text-sm font-semibold text-slate-500">Cancelar</button>
          <button @click="saveProcess" :disabled="isActionLoading" class="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 disabled:opacity-50">
            {{ isActionLoading ? 'Guardando...' : 'Guardar y Procesar' }}
          </button>
        </div>
      </div>
    </div>
    </div>
</template>