import { computed } from 'vue';
import type { components } from '../../api/v1/schema';

type Incidence = components["schemas"]["IncidenceResponse"];

export function useIncidenceListItem(props: { incidence: Incidence }) {
  
  // Estilos y textos dinámicos según el estado de la incidencia
  const statusBadge = computed(() => {
    switch (props.incidence.status) {
      case 'PENDING': return { class: 'bg-yellow-100 text-yellow-700', text: 'Pendiente' };
      case 'IN_PROGRESS': return { class: 'bg-blue-100 text-blue-700', text: 'En Proceso' };
      case 'RESOLVED': return { class: 'bg-green-100 text-green-700', text: 'Resuelto' };
      case 'CANCELLED': return { class: 'bg-gray-100 text-gray-700', text: 'Cancelado' };
      default: return { class: 'bg-gray-100 text-gray-700', text: props.incidence.status };
    }
  });

  // Para evitar que textos muy largos rompan la tarjeta en la lista
  const truncatedContent = computed(() => {
    const text = props.incidence.content;
    return text.length > 80 ? text.substring(0, 80) + '...' : text;
  });

  return { statusBadge, truncatedContent };
}