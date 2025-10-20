import { ref } from 'vue';
import { ChatService } from '../services/api';

/**
 * Composable para gerenciar a carga de chats
 * @param {Object} options - Opções de configuração
 * @returns {Object} Métodos e estado da carga de chats
 */
export function useChatsLoader(options = {}) {
  const {
    onLoadComplete = null
  } = options;
  
  // Constantes para estados de chat
  const CHAT_STATE = {
    NAO_LIDOS: 'nao_lidos',
    LIDOS: 'lidos',
    ATENCAO: 'atencao',
    URGENTE: 'urgente',
    INFO: 'info',
    FINALIZADO: 'finalizado',
    SAVED: 'saved',
    OPERADOR: 'operador',
    PENDENTE: 'pendente'
  };
  
  // Estado
  const chatsData = ref([]);
  const isLoading = ref(false);
  
  /**
   * Carrega chats com base nos parâmetros
   * @param {Object} params - Parâmetros para carregar chats
   * @returns {Promise<Object>} Dados carregados
   */
  const loadChats = async (params = {}) => {
    const { 
      page = 1, 
      pageSize = 10, 
      marketplace = null, 
      state = CHAT_STATE.PENDENTE 
    } = params;
    
    isLoading.value = true;
    
    try {
      // Parâmetros base da requisição
      const apiParams = {
        page: page,
        pageSize: pageSize,
      };

      // Se não for 'all', adiciona o marketplace
      if (marketplace && marketplace !== 'all') {
        apiParams.marketplace = marketplace;
      }

      // Aplicar filtros específicos de acordo com o estado
      switch (state) {
        case CHAT_STATE.NAO_LIDOS:
          apiParams.notific = 'true';
          break;
        case CHAT_STATE.LIDOS:
          apiParams.notific = 'false';
          break;
        case CHAT_STATE.ATENCAO:
          apiParams.alert = 'true';
          break;
        case CHAT_STATE.URGENTE:
          apiParams.status = 'urgente';
          break;
        case CHAT_STATE.INFO:
          apiParams.status = 'info';
          break;
        case CHAT_STATE.FINALIZADO:
          apiParams.status = 'finalizado';
          break;
        case CHAT_STATE.SAVED:
          apiParams.seen = 'true';
          break;
        case CHAT_STATE.OPERADOR:
          apiParams.status = 'operador';
          break;
        case CHAT_STATE.PENDENTE:
        default:
          apiParams.status = 'pendente';
      }

      const data = await ChatService.getChats(apiParams);
      
      // Atualizar os dados localmente
      chatsData.value = data?.results || [];
      
      // Chamar callback se fornecido
      if (onLoadComplete) {
        onLoadComplete(data);
      }
      
      return data;
    } catch (error) {
      console.error("Erro ao carregar os chats:", error);
      chatsData.value = [];
      return { results: [], count: 0 };
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Atualiza o conjunto de dados diretamente
   * @param {Array} data - Novos dados 
   */
  const updateData = (data) => {
    chatsData.value = data || [];
  };
  
  return {
    // Constantes
    CHAT_STATE,
    
    // Estado
    chatsData,
    isLoading,
    
    // Métodos
    loadChats,
    updateData
  };
}