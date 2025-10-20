/**
 * Script para corrigir problemas com inputs bloqueados em chats
 * 
 * Este script adiciona um observador de mutações para monitorar
 * qualquer mudança no DOM e garantir que os inputs de chat
 * estejam sempre habilitados.
 */

// Função que será executada quando o script for importado
export function applyChatInputFix() {
  console.log('Aplicando correção para inputs de chat...');
  
  // Esperar até que o DOM esteja pronto
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando observador...');
    startObserver();
  });
  
  // Se o DOM já estiver carregado, iniciar imediatamente
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM já está carregado, iniciando observador agora...');
    startObserver();
  }
}

// Inicia o observador de mutações para monitorar mudanças no DOM
function startObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      // Verificar se há algum input de chat na página
      const chatInputs = document.querySelectorAll('.message-input-container input, input[placeholder*="mensagem"], textarea[placeholder*="mensagem"]');
      
      if (chatInputs.length > 0) {
        // Garantir que todos os inputs de chat estejam habilitados
        chatInputs.forEach(input => {
          if (input.disabled) {
            input.disabled = false;
            
            // Tentar focar o input
            try {
              input.focus();
            } catch (err) {
              // Removido console.warn
            }
          }
          
          // Garantir que o elemento seja interativo
          input.style.pointerEvents = 'auto';
          input.style.opacity = '1';
          
          // Verificar elementos pai que possam estar bloqueando
          let parent = input.parentElement;
          while (parent && parent !== document.body) {
            parent.style.pointerEvents = 'auto';
            parent = parent.parentElement;
          }
        });
      }
    });
  });
  
  // Observar todo o documento para mudanças na estrutura
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['disabled', 'style', 'class']
  });
  
  // Aplicar a correção inicial
  applyInitialFix();
}

// Aplica a correção inicial em todos os inputs existentes
function applyInitialFix() {
  setTimeout(() => {
    console.log('Aplicando correção inicial em todos os inputs...');
    
    // Selecionar todos os possíveis campos de entrada de mensagem
    const allInputs = document.querySelectorAll('input, textarea');
    
    allInputs.forEach(input => {
      if (input.disabled || 
          input.placeholder?.toLowerCase().includes('mensagem') || 
          input.placeholder?.toLowerCase().includes('digitar')) {
        console.log('Habilitando input:', input);
        input.disabled = false;
        input.style.pointerEvents = 'auto';
      }
    });
  }, 1000); // Pequeno delay para garantir que todos os componentes foram renderizados
}

// Aplicar a correção imediatamente
applyChatInputFix();
