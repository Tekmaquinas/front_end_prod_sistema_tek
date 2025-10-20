import { ref } from 'vue';
import { handleApiError } from '../utils/helpers';

/**
 * Composable para gerenciar requisições à API com estado de carregamento
 * @returns {Object} Métodos e estados para operações de API
 */
export function useApiRequest() {
  const isLoading = ref(false);
  const error = ref(null);
  
  /**
   * Executa uma requisição à API com tratamento de estado
   * @param {Function} apiCall - Função que retorna uma Promise da API
   * @param {Object} options - Opções de configuração
   * @returns {Promise} Resultado da requisição
   */
  const executeRequest = async (apiCall, options = {}) => {
    const {
      loadingState = isLoading,
      errorState = error,
      context = 'executar operação',
      toast = null,
      onSuccess = null,
      onError = null
    } = options;
    
    loadingState.value = true;
    errorState.value = null;
    
    try {
      const result = await apiCall();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      errorState.value = err;
      handleApiError(err, context, toast);
      if (onError) onError(err);
      return null;
    } finally {
      loadingState.value = false;
    }
  };
  
  return {
    isLoading,
    error,
    executeRequest
  };
}
