<template>
  <span 
    class="saved-indicator" 
    :class="{ 'is-saved': saved }"
    :title="saved ? 'Chat salvo' : 'Chat não salvo'"
  >
    <i :class="iconClass"></i>
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  saved: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'normal', // 'small', 'normal', 'large'
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  }
});

const iconClass = computed(() => {
  return props.saved 
    ? 'pi pi-bookmark-fill' 
    : 'pi pi-bookmark';
});
</script>

<style scoped>
.saved-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.saved-indicator.is-saved {
  color: var(--primary-color);
}

.saved-indicator:not(.is-saved) {
  color: var(--text-color-secondary);
}

.saved-indicator:hover {
  transform: scale(1.1);
}

/* Tamanhos */
.saved-indicator.small i {
  font-size: 0.875rem;
}

.saved-indicator.normal i {
  font-size: 1rem;
}

.saved-indicator.large i {
  font-size: 1.25rem;
}
</style>
