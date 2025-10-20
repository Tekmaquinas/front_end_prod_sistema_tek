<template>
  <div class="message-wrapper" :class="isOutgoing ? 'outgoing' : 'incoming'">
    <div
      class="message-bubble"
      :class="[bubbleClass, { 'ai-message': isAIMessage }]"
    >
      <div v-html="message.body"></div>
      <div class="message-footer">
        <p
          class="message-timestamp"
          :class="isOutgoing ? 'text-right' : 'text-left'"
        >
          {{ formatDate(message.date_created) }}
        </p>
        <p
          v-if="message.send_name"
          class="sender-name"
          :class="isOutgoing ? 'text-right' : 'text-left'"
        >
          {{ message.send_name }}
        </p>
      </div>

      <!-- Botões específicos para mensagens da IA -->
      <div v-if="isAIMessage" class="ai-action-buttons">
        <Button
          label="Enviar"
          severity="success"
          size="small"
          class="p-button-sm"
          @click="handleSend"
        />
        <Button
          label="Editar"
          severity="primary"
          size="small"
          class="p-button-sm"
          @click="handleEdit"
        />
        <Button
          label="Ignorar"
          severity="secondary"
          size="small"
          class="p-button-sm"
          @click="handleIgnore"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatDate } from "../utils/helpers";
import Button from "primevue/button";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isOutgoing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["ignore", "edit", "send"]);

const bubbleClass = computed(() =>
  props.isOutgoing ? "outgoing-bubble" : "incoming-bubble"
);

// Verificar se é uma mensagem da IA
const isAIMessage = computed(() => props.message.send_name === "IA");

// Função para remover HTML tags do corpo da mensagem
const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Funções para lidar com os cliques nos botões
const handleIgnore = () => {
  emit("ignore", props.message.id || props.message._id);
};

const handleEdit = () => {
  const cleanText = stripHtml(props.message.body);
  // Quando usar os botões, SEMPRE adiciona o "+" no final
  let sender = "";
  if (props.message.send_name === "") {
    sender = "admin+"; // Adiciona + pois veio do botão
  } else if (props.message.send_name === "+") {
    sender = "admin+";
  } else if (props.message.send_name.includes("IA")) {
    // Substitui IA por admin e garante que tenha + no final
    sender = props.message.send_name.replace("IA", "admin");
    if (!sender.endsWith("+")) sender += "+";
  } else {
    // Para outros nomes, garante que tenha + no final
    sender = props.message.send_name;
    if (!sender.endsWith("+")) sender += "+";
  }

  emit("edit", {
    id: props.message.id || props.message._id,
    text: cleanText,
    sender: sender,
  });
};

const handleSend = () => {
  const cleanText = stripHtml(props.message.body);
  // Quando usar os botões, SEMPRE adiciona o "+" no final
  let sender = "";
  if (props.message.send_name === "") {
    sender = "admin+"; // Adiciona + pois veio do botão
  } else if (props.message.send_name === "+") {
    sender = "admin+";
  } else if (props.message.send_name.includes("IA")) {
    // Substitui IA por admin e garante que tenha + no final
    sender = props.message.send_name.replace("IA", "admin");
    if (!sender.endsWith("+")) sender += "+";
  } else {
    // Para outros nomes, garante que tenha + no final
    sender = props.message.send_name;
    if (!sender.endsWith("+")) sender += "+";
  }

  emit("send", {
    id: props.message.id || props.message._id,
    text: cleanText,
    sender: sender,
  });
};
</script>

<style scoped>
.message-wrapper {
  display: flex;
  margin-bottom: 1rem;
}

.message-wrapper.outgoing {
  justify-content: flex-end;
}

.message-wrapper.incoming {
  justify-content: flex-start;
}

.message-bubble {
  border-radius: 12px;
  padding: 0.8rem 1rem;
  max-width: 70%;
  word-break: break-word;
}

.outgoing-bubble {
  background-color: #e6f7ff;
  color: #0d1f3f;
}

.incoming-bubble {
  background-color: #f0f2f5;
  color: #242424;
}

.message-footer {
  margin-top: 0.25rem;
}

.message-timestamp {
  font-size: 0.7rem;
  color: #999;
  margin: 0;
}

.sender-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #666;
  margin: 0;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

/* Estilo para mensagens da IA */
.ai-message {
  opacity: 0.8;
}

/* Estilo para os botões de ação da IA */
.ai-action-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  justify-content: flex-end;
}

.ai-action-buttons .p-button-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>
