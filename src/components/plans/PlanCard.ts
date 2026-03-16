import { computed } from 'vue';
import type { components } from '../../api/v1/schema';

// Extendemos el tipo si tu OpenAPI local no ha sido actualizado aún con estos campos,
// o simplemente usamos el tipo si ya corriste la actualización del esquema.
type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"];

export function usePlanCard(props: { plan: InvestmentPlan }) {
  
  const statusClasses = computed(() => {
    switch (props.plan.status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700';
      case 'BLOCKED': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  });

  const headerColor = computed(() => {
    return props.plan.investment_type === 'PREMIUM' ? 'bg-cercapp-gold' : 'bg-cercapp-navy';
  });

  // Usamos la fecha exacta del backend
  const formattedMaturityDate = computed(() => {
    if (!props.plan.maturity_date) return 'No definida';
    return new Date(props.plan.maturity_date).toLocaleDateString();
  });

  // Usamos los días restantes del backend para armar el texto
  const timeRemainingText = computed(() => {
    if (props.plan.is_ready_for_renewal) return 'Plazo Cumplido';
    
    const days = props.plan.days_remaining || 0;
    if (days === 1) return 'Vence mañana';
    if (days < 30) return `${days} días restantes`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} mes(es) restante(s)`;
    
    const years = (days / 365).toFixed(1);
    return `${years} años restantes`;
  });

  return { statusClasses, headerColor, formattedMaturityDate, timeRemainingText };
}