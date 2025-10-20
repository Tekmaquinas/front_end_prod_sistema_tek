<script setup>
import { ref, onMounted, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import ChatComponent from "./_chat.vue";

const route = useRoute();
const router = useRouter();
const chatId = route.params.id; // Agora é thread_id
const status = route.params.status;
const marketplace = route.params.marketplace;

// Adicionar event bus para atualizar a lista de chats quando houver mudanças
const emitter = inject("emitter");

// Monitorar mudanças no ID para recarregar o chat se necessário
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      // Recarregar componente quando mudar o thread_id
      // Implementação depende de como o componente ChatComponent está estruturado
    }
  }
);

// Quando a rota mudar, pode ser necessário atualizar outras partes do sistema
onMounted(() => {
  // Caso precise notificar outras partes do sistema sobre a visualização deste chat
  if (emitter) {
    emitter.emit("chat-viewed", chatId);
  }
});
</script>

<template>
  <div class="chat-view">
    <ChatComponent />
  </div>
</template>
