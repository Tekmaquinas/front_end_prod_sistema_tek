<template>
  <div class="info-card" :class="{ 'is-loading': loading }">
    <div v-if="loading" class="info-card-loading">
      <ProgressSpinner style="width: 50px; height: 50px;" />
    </div>
    <div v-else>
      <div v-if="title" class="info-card-title">
        <h3>{{ title }}</h3>
        <slot name="title-actions"></slot>
      </div>
      
      <div class="info-card-content">
        <slot></slot>
        
        <div v-if="items && items.length > 0" class="info-rows">
          <div 
            v-for="(item, index) in items" 
            :key="index" 
            class="info-row"
            v-show="showItem(item)"
          >
            <span class="info-label">{{ item.label }}:</span>
            <span class="info-value">{{ item.value }}</span>
          </div>
        </div>
        
        <div v-if="!hasContent" class="info-card-empty">
          <slot name="empty">
            <p class="no-data-message">Não há informações disponíveis</p>
          </slot>
        </div>
      </div>
      
      <div v-if="$slots.footer" class="info-card-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const hasContent = computed(() => {
  return props.items.some(item => showItem(item)) || 
         !!props.slots || 
         !!props.slots.default;
});

function showItem(item) {
  return item.value !== undefined && 
         item.value !== null && 
         item.value !== '';
}
</script>

<style scoped>
.info-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.info-card-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
}

.info-card.is-loading .info-card-content {
  opacity: 0.5;
  pointer-events: none;
}

.info-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--surface-200);
}

.info-card-title h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.info-label {
  font-weight: 500;
  color: var(--text-color-secondary);
}

.info-value {
  font-weight: 400;
  text-align: right;
}

.info-card-empty {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
}

.no-data-message {
  color: var(--text-color-secondary);
  font-style: italic;
}

.info-card-footer {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--surface-200);
}
</style>
