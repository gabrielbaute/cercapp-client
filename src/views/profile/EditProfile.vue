<script lang="ts">
import { defineComponent } from 'vue';
import useEditProfile from './EditProfile';

export default defineComponent({
  name: 'EditProfileView',
  setup() {
    return { ...useEditProfile() };
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    
    <div class="flex items-center gap-4">
      <router-link to="/profile" class="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-cercapp-navy hover:bg-gray-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Editar Perfil</h1>
        <p class="text-gray-500 mt-1">Actualiza tu información personal y de contacto.</p>
      </div>
    </div>

    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-cercapp-light">
      
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitUpdate" class="space-y-8">
        
        <div>
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Información de la Cuenta</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico (No editable)</label>
              <input type="text" :value="immutableData.email" disabled class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">Documento Identidad (No editable)</label>
              <input type="text" :value="`${immutableData.document_type}-${immutableData.document_number}`" disabled class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Datos Principales</h3>
          
          <div v-if="authStore.isCompany" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-cercapp-navy mb-1">Razón Social</label>
              <input v-model="form.business_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-cercapp-navy mb-1">Página Web (Opcional)</label>
              <input v-model="form.website" type="url" placeholder="https://" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" />
            </div>
          </div>

        <div v-else class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-cercapp-navy mb-1">Primer Nombre *</label>
                <input v-model="form.first_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" required />
              </div>
              <div>
                <label class="block text-sm font-bold text-cercapp-navy mb-1">Segundo Nombre</label>
                <input v-model="form.middle_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" />
              </div>
              <div>
                <label class="block text-sm font-bold text-cercapp-navy mb-1">Primer Apellido *</label>
                <input v-model="form.last_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" required />
              </div>
              <div>
                <label class="block text-sm font-bold text-cercapp-navy mb-1">Segundo Apellido</label>
                <input v-model="form.second_last_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label class="block text-sm font-bold text-cercapp-navy mb-1">Nacionalidad</label>
                <input v-model="form.nationality" type="text" placeholder="Ej. Venezolana" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" />
              </div>
              <div>
                <label class="block text-sm font-bold text-cercapp-navy mb-1">País de Residencia</label>
                <input v-model="form.country_of_residence" type="text" placeholder="Ej. Venezuela" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" />
              </div>
              <div>
                <label class="block text-sm font-bold text-cercapp-navy mb-1">Fecha de Nacimiento *</label>
                <input v-model="form.birth_date" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" required />
              </div>
            </div>

          </div>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Datos de Contacto</h3>
          <div class="grid grid-cols-1 gap-6">
            <div class="md:w-1/2">
              <label class="block text-sm font-bold text-cercapp-navy mb-1">Número de Teléfono</label>
              <input v-model="form.phone_number" type="tel" placeholder="+584121234567" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isLoading" />
            </div>
            <div>
              <label class="block text-sm font-bold text-cercapp-navy mb-1">Dirección de Domicilio / Fiscal</label>
              <textarea v-model="form.address" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none resize-none" :disabled="isLoading"></textarea>
            </div>
          </div>
        </div>

        <hr class="border-cercapp-light my-6" />

        <div class="flex justify-end gap-3">
          <router-link to="/profile" class="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </router-link>
          <button type="submit" :disabled="isLoading" class="bg-cercapp-navy hover:bg-blue-900 text-white font-semibold py-2 px-8 rounded-lg transition-colors flex items-center justify-center min-w-[150px]">
            <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else>Guardar Cambios</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>