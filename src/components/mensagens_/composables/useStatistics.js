import { ref, computed, readonly } from 'vue';
import { StatisticsService } from '../services/api';
import { useToast } from 'primevue/usetoast';

export function useStatistics() {
  const isLoading = ref(false);
  const error = ref(null);
  const statistics = ref(null);
  const startDate = ref(null);
  const endDate = ref(null);
  const selectedMarketplace = ref(null);
  const toast = useToast();
  
  // Cores para os status
  const statusColors = {
    finalizado: '#4BC0C0',
    pendente: '#FF9F40',
    operador: '#C9CBCF'
  };
  
  // Função para obter a cor do status
  const getStatusColor = (status) => {
    return statusColors[status] || '#C9CBCF';
  };
  
  // Dados para gráfico de status
  const statusChartData = computed(() => {
    if (!statistics.value) return { labels: [], datasets: [{ data: [] }] };
    
    const statusData = statistics.value.total.por_status;
    const labels = Object.keys(statusData).map(key => key.charAt(0).toUpperCase() + key.slice(1));
    const data = Object.values(statusData);
    
    return {
      labels,
      datasets: [
        {
          label: 'Quantidade',
          backgroundColor: Object.keys(statusData).map(key => getStatusColor(key)),
          data
        }
      ]
    };
  });
  
  // Opções para o gráfico de status horizontal
  const statusChartOptions = {
    indexAxis: 'y', // Barras horizontais
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Ocultar legenda já que as cores são autoexplicativas
      }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };
  
  // Dados para gráfico de marketplace
  const marketplaceChartData = computed(() => {
    if (!statistics.value) return { labels: [], datasets: [{ data: [] }] };
    
    return {
      labels: ['Leroy', 'Worten'],
      datasets: [
        {
          label: 'Total de Chats',
          backgroundColor: '#42A5F5',
          data: [statistics.value.leroy.total, statistics.value.worten.total]
        },
        {
          label: 'Pendentes',
          backgroundColor: '#FFA726',
          data: [statistics.value.leroy.pendentes, statistics.value.worten.pendentes]
        },
        {
          label: 'Finalizados',
          backgroundColor: '#66BB6A',
          data: [statistics.value.leroy.finalizados, statistics.value.worten.finalizados]
        }
      ]
    };
  });
  
  // Opções de gráfico padrão
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
  
  // Formatar tempo de minutos para horas e minutos
  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    
    const mins = parseFloat(minutes);
    
    if (isNaN(mins)) return 'N/A';
    
    // Converter para formato hh:mm
    const hours = Math.floor(mins / 60);
    const remainingMins = Math.round(mins % 60);
    
    if (hours > 0) {
      return `${hours}h ${remainingMins}m`;
    } else {
      return `${remainingMins}m`;
    }
  };
  
  // Configurar intervalo de datas padrão (último mês)
  const setupDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    
    startDate.value = start;
    endDate.value = end;
  };
  
  // Resetar filtros
  const resetFilters = () => {
    setupDefaultDateRange();
    selectedMarketplace.value = null;
    fetchStatistics();
  };
  
  // Formatar data para API (YYYY-MM-DD)
  const formatDateForApi = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  // Buscar estatísticas
  const fetchStatistics = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Preparar parâmetros
      const params = {};
      
      // Datas
      if (startDate.value) {
        params.start_date = formatDateForApi(startDate.value);
      }
      
      if (endDate.value) {
        params.end_date = formatDateForApi(endDate.value);
      }
      
      // Marketplace
      if (selectedMarketplace.value) {
        params.marketplace = selectedMarketplace.value;
      }
      
      // Chamada para API
      statistics.value = await StatisticsService.getStatistics(params);
      
      // Feedback de sucesso
      toast.add({
        severity: 'success',
        summary: 'Dados carregados',
        detail: 'Estatísticas atualizadas com sucesso',
        life: 3000
      });
    } catch (err) {
      error.value = err.message || 'Erro ao carregar estatísticas';
      console.error('Erro ao carregar estatísticas:', err);
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar as estatísticas',
        life: 3000
      });
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    // Estado - usando readonly para estados que não devem ser modificados externamente
    isLoading: readonly(isLoading),
    error: readonly(error),
    statistics: readonly(statistics),
    startDate,
    endDate,
    selectedMarketplace,
    
    // Opções e dados de gráficos
    statusChartData,
    statusChartOptions,
    marketplaceChartData,
    chartOptions,
    
    // Funções
    formatTime,
    setupDefaultDateRange,
    resetFilters,
    fetchStatistics
  };
}
