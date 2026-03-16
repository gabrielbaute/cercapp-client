<script setup lang="ts">
import { useRegisterUser } from './RegisterUser';
import isologoAzul from '../../assets/img/isologo_azul.png';
import { COUNTRIES } from '../../utils/countries';

const { form, isLoading, errorMessage, successMessage, submitRegister } = useRegisterUser();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    
    <div class="absolute top-10 left-10 w-96 h-96 bg-cercapp-navy/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-cercapp-gold/10 rounded-full blur-3xl"></div>

    <div class="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-6 border border-slate-100 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
      
      <div class="text-center shrink-0">
        <img class="mx-auto h-16 w-auto object-contain drop-shadow-sm" :src="isologoAzul" alt="Cercapp Isologo" />
        <h1 class="mt-4 text-3xl font-extrabold text-cercapp-navy tracking-tight">Crear Cuenta</h1>
        <p class="text-slate-500 mt-2 text-sm font-medium">Únete a CercAPP como Inversor Natural</p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border-l-4 border-red-500 shrink-0">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border-l-4 border-green-500 shrink-0">
        {{ successMessage }}
      </div>

      <form @submit.prevent="submitRegister" class="space-y-6 mt-6">
        
        <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
          <h3 class="text-xs font-bold text-cercapp-navy uppercase tracking-wider border-b border-slate-200 pb-2">1. Identidad Personal</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primer Nombre *</label>
              <input v-model="form.first_name" type="text" required placeholder="Ej. Juan" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Segundo Nombre</label>
              <input v-model="form.middle_name" type="text" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primer Apellido *</label>
              <input v-model="form.last_name" type="text" required placeholder="Ej. Pérez" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Segundo Apellido</label>
              <input v-model="form.last_name_2" type="text" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo *</label>
              <select v-model="form.document_type" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading">
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="J">J</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Número de Documento *</label>
              <input v-model="form.document_number" type="text" required placeholder="Ej. 12345678" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha de Nacimiento *</label>
            <input v-model="form.birth_date" type="date" required class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
          </div>
        </div>

        <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
          <h3 class="text-xs font-bold text-cercapp-navy uppercase tracking-wider border-b border-slate-200 pb-2">2. Ubicación y Contacto</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nacionalidad *</label>
              <select v-model="form.nationality" required class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading">
                <option value="" disabled>Seleccione...</option>
                <option v-for="country in COUNTRIES" :key="country" :value="country">{{ country }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">País de Residencia *</label>
              <select v-model="form.country_residence" required class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading">
                <option value="" disabled>Seleccione...</option>
                <option v-for="country in COUNTRIES" :key="country" :value="country">{{ country }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono</label>
              <input v-model="form.phone_number" type="text" placeholder="Ej. +584141234567" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico *</label>
              <input v-model="form.email" type="email" required placeholder="tu@correo.com" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
            </div>
          </div>
        </div>

        <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contraseña de Acceso *</label>
          <input v-model="form.password" type="password" required placeholder="Mínimo 8 caracteres" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" :disabled="isLoading" />
        </div>

        <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-cercapp-navy hover:bg-cercapp-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercapp-navy transition-all shadow-md mt-8 disabled:opacity-70 disabled:cursor-not-allowed">
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Procesando Registro...
          </span>
          <span v-else>Crear Perfil Financiero</span>
        </button>

      </form>
      <div class="flex flex-col space-y-3 text-center text-sm pt-4 border-t border-slate-100 shrink-0">
        <router-link to="/login" class="text-slate-500 hover:text-cercapp-navy transition-colors">
          ¿Ya tienes cuenta? <span class="font-bold text-cercapp-navy hover:text-cercapp-gold hover:underline transition-colors">Inicia Sesión</span>
        </router-link>
        
        <router-link to="/register/company" class="text-slate-500 hover:text-cercapp-navy transition-colors">
          ¿Eres una empresa aliada? <span class="font-bold text-cercapp-navy hover:text-cercapp-gold hover:underline transition-colors">Regístrate aquí</span>
        </router-link>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
</style>