<template>
  <div class="note-editor">
    <div class="note-form">
      <Textarea
        v-model="localNote.text"
        :placeholder="isEditing ? 'Editar nota...' : 'Adicionar nova nota...'"
        rows="4"
        autoResize
      />
      <div class="note-actions">
        <Button
          :label="isEditing ? 'Atualizar' : 'Salvar'"
          icon="pi pi-save"
          :loading="loading"
          :disabled="!localNote.text.trim() || loading"
          @click="saveHandler"
        />
        <Button
          v-if="isEditing"
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-secondary"
          @click="resetForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  note: {
    type: Object,
    default: () => ({ id: null, text: '' })
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'reset']);

// Criamos uma cópia local da nota para trabalhar
const localNote = ref({ ...props.note });

// Observe quando a nota de entrada mudar (como ao iniciar edição)
watch(() => props.note, (newNote) => {
  // Verificar se a propriedade 'nota' existe no objeto (compatibilidade)
  if (newNote.nota !== undefined) {
    localNote.value = { 
      id: newNote.id, 
      text: newNote.nota // Mapeamos 'nota' para 'text' para uso interno
    };
  } else {
    localNote.value = { ...newNote };
  }
}, { deep: true, immediate: true });

const isEditing = computed(() => !!localNote.value.id);

const saveHandler = () => {
  // Ao salvar, fazemos a conversão de volta para o formato esperado pela API
  const noteToSave = {
    id: localNote.value.id,
    // Se for uma nota existente, usamos o mesmo formato original
    // Se for uma nova nota, apenas enviamos o texto
    ...(localNote.value.id ? { nota: localNote.value.text } : { text: localNote.value.text })
  };
  
  emit('save', noteToSave);
};

const resetForm = () => {
  localNote.value = { id: null, text: '' };
  emit('reset');
};
</script>

<style scoped>
.note-editor {
  margin-bottom: 1.5rem;
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
