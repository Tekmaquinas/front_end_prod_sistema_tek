/**
 * Funções auxiliares reutilizáveis para o projeto
 */

/**
 * Implementação de debounce para limitar chamadas repetidas
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @param {boolean} immediate - Se deve executar imediatamente
 * @returns {Function} Função com debounce
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Formata um valor para exibição de moeda
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Código da moeda (padrão: EUR)
 * @returns {string} Valor formatado
 */
export function formatCurrency(value, currency = 'EUR') {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: currency
  }).format(value);
}

/**
 * Trunca um texto para um determinado comprimento
 * @param {string} text - Texto a ser truncado
 * @param {number} length - Comprimento máximo
 * @returns {string} Texto truncado
 */
export function truncateText(text, length = 50) {
  if (!text) return '';
  return text.length > length 
    ? text.substring(0, length) + '...'
    : text;
}

/**
 * Adiciona capacidade de retry para chamadas de API
 * @param {Function} apiFn - Função que retorna uma Promise
 * @param {Object} options - Opções para retry
 * @returns {Promise} Promise com resultado da API
 */
export async function withRetry(apiFn, options = {}) {
  const { 
    retries = 2, 
    retryDelay = 1000, 
    onRetry = null 
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiFn();
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        if (onRetry) onRetry(error, attempt, delay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Verificação básica de conectividade com a API
 * @param {string} url - URL para testar
 * @returns {Promise<boolean>} Promise que resolve para true se a API estiver acessível
 */
export async function checkApiConnection(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ef9354cc8b5f6aec770636e6bce6ca85001ae47c`,
        'X-Custom-Cookie': `tekmaquinas=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1icm9faWQiOjEsImVtYWlsIjoieXVyaWRhbmllbDE5NUBnbWFpbC5jb20iLCJoYXNoIjoiYmI3MDJkNTc3Y2ZmZTUxNGI0ODQ3YzVjY2VlMWQ4MzcxYWJjNWU2ODc0ZjUxMTk1MmJkMTI3NTJkNzYxZjAxMWE3MzJiYTk0YzVhNTY3ODc0MGRmNDQ2OWQ5MWYzNzFmZTYyYTE4Mjk0YjNhMjJmYjc3YzRjMzViOGRlMjAxNWQiLCJleHAiOjE3NDY1Mjc2MTAsInN1YiI6IjEiLCJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwiaWF0IjoxNzQ1OTIyODEwfQ.vTw2Q1l0o12hTwSmqZfdHzDS5UWkA13zun6QcqiU7Dw`
      },
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Erro ao verificar conexão com API:', error);
    return false;
  }
}

/**
 * Formata uma data para exibição
 * @param {string|Date} date - Data a ser formatada
 * @param {Object} options - Opções de formatação
 * @returns {string} Data formatada
 */
export function formatDate(date, options = {}) {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  
  return new Intl.DateTimeFormat('pt-BR', formatOptions).format(new Date(date));
}

/**
 * Centraliza a lógica de tratamento de erro de API
 * @param {Error} error - Erro capturado
 * @param {string} context - Contexto onde o erro ocorreu
 * @param {Function} toast - Função de toast (opcional)
 */
export function handleApiError(error, context, toast = null) {
  console.error(`Erro ao ${context}:`, error);
  
  if (toast) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: `Não foi possível ${context.toLowerCase()}`,
      life: 3000
    });
  }
  
  return error;
}

/**
 * Gera classes CSS baseadas em status
 * @param {string|number} status - Status do item
 * @param {string} prefix - Prefixo para a classe (padrão: 'status')
 * @returns {string} Classes CSS
 */
export function getStatusClasses(status, prefix = 'status') {
  if (!status) return '';
  return `${prefix}-${status}`;
}
