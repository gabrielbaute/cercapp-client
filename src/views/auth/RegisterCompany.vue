<script setup lang="ts">
import { useRegisterCompany } from './RegisterCompany';
import { AppAssets } from '../../utils/assets';

const { form, isLoading, errorMessage, successMessage, submitRegister } = useRegisterCompany();
</script>

<template>
    <div class="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-6 border border-slate-100 relative z-10">
      
      <div class="text-center">
        <img class="mx-auto h-16 w-auto object-contain drop-shadow-sm" :src="AppAssets.isologoAzul" alt="Cercapp Isologo" />
        <h1 class="mt-4 text-3xl font-extrabold text-cercapp-navy tracking-tight">Registro Corporativo</h1>
        <p class="text-slate-500 mt-2 text-sm font-medium">Afilia tu empresa a la red de CercAPP</p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border-l-4 border-red-500">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border-l-4 border-green-500">
        {{ successMessage }}
      </div>

      <form @submit.prevent="submitRegister" class="space-y-5 mt-6">
        
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Razón Social *</label>
          <input 
            v-model="form.business_name" 
            type="text" 
            placeholder="Ej. Inversiones CercAPP C.A."
            class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
            :disabled="isLoading"
          />
        </div>

        <div class="grid grid-cols-3 gap-5">
          <div class="col-span-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo *</label>
            <select 
              v-model="form.document_type"
              class="appearance-none relative block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
              :disabled="isLoading"
            >
              <option value="J">J</option>
              <option value="V">V</option>
              <option value="E">E</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Número de Documento (RIF) *</label>
            <input 
              v-model="form.document_number" 
              type="text" 
              placeholder="Ej. 123456789"
              class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico *</label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="empresa@correo.com"
              class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
              :disabled="isLoading"
            />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono</label>
            <input 
              v-model="form.phone_number" 
              type="text" 
              placeholder="Ej. +584141234567"
              class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contraseña *</label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="Mínimo 8 caracteres"
            class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
            :disabled="isLoading"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-cercapp-navy hover:bg-cercapp-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercapp-navy transition-all shadow-md mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Registrando Empresa...
          </span>
          <span v-else>Registrar Empresa</span>
        </button>

      </form>
      <div class="flex flex-col space-y-3 text-center text-sm pt-4 border-t border-slate-100">
        <router-link to="/login" class="text-slate-500 hover:text-cercapp-navy transition-colors">
          ¿Ya tienes cuenta? <span class="font-bold text-cercapp-navy hover:text-cercapp-gold hover:underline transition-colors">Inicia Sesión</span>
        </router-link>
        
        <router-link to="/register" class="text-slate-500 hover:text-cercapp-navy transition-colors">
          ¿Eres una persona natural? <span class="font-bold text-cercapp-navy hover:text-cercapp-gold hover:underline transition-colors">Regístrate como Usuario</span>
        </router-link>
      </div>

    </div>
</template>