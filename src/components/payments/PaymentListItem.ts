import { computed } from 'vue';
import type { components } from '../../api/v1/schema';

// Usaremos una unión de tipos porque los pagos de usuario y empresa son ligeramente distintos, 
// pero comparten la base que nos interesa mostrar.
type UserPayment = components["schemas"]["PaymentResponse"];
type CompanyPayment = components["schemas"]["PaymentCompanyResponse"];
type Payment = UserPayment | CompanyPayment;

export function usePaymentListItem(props: { payment: Payment }) {
  
  // Clases CSS dinámicas según el estado del pago
  const statusBadge = computed(() => {
    switch (props.payment.status) {
      case 'COMPLETED': return { class: 'bg-green-100 text-green-700', text: 'Completado' }; 
      case 'PENDING': return { class: 'bg-yellow-100 text-yellow-700', text: 'Pendiente' }; 
      case 'REJECTED': return { class: 'bg-red-100 text-red-700', text: 'Rechazado' }; 
      case 'REFUNDED': return { class: 'bg-purple-100 text-purple-700', text: 'Reembolsado' }; 
      case 'CANCELED': return { class: 'bg-gray-100 text-gray-700', text: 'Cancelado' }; 
      default: return { class: 'bg-blue-100 text-blue-700', text: props.payment.status };
    }
  });

  // Formatear método de pago (ej. PAGO_MOVIL -> Pago Móvil)
  const formattedMethod = computed(() => {
    return props.payment.payment_method.replace('_', ' '); 
  });

  return { statusBadge, formattedMethod };
}