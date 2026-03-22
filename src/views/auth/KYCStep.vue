<script lang="ts">
import { defineComponent } from 'vue';
import useKYCStep from './KYCStep';

export default defineComponent({
  name: 'KYCStep',
  // Emitimos un evento de éxito para que el componente padre (RegisterUser) sepa que ya puede registrar al usuario
  emits: ['kyc-success', 'kyc-pending'],
  setup(props, { emit }) {
    
    // El callback que se ejecutará cuando la distancia euclidiana sea < 0.6
    const handleSuccess = () => {
      emit('kyc-success');
    };

    return { ...useKYCStep(handleSuccess) };
  }
});
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center relative overflow-hidden">
    
    <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cercapp-navy to-cercapp-gold"></div>

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-cercapp-navy">Verificación de Identidad</h2>
      <p class="text-sm text-slate-500 mt-1">
        {{ step === 1 ? 'Paso 1: Documento de Identidad' : step === 2 ? 'Paso 2: Reconocimiento Facial' : 'Paso 3: Auditoría Biométrica' }}
      </p>
    </div>

    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold text-left flex flex-col gap-2">
      <div class="flex gap-3 items-start">
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>{{ errorMessage }}</span>
      </div>
      <button @click="$emit('kyc-pending')" class="mt-2 text-xs font-extrabold uppercase tracking-wide text-cercapp-navy hover:underline self-end">
        Omitir y verificar más tarde →
      </button>
    </div>

    <div v-show="step === 1" class="space-y-6 animate-fade-in">
      <p class="text-sm text-slate-600">Sube una fotografía clara y legible de tu cédula, pasaporte o documento de registro.</p>
      
      <label class="block w-full cursor-pointer">
        <div v-if="!documentUrl" class="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-slate-50 hover:border-cercapp-gold transition-colors">
          <svg class="w-10 h-10 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span class="text-sm font-bold text-cercapp-navy">Seleccionar Archivo</span>
        </div>
        
        <div v-else class="relative rounded-2xl overflow-hidden border-2 border-cercapp-navy shadow-inner group">
          <img ref="documentImageRef" :src="documentUrl" class="w-full h-48 object-cover" alt="Documento cargado" crossorigin="anonymous" />
          <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-white font-bold text-sm">Cambiar Imagen</span>
          </div>
        </div>
        <input type="file" accept="image/*" class="hidden" @change="handleDocumentUpload" />
      </label>

      <button 
        @click="confirmDocument" 
        :disabled="!documentUrl"
        class="w-full py-3 rounded-xl font-bold transition-all shadow-sm"
        :class="documentUrl ? 'bg-cercapp-navy text-white hover:bg-blue-900' : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
      >
        Continuar a Reconocimiento Facial
      </button>
    </div>

    <div v-show="step === 2" class="space-y-6 animate-fade-in">
      <p class="text-sm text-slate-600">Por seguridad, necesitamos confirmar que eres tú. Mírate a la cámara y asegúrate de tener buena iluminación.</p>
      
      <div class="relative w-full h-64 bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner flex items-center justify-center">
        <video ref="videoRef" autoplay playsinline muted class="absolute min-w-full min-h-full object-cover transform scale-x-[-1]"></video>
        
        <div class="absolute inset-0 border-[6px] border-cercapp-gold/30 rounded-3xl z-10 pointer-events-none"></div>
      </div>

      <div class="space-y-3">
        <button 
          @click="capturePhotoAndCompare"
          :disabled="isModelLoading"
          class="w-full py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          :class="isModelLoading ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-cercapp-navy text-white hover:bg-blue-900'"
        >
          <span v-if="isModelLoading" class="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full"></span>
          {{ isModelLoading ? 'Cargando Motor IA...' : '📸 Capturar y Validar' }}
        </button>
        <button @click="step = 1" class="text-xs text-slate-400 font-bold hover:text-cercapp-navy uppercase tracking-wider">
          Volver al Documento
        </button>
      </div>
    </div>

    <div v-show="step === 3" class="py-8 space-y-6 animate-fade-in">
      
      <div class="relative flex justify-center items-center h-32">
        <div class="absolute w-24 h-24 bg-cercapp-gold/20 rounded-full animate-ping"></div>
        <div class="absolute w-16 h-16 bg-cercapp-navy/10 rounded-full animate-pulse"></div>
        <svg class="w-10 h-10 text-cercapp-navy relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      </div>

      <div>
        <h3 class="font-bold text-lg text-cercapp-navy">Analizando Biometría</h3>
        <p class="text-sm text-slate-500 mt-2">Estamos comparando matemáticamente tus facciones con el documento de identidad. Esto tomará un par de segundos...</p>
      </div>

      <canvas ref="canvasRef" class="hidden"></canvas>
      
      <img ref="photoImageRef" :src="photoUrl" class="hidden" alt="Foto capturada" crossorigin="anonymous" />
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>