<script lang="ts">
import { defineComponent } from 'vue';
import useCreateIncidence from './CreateIncidence';

export default defineComponent({
  name: 'CreateIncidenceView',
  setup() {
    return { ...useCreateIncidence() };
  }
});
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    
    <div class="flex items-center gap-4">
      <router-link to="/incidences" class="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-cercapp-navy hover:bg-gray-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Reportar Problema</h1>
        <p class="text-gray-500 mt-1">Nuestro equipo de soporte te responderá pronto.</p>
      </div>
    </div>

    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-cercapp-light">
      
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitIncidence" class="space-y-6">
        
        <div>
          <label class="block text-sm font-bold text-cercapp-navy mb-1">Descripción de la incidencia *</label>
          <p class="text-xs text-gray-500 mb-2">Explica detalladamente qué ocurrió o cuál es tu consulta.</p>
          <textarea 
            v-model="content" 
            rows="5"
            placeholder="Ej. Realicé un pago ayer pero aún aparece como pendiente..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none resize-none"
            :disabled="isLoading"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-bold text-cercapp-navy mb-1">Evidencia Adjunta (Opcional)</label>
          <p class="text-xs text-gray-500 mb-2">Puedes adjuntar una captura de pantalla (JPG, PNG) o un PDF. Máx 5MB.</p>
          
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
            <div class="space-y-1 text-center">
              <svg v-if="!selectedFile" class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              
              <svg v-else class="mx-auto h-12 w-12 text-cercapp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              
              <div class="flex text-sm text-gray-600 justify-center">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-cercapp-navy hover:text-blue-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cercapp-gold">
                  <span>{{ selectedFile ? 'Cambiar archivo' : 'Sube un archivo' }}</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileChange" :disabled="isLoading" accept="image/png, image/jpeg, application/pdf">
                </label>
              </div>
              <p v-if="selectedFile" class="text-xs text-cercapp-navy font-bold mt-2">{{ selectedFile.name }}</p>
              <p v-else class="text-xs text-gray-500 mt-2">PNG, JPG, PDF hasta 5MB</p>
            </div>
          </div>
        </div>

        <hr class="border-cercapp-light my-6" />

        <div class="flex justify-end gap-3">
          <router-link to="/incidences" class="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </router-link>
          <button type="submit" :disabled="isLoading" class="bg-cercapp-navy hover:bg-blue-900 text-white font-semibold py-2 px-8 rounded-lg transition-colors flex items-center justify-center min-w-[150px]">
            <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else>Enviar Ticket</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>