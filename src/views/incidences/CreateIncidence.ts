import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';
import { IncidenceService } from '../../api/services/incidence.service';

export default function useCreateIncidence() {
  const router = useRouter();
  const authStore = useAuthStore();

  const content = ref('');
  // Guardaremos el archivo seleccionado en una referencia reactiva
  const selectedFile = ref<File | null>(null);
  
  const isLoading = ref(false);
  const errorMessage = ref('');

  // Esta función se dispara cuando el usuario elige un archivo
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedFile.value = target.files[0];
      
      // Opcional: Validación básica de tamaño (ej. max 5MB)
      if (selectedFile.value.size > 5 * 1024 * 1024) {
        errorMessage.value = "El archivo es muy pesado. Máximo permitido: 5MB.";
        selectedFile.value = null;
        target.value = ''; // Resetea el input
      } else {
        errorMessage.value = '';
      }
    } else {
      selectedFile.value = null;
    }
  };

  const submitIncidence = async () => {
    if (!content.value.trim()) {
      errorMessage.value = "Por favor, describe tu problema detalladamente.";
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      // Usamos el servicio que armamos, pasándole el texto y el archivo (si existe)
      if (authStore.isCompany) {
        await IncidenceService.createCompanyIncidence(content.value, selectedFile.value || undefined);
      } else {
        await IncidenceService.createUserIncidence(content.value, selectedFile.value || undefined);
      }
      
      router.push({ name: 'MyIncidences' });
    } catch (error: any) {
      console.error("Error al crear la incidencia:", error);
      errorMessage.value = error?.data?.detail?.[0]?.msg || "No se pudo enviar el reporte. Verifica tu conexión.";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    content,
    selectedFile,
    isLoading,
    errorMessage,
    handleFileChange,
    submitIncidence
  };
}