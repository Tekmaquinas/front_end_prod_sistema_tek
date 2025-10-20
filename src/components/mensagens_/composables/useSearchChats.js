import { ref } from 'vue';
import { ChatService } from '../services/api';

/**
 * Composable para gerenciar a busca de chats
 * @param {Object} options - Opções de configuração
 * @returns {Object} Métodos e estado da busca
 */
export function useSearchChats(options = {}) {
  const {
    onSearchComplete = null,
    initialQuery = '',
    initialMarketplace = '',
  } = options;

  // Estado para o sistema de busca
  const searchQuery = ref(initialQuery);
  const searchMarketplace = ref(initialMarketplace);
  const isDeepSearch = ref(false);
  const isSearchInProgress = ref(false);
  const isSearchMode = ref(false);
  
  /**
   * Executa a busca com base no tipo (normal ou profunda)
   * @param {Object} paginationParams - Parâmetros de paginação
   */
  const executeSearch = async (paginationParams = { page: 1, pageSize: 10 }) => {
    // Validação do termo de busca
    const searchTerm = searchQuery.value.trim();
    if (!searchTerm) return { results: [], count: 0 };

    // Log para confirmar que a busca está sendo iniciada
    console.log(`Iniciando busca com termo: "${searchTerm}"`);

    isSearchInProgress.value = true;
    isSearchMode.value = true;

    try {
      const params = {
        page: paginationParams.page,
        pageSize: paginationParams.pageSize,
      };

      // Adicionar marketplace se estiver selecionado
      if (searchMarketplace.value) {
        params.marketplace = searchMarketplace.value;
      }

      let data;

      if (isDeepSearch.value) {
        data = await ChatService.deepSearch(searchTerm, params);
      } else {
        data = await ChatService.search(searchTerm, params);
      }

      if (onSearchComplete) {
        onSearchComplete(data);
      }
      
      return data;
    } catch (error) {
      console.error(
        `Erro na ${isDeepSearch.value ? "busca profunda" : "busca"}:`,
        error
      );
      return { results: [], count: 0 };
    } finally {
      isSearchInProgress.value = false;
    }
  };

  /**
   * Cancela a busca e limpa o estado
   */
  const cancelSearch = () => {
    if (!isSearchMode.value) return;

    console.log("Cancelando modo de busca e retornando à listagem normal");
    searchQuery.value = "";
    searchMarketplace.value = "";
    isDeepSearch.value = false;
    isSearchMode.value = false;
    
    return { reset: true };
  };

  return {
    // Estado
    searchQuery,
    searchMarketplace,
    isDeepSearch,
    isSearchInProgress,
    isSearchMode,
    
    // Métodos
    executeSearch,
    cancelSearch
  };
}