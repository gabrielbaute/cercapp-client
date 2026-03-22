import { ref, computed, onMounted } from 'vue';
import { InterestService } from '../../api/services/interest.service';
import type { components } from '../../api/v1/schema';

type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"];

export function usePlanCard(props: { plan: InvestmentPlan, capital?: number, interests?: number }) {
  
  // Estados locales para cuando el componente tiene que buscar su propia data
  const localCapital = ref<number>(0);
  const localInterests = ref<number>(0);
  const isFetchingFinancials = ref(false);

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

  const formattedMaturityDate = computed(() => {
    if (!props.plan.maturity_date) return 'No definida';
    return new Date(props.plan.maturity_date).toLocaleDateString();
  });

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

  // --- LÓGICA FINANCIERA AUTOSUFICIENTE ---

  onMounted(async () => {
    // Si ya me pasaron los datos por props, no hago la petición a la API
    if (props.capital !== undefined && props.interests !== undefined) {
      return;
    }

    isFetchingFinancials.value = true;
    try {
      // Buscamos el historial de intereses de este plan en específico
      const response = await InterestService.getPlanInterests(props.plan.id);
      const interestsList = response.interests || [];

      if (interestsList.length > 0) {
        // Ordenamos para asegurarnos de agarrar el último mes auditado
        const sorted = interestsList.sort((a, b) => {
          if (a.periodo_anio !== b.periodo_anio) return a.periodo_anio - b.periodo_anio;
          return a.periodo_mes - b.periodo_mes;
        });
        
        const latest = sorted[sorted.length - 1];

        // Tomamos el total aportado hasta esa fecha y la suma de todos los intereses
        localCapital.value = parseFloat(String(latest.monto_total_pagos || latest.capital_social_base || 0));
        localInterests.value = parseFloat(String(latest.interes_previo || 0)) + parseFloat(String(latest.interes_periodo || 0));
      }
    } catch (error) {
      console.warn(`No se pudieron cargar los datos financieros para el plan: ${props.plan.id}`);
    } finally {
      isFetchingFinancials.value = false;
    }
  });

  const displayCapital = computed(() => {
    const val = props.capital ?? localCapital.value;
    return parseFloat(String(val)).toFixed(2);
  });

  const displayInterests = computed(() => {
    const val = props.interests ?? localInterests.value;
    return parseFloat(String(val)).toFixed(2);
  });

  return { 
    statusClasses, 
    headerColor, 
    formattedMaturityDate, 
    timeRemainingText,
    displayCapital,
    displayInterests,
    isFetchingFinancials // Exportado para mostrar un spinner/skeleton en la UI
  };
}