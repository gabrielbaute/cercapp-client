import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { IncidencesAdminService } from '../../api/services/incidences-admin.service';
import type { components } from '../../api/v1/schema';

type IncidenceAdminResponse = components["schemas"]["IncidenceAdminResponse"];

export default function useIncidenceDetail() {
  const route = useRoute();
  const incidenceId = route.params.id as string;

  const incidence = ref<IncidenceAdminResponse | null>(null);
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  const errorMessage = ref('');

  // Control para saber si la imagen falló al cargar
  const imageHasError = ref(false);

  // Modal para procesar la incidencia
  const modal = reactive({
    show: false,
    status: '',
    admin_comment: ''
  });

  const fetchIncidence = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    imageHasError.value = false; // Reseteamos el error de imagen
    
    try {
      const data = await IncidencesAdminService.getIncidenceById(incidenceId);
      incidence.value = data;
      
      // Pre-cargamos los datos en el modal por si el admin quiere editarlos
      modal.status = data.status;
      modal.admin_comment = data.admin_comment || '';
    } catch (error) {
      errorMessage.value = "No se pudo cargar el detalle del ticket.";
    } finally {
      isLoading.value = false;
    }
  };

  // Función que se dispara si la etiqueta <img> falla al cargar el src
  const onImageError = () => {
    imageHasError.value = true;
  };

  // Formateador de la URL de la imagen (por si tu API requiere un prefijo base)
  const imageUrl = computed(() => {
    if (!incidence.value?.resource_path) return null;
    const path = incidence.value.resource_path;
    // Si la ruta ya viene con http:// o https://, la usamos directo
    if (path.startsWith('http')) return path;
    // Si es relativa, asume que el backend la sirve desde la raíz. 
    // Ajusta VITE_API_URL si es necesario.
    const baseUrl = import.meta.env.VITE_API_URL || '';
    return `${baseUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1"); // Limpia barras dobles
  });

  const openProcessModal = () => {
    modal.show = true;
  };

  const closeProcessModal = () => {
    modal.show = false;
  };

  const saveProcess = async () => {
    isActionLoading.value = true;
    try {
      // Enviamos el PATCH con el comentario y el nuevo estado
      await IncidencesAdminService.processIncidence(incidenceId, {
        status: modal.status as any,
        admin_comment: modal.admin_comment
      });
      modal.show = false;
      await fetchIncidence(); // Recargamos para ver los cambios
    } catch (e) {
      alert("Error al procesar la incidencia.");
    } finally {
      isActionLoading.value = false;
    }
  };

  onMounted(fetchIncidence);

  return {
    incidence, isLoading, isActionLoading, errorMessage,
    modal, imageUrl, imageHasError,
    onImageError, openProcessModal, closeProcessModal, saveProcess
  };
}