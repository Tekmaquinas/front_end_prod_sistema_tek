<template>
  <span :class="['status-badge', statusClass]">
    {{ label || statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { getStatusClasses } from '../utils/helpers';

const props = defineProps({
  status: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: 'status'
  }
});

const statusClass = computed(() => getStatusClasses(props.status, props.prefix));

const statusLabel = computed(() => {
  const statusMap = {
    1: 'Pendente',
    2: 'Em Análise',
    3: 'Aguardando',
    4: 'Concluído',
    5: 'Cancelado',
    'pendente': 'Pendente',
    'operador': 'Em Atendimento',
    'urgente': 'Urgente',
    'info': 'Informativo',
    'finalizado': 'Finalizado'
  };
  
  return statusMap[props.status] || `Status ${props.status}`;
});
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
