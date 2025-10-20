<template>
  <div class="state-container" :class="typeClass">
    <div v-if="type === 'loading'" class="loading-state">
      <ProgressSpinner />
      <p v-if="message">{{ message }}</p>
    </div>
    
    <div v-else-if="type === 'empty'" class="empty-state">
      <i :class="icon || 'pi pi-inbox'" style="font-size: 2rem"></i>
      <p>{{ message || 'Nenhum item encontrado' }}</p>
      <slot name="actions"></slot>
    </div>
    
    <div v-else-if="type === 'error'" class="error-state">
      <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)"></i>
      <p>{{ message || 'Ocorreu um erro ao carregar os dados' }}</p>
      <slot name="actions">
        <Button 
          label="Tentar novamente" 
          icon="pi pi-refresh" 
          class="p-button-sm" 
          @click="$emit('retry')"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['loading', 'empty', 'error'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
});

defineEmits(['retry']);

const typeClass = computed(() => `state-${props.type}`);
</script>

<style scoped>
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 200px;
}

.loading-state, .empty-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.state-container p {
  margin: 0.5rem 0;
  color: var(--text-color-secondary);
}
</style>
