import { ref, computed } from 'vue';

/**
 * Composable para gerenciar paginação
 * @param {Object} options - Opções de configuração
 * @returns {Object} Métodos e estado da paginação
 */
export function usePagination(options = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    onPageChange = null
  } = options;

  // Estado da paginação
  const pagination = ref({
    page: initialPage,
    pageSize: initialPageSize
  });
  
  const totalRecords = ref(0);
  
  /**
   * Calcula o número total de páginas
   */
  const totalPages = computed(() => {
    return Math.ceil(totalRecords.value / pagination.value.pageSize);
  });
  
  /**
   * Atualiza total de registros
   */
  const setTotalRecords = (total) => {
    totalRecords.value = total;
  };
  
  /**
   * Manipula o evento de mudança de página
   * @param {Object} event - Evento de paginação 
   */
  const handlePageChange = (event) => {
    // A PrimeVue usa index 0-based para páginas, mas usamos 1-based
    pagination.value.page = event.page + 1;
    pagination.value.pageSize = event.rows;
    
    if (onPageChange) {
      onPageChange(pagination.value);
    }
    
    return pagination.value;
  };
  
  /**
   * Reinicia para a primeira página
   */
  const resetToFirstPage = () => {
    pagination.value.page = 1;
  };
  
  return {
    // Estado
    pagination,
    totalRecords,
    totalPages,
    
    // Métodos
    handlePageChange,
    setTotalRecords,
    resetToFirstPage
  };
} 