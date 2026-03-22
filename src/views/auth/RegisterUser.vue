<script setup lang="ts">
import { useRegisterUser } from './RegisterUser';
import KYCStep from './KYCStep.vue'; // NUEVO: Importamos el componente
import isologoAzul from '../../assets/img/isologo_azul.png';
import { COUNTRIES } from '../../utils/countries';

const { form, currentStep, isLoading, errorMessage, successMessage, validateAndProceed, submitRegister } = useRegisterUser();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    
    <div class="absolute top-10 left-10 w-96 h-96 bg-cercapp-navy/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-cercapp-gold/10 rounded-full blur-3xl pointer-events-none"></div>

    <div v-if="currentStep === 'FORM'" class="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-6 border border-slate-100 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in">
      
      <div class="text-center shrink-0">
        <img class="mx-auto h-16 w-auto object-contain drop-shadow-sm" :src="isologoAzul" alt="Cercapp Isologo" />
        <h1 class="mt-4 text-3xl font-extrabold text-cercapp-navy tracking-tight">Crear Cuenta</h1>
        <p class="text-slate-500 mt-2 text-sm font-medium">Únete a CercAPP como Inversor Natural</p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border-l-4 border-red-500 shrink-0">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="validateAndProceed" class="space-y-6 mt-6">
        
        <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
          <h3 class="text-xs font-bold text-cercapp-navy uppercase tracking-wider border-b border-slate-200 pb-2">1. Identidad Personal</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primer Nombre *</label>
              <input v-model="form.first_name" type="text" required placeholder="Ej. Juan" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Segundo Nombre</label>
              <input v-model="form.middle_name" type="text" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primer Apellido *</label>
              <input v-model="form.last_name" type="text" required placeholder="Ej. Pérez" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Segundo Apellido</label>
              <input v-model="form.last_name_2" type="text" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo *</label>
              <select v-model="form.document_type" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all">
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="J">J</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Número de Documento *</label>
              <input v-model="form.document_number" type="text" required placeholder="Ej. 12345678" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha de Nacimiento *</label>
            <input v-model="form.birth_date" type="date" required class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
          </div>
        </div>

        <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
          <h3 class="text-xs font-bold text-cercapp-navy uppercase tracking-wider border-b border-slate-200 pb-2">2. Ubicación y Contacto</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nacionalidad *</label>
              <select v-model="form.nationality" required class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all">
                <option value="" disabled>Seleccione...</option>
                <option v-for="country in COUNTRIES" :key="country" :value="country">{{ country }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">País de Residencia *</label>
              <select v-model="form.country_residence" required class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all">
                <option value="" disabled>Seleccione...</option>
                <option v-for="country in COUNTRIES" :key="country" :value="country">{{ country }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono</label>
              <input v-model="form.phone_number" type="text" placeholder="Ej. +584141234567" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico *</label>
              <input v-model="form.email" type="email" required placeholder="tu@correo.com" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
            </div>
          </div>
        </div>

        <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contraseña de Acceso *</label>
          <input v-model="form.password" type="password" required placeholder="Mínimo 8 caracteres" class="appearance-none relative block w-full px-4 py-2 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy bg-white sm:text-sm transition-all" />
        </div>

        <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-cercapp-navy hover:bg-blue-900 transition-all shadow-md mt-8">
          Continuar a Verificación (KYC)
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

    <div v-else class="w-full relative z-10 animate-fade-in flex flex-col items-center">
      
      <div v-if="successMessage" class="mb-4 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border-l-4 border-green-500 shadow-lg animate-bounce">
        {{ successMessage }}
      </div>
      <div v-if="isLoading" class="mb-4 bg-white p-4 rounded-xl text-sm font-bold shadow-lg flex items-center gap-3 text-cercapp-navy">
        <span class="animate-spin h-5 w-5 border-2 border-cercapp-navy border-t-transparent rounded-full"></span>
        Registrando Perfil en Servidor...
      </div>

      <KYCStep 
        @kyc-success="submitRegister('ACTIVE')" 
        @kyc-pending="submitRegister('PENDING_KYC')" 
      />
      
      <button v-if="!isLoading && !successMessage" @click="currentStep = 'FORM'" class="mt-6 text-sm font-bold text-slate-500 hover:text-cercapp-navy transition-colors">
        ← Volver al formulario de registro
      </button>

    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>