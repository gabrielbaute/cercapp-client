<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import useProfile from './Profile';

export default defineComponent({
  name: 'ProfileView',
  setup() {
    const { authStore, refreshProfile } = useProfile();
    
    onMounted(() => {
      refreshProfile(); // Actualiza los datos al entrar
    });

    return { authStore };
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Mi Perfil</h1>
        <p class="text-gray-500 mt-1">Gestiona tu información personal y de contacto.</p>
      </div>
      <router-link to="/profile/edit" class="bg-white border border-gray-200 text-cercapp-navy font-semibold py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        Editar Perfil
      </router-link>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-cercapp-light overflow-hidden">
      
      <div class="h-32 bg-gradient-to-r from-cercapp-navy to-blue-900 relative">
        <div class="absolute -bottom-12 left-8">
          <div class="w-24 h-24 bg-white rounded-full p-1.5 shadow-md">
            <div class="w-full h-full bg-blue-50 text-cercapp-navy rounded-full flex items-center justify-center text-3xl font-bold">
              {{ (authStore.user?.first_name?.[0] || authStore.company?.business_name?.[0] || 'U').toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <div class="pt-16 px-8 pb-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ authStore.isCompany ? authStore.company?.business_name : `${authStore.user?.first_name} ${authStore.user?.last_name}` }}
          </h2>
          <p class="text-cercapp-gold font-semibold text-sm">
            {{ authStore.isAdmin ? 'Administrador' : (authStore.isCompany ? 'Cuenta Corporativa' : 'Inversor Independiente') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          
          <div>
            <p class="text-sm text-gray-500 mb-1">Correo Electrónico</p>
            <p class="font-medium text-gray-900">{{ authStore.user?.email || authStore.company?.email }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Documento de Identidad / RIF</p>
            <p class="font-medium text-gray-900">
              {{ authStore.user?.document_type || authStore.company?.document_type }}-{{ authStore.user?.document_number || authStore.company?.document_number }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-1">Teléfono</p>
            <p class="font-medium text-gray-900">{{ authStore.user?.phone_number || authStore.company?.phone_number || 'No especificado' }}</p>
          </div>

          <div v-if="!authStore.isCompany && authStore.user?.birth_date">
            <p class="text-sm text-gray-500 mb-1">Fecha de Nacimiento</p>
            <p class="font-medium text-gray-900">{{ authStore.user.birth_date }}</p>
          </div>

          <div class="md:col-span-2">
            <p class="text-sm text-gray-500 mb-1">Dirección Registrada</p>
            <p class="font-medium text-gray-900">
              {{ authStore.user?.address || authStore.company?.address || 'Sin dirección registrada en el sistema.' }}
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>