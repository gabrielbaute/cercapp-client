import { ref, reactive, computed, onMounted } from 'vue';
import { CompanyAdminService } from '../../api/services/company-admin.service';
import type { components } from '../../api/v1/schema';

// Usamos el tipo exacto que exportaste
type CompanyResponse = components["schemas"]["CompanyResponse"];

export default function useCompaniesList() {
  const companies = ref<CompanyResponse[]>([]);
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  const errorMessage = ref('');

  // Filtros locales
  const filters = reactive({
    nameOrEmail: '',
    status: ''
  });

  // Modal para confirmar bloqueos o eliminaciones
  const modal = reactive({
    show: false,
    title: '',
    message: '',
    type: 'info' as 'danger' | 'warning' | 'info',
    action: null as (() => Promise<void>) | null
  });

  const fetchCompanies = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      // Usamos el endpoint sin paginación
      const data: any = await CompanyAdminService.listAllCompanies();
      
      // Adaptamos por si la API envía un array directo o un objeto envuelto
      companies.value = Array.isArray(data) ? data : (data?.companies || data?.items || []);
    } catch (error) {
      errorMessage.value = "Error al obtener el listado de empresas.";
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const filteredCompanies = computed(() => {
    return companies.value.filter(company => {
      const searchTerm = filters.nameOrEmail.toLowerCase();
      // Asumimos los campos más comunes; ajústalos si en tu Pydantic se llaman distinto
      const name = (company as any).company_name || (company as any).name || '';
      const email = (company as any).email || '';
      
      const matchText = !searchTerm || 
        name.toLowerCase().includes(searchTerm) || 
        email.toLowerCase().includes(searchTerm);
      
      const matchStatus = !filters.status || company.status === filters.status;
      
      return matchText && matchStatus;
    });
  });

  // --- ACCIONES DE GESTIÓN RÁPIDA ---

  const handleBlock = (company: CompanyResponse) => {
    const isBlocked = company.status === 'BLOCKED';
    const companyName = (company as any).company_name || 'esta empresa';
    
    modal.title = isBlocked ? 'Reactivar Empresa' : 'Bloquear Empresa';
    modal.message = `¿Confirmas el cambio de estado de acceso para ${companyName}?`;
    modal.type = 'warning';
    modal.show = true;
    modal.action = async () => { await CompanyAdminService.blockCompany(company.id); };
  };

  const handleDelete = (company: CompanyResponse) => {
    const companyName = (company as any).company_name || 'esta empresa';

    modal.title = 'ELIMINAR EMPRESA';
    modal.message = `¡ATENCIÓN! ¿Estás absolutamente seguro de eliminar a ${companyName}? Esta acción borrará sus datos permanentemente.`;
    modal.type = 'danger';
    modal.show = true;
    modal.action = async () => { await CompanyAdminService.hardDeleteCompany(company.id); };
  };

  const executeAction = async () => {
    if (!modal.action) return;
    isActionLoading.value = true;
    try {
      await modal.action();
      modal.show = false;
      await fetchCompanies(); // Recargamos para reflejar cambios
    } catch (e) { 
      alert("Error en la operación"); 
    } finally { 
      isActionLoading.value = false; 
    }
  };

  onMounted(fetchCompanies);

  return {
    companies, filteredCompanies, filters, isLoading, isActionLoading, errorMessage,
    modal, fetchCompanies, handleBlock, handleDelete, executeAction
  };
}