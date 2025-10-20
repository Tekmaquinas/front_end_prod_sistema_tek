<template>
  <div class="flex justify-between" style="padding: .5rem .5rem 1.1rem;  flex-wrap: wrap; width: 100%; gap: 10px;">
    <div style="background-color: white; padding:  .5rem .8rem; border-radius: 10px; flex:1;">
          <div class="flex justify-between  cardd" style="width: 100%;">
            <p><span class="novos_registrados">+{{ statistics.aguardando_envio }} Novos</span> pedidos feitos</p>
            <i class="pi pi-shopping-cart"></i>
          </div>
    </div>

    <div style="background-color: white; padding:  .5rem .8rem; border-radius: 10px; flex:1;">
          <div class="flex justify-between  cardd" style="width: 100%;">
            <p><span class="encomenda_registrados">{{ statistics.prontos_para_encomendar }} Pedidos</span> encomendados</p> 
            <i class="pi pi-shopping-bag"></i>
          </div>
    </div>

    <div style="background-color: white; padding:  .5rem .8rem; border-radius: 10px; flex:1;">
          <div class="flex justify-between  cardd" style="width: 100%;">
            <p><span class="encomenda_registrados">{{ statistics.sem_link }} Pedidos</span> precisa de links</p>
            <i class="pi pi-link"></i>
          </div>
    </div>
    <div style="background-color: white; padding:  .5rem .8rem; border-radius: 10px; flex:1;">
          <div class="flex justify-between  cardd" style="width: 100%;">
            <p><span class="novos_registrados2">{{ statistics.trackings_total }} Pedidos</span> com incidentes</p>
            <i class="pi pi-bolt"></i>
          </div>
    </div>

<!-- 

  
    <div style="background-color: white; padding:  .5rem .8rem; border-radius: 10px; flex:1;">
        <div class="flex justify-between" style="width: 100%;">
          <p class="title_card">Produtos sem Link</p>
          <i class="pi pi-link"></i>
        </div>
        <div>
          <p class="count_orders">{{ statistics.sem_link }}</p>
        </div>
        <div class="flex flex-wrap" style="width: 100%; align-self: baseline;">
          <p><span class="trackings_pendentes">{{ statistics.novos_sem_link }}% </span>precisa de links</p>
        </div>
    </div> -->
<!-- 
    <Card style="flex: 1; min-width: 200px; padding: 0px;"  class="shadow">
      <template #content style="padding: 0px;">
        <div class="flex justify-between" style="width: 100%;">
          <p class="title_card">Encomendados</p>
          <i class="pi pi-shopping-bag"></i>
        </div>
        <div>
          <p class="count_orders">{{ statistics.prontos_para_encomendar }}</p>
        </div>
        <div class="flex flex-wrap" style="width: 100%; gap: 3.5px;">
          <p><span class="encomenda_registrados">{{ statistics.pct_encomendados }}%</span> encomendado</p> 
        </div>
      </template>
    </Card> -->

<!-- 
    <Card style="flex: 1; min-width: 200px; padding: 0px;"  class="shadow">
      <template #content style="padding: 0px;">
        <div class="flex justify-between" style="width: 100%;">
          <p class="title_card">Não Resolvidos</p>
          <i class="pi pi-bolt"></i>
        </div>
        <div>
          <p class="count_orders">{{ statistics.trackings_total }}</p>
        </div>
        <div class="flex flex-wrap" style="width: 100%; gap: 3.5px;">
          <p><span class="novos_registrados">{{ statistics.novos_trackings }} Encomendas</span> em progresso</p>
        </div>
      </template>
    </Card>

    <Card style="flex: 1; min-width: 200px; padding: 0px;"  class="shadow">
      <template #content style="padding: 0px;">
        <div class="flex justify-between" style="width: 100%;">
          <p class="title_card">Produtos sem Link</p>
          <i class="pi pi-link"></i>
        </div>
        <div>
          <p class="count_orders">{{ statistics.sem_link }}</p>
        </div>
        <div class="flex flex-wrap" style="width: 100%; align-self: baseline;">
          <p><span class="trackings_pendentes">{{ statistics.novos_sem_link }}% </span>precisa de links</p>
        </div>
      </template>
    </Card>  -->
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { inject } from 'vue';

const base_url = inject('base_url');
const route = defineProps({
  route: {
    type: [String, Object], // Aceita String ou Object
    required: true,
  },
});

const statistics = ref({
  aguardando_envio: 0,
  sem_link: 0,
  prontos_para_encomendar: 0,
});
const loadingStats = ref(false);
const toast = useToast();
let refreshInterval = null; // Controlador para o intervalo de atualização
let isFetching = false; // Flag para evitar chamadas simultâneas

// Função para salvar no cache
const saveToCache = (key, data) => {
const cacheKey = `${key}`;  // Nome único para a chave de cache, incluindo a página
const cacheData = {
  data,
  timestamp: Date.now(), // Salva o momento em que os dados foram armazenados
};
  sessionStorage.setItem(cacheKey, JSON.stringify(cacheData)); // Salva no Session Storage
};

// Função para buscar do cache
const getFromCache = (key, maxAge) => {
  const cacheData = sessionStorage.getItem(`${key}`);
  if (!cacheData) return null;

  const { data, timestamp } = JSON.parse(cacheData);
  const isExpired = Date.now() - timestamp > maxAge;

  return isExpired ? null : data;
};

const fetchOrderStatistics = async () => {
if (isFetching) return; // Evitar chamadas simultâneas
isFetching = true;

const cacheKey = `orderStatistics_${route.route}`;
const cacheExpiration = 10000; // 10 segundos
loadingStats.value = true;

try {
  // Tenta carregar do sessionStorage primeiro
  const cachedData = getFromCache(cacheKey, cacheExpiration);
  if (cachedData) {
    statistics.value = cachedData;
    loadingStats.value = false;
    isFetching = false;
    return;
  }

  // Se não tiver cache válido, faz a requisição
  const response = await fetch(`${base_url}/orders/statistics?marketplace=${route.route}`, {
    method: 'GET',
    credentials: 'include', // Habilita o envio e recebimento de cookies
  });

  // Verifica se a resposta é 401 (não autorizado)
  if (response.status === 401) {
    window.location.href = "/login"; // Redireciona para a página de login
    return;
  }

  if (!response.ok) {
    throw new Error('Erro ao buscar as estatísticas');
  }

  const data = await response.json();
  statistics.value = data;

  // Salva os dados no sessionStorage
  saveToCache(cacheKey, data);
} catch (error) {
  toast.add({
    severity: 'error',
    summary: 'Erro ao Carregar Estatísticas',
    detail: error.message,
    group: 'br',
    life: 3000,
  });
} finally {
  loadingStats.value = false;
  isFetching = false; // Libera para próximas chamadas
}
};

// Atualiza os dados automaticamente a cada 10 segundos
const startAutoRefresh = () => {
  if (refreshInterval) return; // Evita múltiplos intervalos
  refreshInterval = setInterval(() => {
    fetchOrderStatistics();
  }, 10000); // 10 segundos
};

// Limpa o intervalo ao desmontar o componente
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
});

onMounted(() => {
  fetchOrderStatistics(); // Requisita as estatísticas ao montar o componente
  startAutoRefresh(); // Inicia a atualização automática
});
</script>


<style scoped>
.pi-shopping-cart,.pi-shopping-bag, .pi-link ,.pi-bolt{
  font-size: 1.0rem;
  color: rgba(0, 136, 255, 0.945);
  background-color: rgba(0, 136, 255, 0.246);
  padding: 0.5rem;
  margin: auto 0;
  border-radius: 5px;
}

 /* .pi-link {
  color: rgba(255, 166, 0, 0.945);
  background-color: rgba(255, 166, 0, 0.213);
} */

.pi-bolt {
  color: rgba(255, 0, 0, 0.945);
  background-color: rgba(255, 18, 18, 0.246);
}

/* .pi-shopping-bag {
  color: rgba(144, 0, 255, 0.945);
  background-color: rgba(121, 18, 255, 0.246);
}  */


.title_card {
  word-break: normal;
  font-size: 0.9rem;
  margin: 0;
  color: rgb(134, 134, 134);
  
}

.count_orders {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 500;
  line-height: 0.8;
}

.novos_registrados {
  font-size: 1.0rem;
  color: rgb(32, 215, 0);
  font-weight: 700;
}

.novos_registrados2 {
  font-size: 1.0rem;
  color: rgb(215, 0, 0);
  font-weight: 700;
}

.trackings_pendentes{
  font-size: 1.0rem;
  color: rgb(215, 115, 0);
  font-weight: 700;
}

.encomenda_registrados{
  color: rgb(0, 215, 0);
  font-weight: 700;
  font-size: 1.0rem;
}

.cardd {
  padding: 0 !important;
}

</style>
