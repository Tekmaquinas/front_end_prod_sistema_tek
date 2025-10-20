<template>
  <Dialog 
    :visible="visible"
    :style="{ width: '450px' }"
    :header="title"
    :modal="true"
    :closable="closable"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="confirmation-content">
      <i :class="icon" :style="{ color: iconColor, fontSize: '2rem' }"></i>
      <span>{{ message }}</span>
    </div>
    
    <template #footer>
      <Button 
        :label="cancelLabel" 
        icon="pi pi-times" 
        class="p-button-text" 
        @click="cancel"
      />
      <Button 
        :label="confirmLabel" 
        :icon="confirmIcon" 
        :class="confirmButtonClass" 
        :loading="loading"
        @click="confirm"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirmação'
  },
  message: {
    type: String,
    default: 'Tem certeza que deseja realizar esta ação?'
  },
  icon: {
    type: String,
    default: 'pi pi-exclamation-triangle'
  },
  iconColor: {
    type: String,
    default: 'var(--yellow-500)'
  },
  confirmLabel: {
    type: String,
    default: 'Sim'
  },
  cancelLabel: {
    type: String,
    default: 'Não'
  },
  confirmIcon: {
    type: String,
    default: 'pi pi-check'
  },
  confirmSeverity: {
    type: String,
    default: 'danger'
  },
  loading: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const confirmButtonClass = computed(() => `p-button-${props.confirmSeverity}`);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
  emit('update:visible', false);
};
</script>

<style scoped>
.confirmation-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}
</style>
