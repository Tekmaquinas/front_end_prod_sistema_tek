<template>
  <Dialog
    :visible="visible"
    modal
    header="Criar Novo Chat"
    :style="{ width: '500px' }"
    :closable="true"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="order-id" class="font-bold">ID do Pedido</label>
        <InputText
          id="order-id"
          v-model="formData.orderId"
          placeholder="Digite o ID do pedido"
          class="w-full"
          :class="{ 'p-invalid': errors.orderId }"
        />
        <small v-if="errors.orderId" class="p-error">{{
          errors.orderId
        }}</small>
      </div>

      <!-- <div class="field">
        <label for="marketplace" class="font-bold">Marketplace</label>
        <Dropdown
          id="marketplace"
          v-model="formData.marketplace"
          :options="marketplaceOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecione o marketplace"
          class="w-full"
          :class="{ 'p-invalid': errors.marketplace }"
        />
        <small v-if="errors.marketplace" class="p-error">{{
          errors.marketplace
        }}</small>
      </div> -->

      <div class="field" style="margin-top: 20px;">
        <label for="message" class="font-bold">Mensagem Inicial</label>
        <Textarea
          id="message"
          v-model="formData.message"
          rows="5"
          placeholder="Digite a mensagem inicial"
          class="w-full"
          :class="{ 'p-invalid': errors.message }"
          autoResize
        />
        <small v-if="errors.message" class="p-error">{{
          errors.message
        }}</small>
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        class="p-button-text"
        @click="closeDialog"
      />
      <Button
        label="Criar"
        icon="pi pi-check"
        @click="createChat"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { ChatService } from "./services/api";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:visible", "chatCreated"]);

const router = useRouter();
const toast = useToast();
const isLoading = ref(false);

const formData = reactive({
  orderId: "",
  marketplace: null,
  message: "",
});

const errors = reactive({
  orderId: "",
  marketplace: "",
  message: "",
});

const marketplaceOptions = [
  { label: "Leroy Merlin", value: "leroy" },
  { label: "Worten", value: "worten" },
];

// Validar o formulário
const validateForm = () => {
  let isValid = true;

  // Limpar erros anteriores
  errors.orderId = "";
  errors.marketplace = "";
  errors.message = "";

  // Validar ID do pedido
  if (!formData.orderId.trim()) {
    errors.orderId = "ID do pedido é obrigatório";
    isValid = false;
  }

  // Validar marketplace
  if (!formData.marketplace) {
    errors.marketplace = "Selecione um marketplace";
    isValid = false;
  }

  // Validar mensagem
  if (!formData.message.trim()) {
    errors.message = "Digite uma mensagem inicial";
    isValid = false;
  }

  return isValid;
};

// Criar um novo chat
const createChat = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const response = await ChatService.createChat(formData.orderId, {
      message: formData.message,
      marketplace: formData.marketplace,
    });

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Chat criado com sucesso",
      life: 3000,
    });

    // Emitir evento indicando que um chat foi criado
    emit("chatCreated", response);
    
    // Usar o thread_id retornado pela API para navegação
    if (response && response.thread_id) {
      // Navegar para o novo chat usando thread_id
      router.push(`/inbox/${formData.marketplace}/pendente/chat/${response.thread_id}`);
    } else {
      // Fallback para order_id caso thread_id não esteja disponível
      router.push(`/inbox/${formData.marketplace}/pendente/chat/${formData.orderId}`);
    }
  } catch (error) {
    let errorMessage = "Erro ao criar o chat";

    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    }
    
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: errorMessage,
      life: 5000,
    });
    
    console.error("Erro ao criar chat:", error);
  } finally {
    isLoading.value = false;
  }

  // Fechar o diálogo
  closeDialog();
};

const closeDialog = () => {
  // Limpar o formulário
  formData.orderId = "";
  formData.marketplace = null;
  formData.message = "";

  // Fechar o diálogo
  emit("update:visible", false);
};
</script>

<style scoped>
/* Estilos específicos se necessário */
</style>
