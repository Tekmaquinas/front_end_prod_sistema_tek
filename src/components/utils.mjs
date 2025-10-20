
export function getNameStatus(order, typ){
    const statusMaps = {
      1: {
        1:"Pedido Novo",
        2:"Em preparo",
        3:"Encomenda Enviada",
        4:"C. Tracking",
        5:"Concluido",
        6:"Sem Estoque",
        7:"Reembolsado",
        8:"Cancelado",
        9:"Tracking Fake",
        10:"Encomenda Fake",
        11:'Etiqueta Pronta'

      },
      2: {
        1: 'status-tag status-1',
        2: 'status-tag status-2',
        3: 'status-tag status-2',
        4: 'status-tag status-3',
        5: 'status-tag status-4',
        6: 'status-tag status-5',
        7: 'status-tag status-5',
        8: 'status-tag status-5',
        9: 'status-tag status-6',
        10: 'status-tag status-7',
        11:'status-tag status-3',
      },
    };

    return statusMaps[typ]?.[order] || null;
  };

export function getSeverityIcon(order){
    switch (order) {
      case "Enviado":
        return 'pi pi-check-circle text-green-500';
        case "Recebido":
        return 'pi pi-check text-green-500';

      case 'Aguardando Envio':
        return 'pi pi-clock text-surface-400';

      case 'Reembolsado':
        return 'pi pi-wallet text-red-500';

      case 'Verificação de fraude':
        return 'pi pi-info-circle text-orange-500';


      case 'Cancelado':
        return 'pi pi-wallet text-red-500';

      case 'Aguardando Aceitação':
        return 'pi pi-question text-surface-500';

    }
  };

export function getSeverity(order){
    switch (order) {

      case "Enviado":
        return 'success';

      case 'Reembolsado':
        return 'warn';

      case 'Aguardando Envio':
        return 'info';

      case 'Aguardando Aceitação':
        return 'warn';

      default:
        return 'info';
    }
  };

export function saveToCache(key, data){
    const cacheKey = `${key}`;
    const cacheData = {
      data,
      timestamp: Date.now(), 
    };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
  };

export function getFromCache(key, maxAge){
    const cacheData = sessionStorage.getItem(`${key}`);
    if (!cacheData) return null;

    const { data, timestamp } = JSON.parse(cacheData);
    const isExpired = Date.now() - timestamp > maxAge;

    return isExpired ? null : data;
  };

export async function fetchOrders(page, base_url, rows, marketplace, range_date, channel_seller, state_progress) {
    let url = `${base_url}/orders?marketplace=${marketplace}&limit=${rows}`;
    const params = new URLSearchParams();
    params.append('page', page);
    
    if (range_date) params.append('range_date', range_date);
    if (channel_seller) params.append('channel_seller', channel_seller);
    if (state_progress) params.append('state_progress', state_progress);
    
    if (params.toString()) {
        url += `&${params.toString()}`;
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
    

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // Garantir envio do cookie de autenticação
    });

    if (response.redirected || response.status === 302 || response.status === 401) {
        window.location.href = "/login"; // Redireciona para a página de login
        return;
    }

    if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
    }

    return await response.json();
}

export async function updateLink(base_url,sku,state_progress, order_id, newLink) {
  try {
  const response = await fetch(`${base_url}/orders/${order_id}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ link: newLink, state_progress: state_progress, sku:sku, }),
      credentials: 'include', // Garantir envio do cookie de autenticação
    });

    if (!response.ok) {
      throw new Error('Erro ${response.status}: Não foi possível atualizar o link.');
    }

    const data = await response.json();
    return data
  } catch (err) {
    console.error('Erro ao atualizar o link:', err);
  }
};

export async function searching_func(base_url,marketplace,payload,page) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set('page', page);
  window.history.pushState({}, '', `${window.location.pathname}?${queryParams}`);

  const response = await fetch(`${base_url}/orders/search?page=${page}&marketplace=${marketplace}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      }
  );

  if (response.redirected || response.status === 302 || response.status === 401) {
      window.location.href = "/login"; // Redireciona para a página de login
      return;
  }

  if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
  }

  return await response.json();

};

export function DateFormat(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);

  const hora = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
  });

  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear().toString().slice(-2);

  return `${dia}/${mes}/${ano}, ${hora}`;
}