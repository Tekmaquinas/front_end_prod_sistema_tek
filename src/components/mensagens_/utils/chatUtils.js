/**
 * Utilitários para tratamento de identificadores de chat
 */

/**
 * Garante que temos o thread_id de um chat, mesmo que tenhamos apenas o order_id
 * @param {Object} chat - Objeto do chat com thread_id ou order_id
 * @returns {string|null} - Retorna o thread_id, ou null se não disponível
 */
export const ensureThreadId = (chat) => {
  if (!chat) return null;
  
  // Se já temos thread_id, use-o
  if (chat.thread_id) return chat.thread_id;
  
  // Se só temos order_id, use-o temporariamente
  if (chat.order_id) {
    return chat.order_id;
  }
  
  // Se não temos nenhum, retorne null
  return null;
};

/**
 * Retorna o identificador mais apropriado para uso como chave única na DataTable
 * @param {Object} chat - Objeto do chat
 * @returns {string|number|null} - Identificador para uso como chave
 */
export const getChatUniqueKey = (chat) => {
  return chat.thread_id || chat.order_id || chat.id || null;
};

/**
 * Normaliza uma lista de chats para garantir valores consistentes
 * @param {Array} chats - Lista de chats para normalizar
 * @returns {Array} - Lista normalizada com valores padrão para propriedades importantes
 */
export const normalizeChats = (chats) => {
  if (!Array.isArray(chats)) return [];
  
  return chats.map(chat => ({
    ...chat,
    thread_id: chat.thread_id || chat.order_id, // Usar order_id como fallback
    order_id: chat.order_id || chat.thread_id,  // Usar thread_id como fallback
    seen: chat.seen === true,                   // Garantir boolean
    shop_reply_needed: chat.shop_reply_needed === true, // Garantir boolean
  }));
};
