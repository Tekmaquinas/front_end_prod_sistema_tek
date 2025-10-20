<template>
  <toolbar />
    <div style="height: 90%; border: none !important; padding: 0px; font-size:smaller;">
      <div class="flex gap-2">
        <div class="w-1/5" style="margin-left: 10px;">
            <Menu :model="items" class="w-full" style="border-radius: 20px; height: calc(100vh - 80px);">
              <template #start>
                <div class="flex justify-between" style="padding: 16px 20px 10px;">
                    <h3 style="margin: auto 0px;">
                      Mensagens 
                    </h3>
                    <Button icon="pi pi-plus" severity="contrast" size="small" @click="openNewChatDialog"/>
                </div>
              </template>

              <template #submenulabel="{ item }" style="margin: 20px !important;">
                <span class="text-primary font-bold">{{ item.label }}</span>
              </template>


              <template #item="{ item, props }" >
                  <router-link v-if="item.route" v-slot="{ href, navigate, isActive }"  :to="item.route" custom>
                      <a v-ripple :href="href" v-bind="props.action" @click="navigate"  :class="{ 'bg-emphasis rounded-border': isActive }">
                        <span :class="[item.icon, 'text-primary group-hover:text-inherit']" />
                        <span :class="['ml-2', { 'font-semibold': item.items }]">
                            {{ item.label }}
                        </span>
                        <Badge v-if="item.badge && item.badge > 0" 
                               class="ml-auto" 
                               :value="item.badge"  
                               :severity="item.severity" 
                               size="small"/>
                      </a>
                  </router-link>
              </template>
            </Menu>
        </div>

        <div class="w-full">
          <Conversas />
        </div>

      </div>

    </div>

    <!-- Diálogo para criar novo chat -->
    <NewChatDialog 
      v-model:visible="newChatDialogVisible" 
      @chat-created="onChatCreated"
    />
</template>

<script setup>
import toolbar from '../components/toolbar.vue';
import Conversas from '../components/mensagens_/_conversas.vue';
import NewChatDialog from '../components/mensagens_/NewChatDialog.vue';

import { ref, watch, onMounted, inject, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { ChatService } from '../components/mensagens_/services/api';

const endpoint    = useRoute();
const marketplace = ref(endpoint.params.marketplace);
const state       = ref(endpoint.params.state);
const notifications = ref({
  leroy: { notific: 0, alerts: 0, urgente: 0 },
  worten: { notific: 0, alerts: 0, urgente: 0 },
  ia_status: { notificacao: 0, info: 0 },
  total: 0,
  saved: 0
});
const emitter = inject('emitter', null);

// Função para buscar notificações
const fetchNotifications = async () => {
  try {
    const data = await ChatService.getNotifications();
    
    // Atualizar com os dados da API
    notifications.value = {
      leroy: {
        notific: data.leroy?.notific || 0,
        alerts: data.leroy?.alerts || 0,
        urgente: data.leroy?.urgente || 0
      },
      worten: {
        notific: data.worten?.notific || 0,
        alerts: data.worten?.alerts || 0,
        urgente: data.worten?.urgente || 0
      },
      ia_status: {
        notificacao: data.ia_status?.notificacao || 0,
        info: data.ia_status?.info || 0
      },
      total: data.total || 0,
      saved: data.saved || 0
    };
    
    updateMenuBadges();
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
  }
};

// Função para atualizar os badges no menu
const updateMenuBadges = () => {
  // Resetar todos os badges com valor 0
  resetAllBadges();

  // Atualizar Leroy Merlin
  const leroyGroup = items.value.find(item => item.key === 'leroy_merlin');
  if (leroyGroup) {
    // Badge do grupo principal - mostrar apenas se houver notificações
    leroyGroup.badge = notifications.value.leroy.notific > 0 ? 
                        notifications.value.leroy.notific : 0;
    
    // Badges dos subitens - apenas mostrar valores positivos
    updateItemBadgeIfPositive(leroyGroup, 'unread_leroy', notifications.value.leroy.notific);
    updateItemBadgeIfPositive(leroyGroup, 'alert_leroy', notifications.value.leroy.alerts);
    updateItemBadgeIfPositive(leroyGroup, 'urgent_leroy', notifications.value.leroy.urgente);
  }
  
  // Atualizar Worten
  const wortenGroup = items.value.find(item => item.key === 'worten_pt');
  if (wortenGroup) {
    // Badge do grupo principal
    wortenGroup.badge = notifications.value.worten.notific > 0 ? 
                          notifications.value.worten.notific : 0;
    
    // Badges dos subitens
    updateItemBadgeIfPositive(wortenGroup, 'unread_worten', notifications.value.worten.notific);
    updateItemBadgeIfPositive(wortenGroup, 'alert_worten', notifications.value.worten.alerts);
    updateItemBadgeIfPositive(wortenGroup, 'urgent_worten', notifications.value.worten.urgente);
  }
  
  // Atualizar IA
  const iaGroup = items.value.find(item => item.key === 'ia_pt');
  if (iaGroup) {
    // Badge do grupo principal
    iaGroup.badge = notifications.value.ia_status.notificacao > 0 ? 
                      notifications.value.ia_status.notificacao : 0;
    
    // Badges dos subitens
    updateItemBadgeIfPositive(iaGroup, 'attention_ia', notifications.value.ia_status.notificacao);
    updateItemBadgeIfPositive(iaGroup, 'info_ia', notifications.value.ia_status.info);
  }
  
  // Atualizar notificações de salvos e finalizados
  const savedItem = items.value.find(item => item.key === 'saved');
  if (savedItem) {
    savedItem.badge = notifications.value.saved > 0 ? notifications.value.saved : 0;
  }
};

// Função auxiliar para atualizar badge apenas se valor for positivo
const updateItemBadgeIfPositive = (group, key, value) => {
  // Verificar se o grupo é um array ou um objeto com propriedade items
  if (Array.isArray(group)) {
    // Se for um array, procurar pelo item diretamente no array
    const item = group.find(i => i.key === key);
    if (item) {
      item.badge = value > 0 ? value : 0;
    }
  } else if (group && group.items) {
    // Se for um objeto com propriedade items, procurar nos itens
    const item = group.items.find(i => i.key === key);
    if (item) {
      item.badge = value > 0 ? value : 0;
    }
  }
};

// Função para resetar todos os badges para 0
const resetAllBadges = () => {
  items.value.forEach(group => {
    if (group.items) {
      group.items.forEach(item => {
        item.badge = 0;
      });
    }
  });
};

const items = ref([
  {
    separator: true
  },
  {
    key: 'leroy_merlin', label: 'Leroy Merlin', icon: 'pi pi-envelope', badge: 0,
    items: [
      {
        key: 'inbox_leroy', label: "Caixa de Entrada", icon: 'pi pi-inbox', 
        route: '/inbox/leroy/pendente',
      },
      {
        key: 'unread_leroy', label: "Não Lidos", icon: 'pi pi-bell', badge: 0, severity: 'danger',
        route: '/inbox/leroy/nao_lidos',
      },
      {
        key: 'read_leroy', label: 'Lidos', icon: 'pi pi-check-circle',
        route: '/inbox/leroy/lidos',
      },
      {
        key: 'alert_leroy', label: 'Atenção', icon: 'pi pi-exclamation-circle', badge: 0, severity: 'warning',
        route: '/inbox/leroy/atencao',
      },
      {
        key: 'urgent_leroy', label: 'Urgentes', icon: 'pi pi-exclamation-triangle', badge: 0, severity: 'danger',
        route: '/inbox/leroy/urgente',
      },
      {
        key: 'operator_leroy', label: 'Operador', icon: 'pi pi-user',
        route: '/inbox/leroy/operador',
      },
    ]
  },
  {
    key: 'worten_pt', label: 'Worten PT', icon: 'pi pi-envelope', badge: 0,
    items: [
      {
        key: 'inbox_worten', label: "Caixa de Entrada", icon: 'pi pi-inbox', 
        route: '/inbox/worten/pendente',
      },
      {
        key: 'unread_worten', label: "Não Lidos", icon: 'pi pi-bell', badge: 0, severity: 'danger',
        route: '/inbox/worten/nao_lidos',
      },
      {
        key: 'read_worten', label: 'Lidos', icon: 'pi pi-check-circle',
        route: '/inbox/worten/lidos',
      },
      {
        key: 'alert_worten', label: 'Atenção', icon: 'pi pi-exclamation-circle', badge: 0, severity: 'warning',
        route: '/inbox/worten/atencao',
      },
      {
        key: 'urgent_worten', label: 'Urgentes', icon: 'pi pi-exclamation-triangle', badge: 0, severity: 'danger',
        route: '/inbox/worten/urgente',
      },
      {
        key: 'operator_worten', label: 'Operador', icon: 'pi pi-user',
        route: '/inbox/worten/operador',
      },
    ]
  },
  {
    key: 'ia_pt', label: 'Atendente I.A', icon: 'pi pi-robot',
    items: [
      {
        key: 'attention_ia', label: 'Atenção', icon: 'pi pi-eye',
        route: '/inbox/ia/atencao',
      },
      {
        key: 'info_ia', label: 'Info', icon: 'pi pi-info-circle',
        route: '/inbox/ia/info',
      }
    ]
  },
  {
    separator: true
  },
  {
    key: 'metrics', label: 'Métricas', icon: 'pi pi-chart-bar',
    route: '/metricas',
  },
  {
    key: 'finished', label: 'Finalizados', icon: 'pi pi-check-square',
    route: '/inbox/all/finalizado',
  },
  {
    key: 'saved', label: 'Salvos', icon: 'pi pi-bookmark', badge: 0, severity: 'info',
    route: '/inbox/all/saved',
  }
]);

// Configurar atualização automática de notificações a cada 10 segundos
let notificationInterval;

// Configurar escuta de eventos para atualização de notificações
const setupNotificationListeners = () => {
  if (emitter) {
    // Escutar eventos de atualização de notificações
    emitter.on('notifications-updated', fetchNotifications);
  }
};

// Observar mudanças no parâmetro da rota para categoria/estado
watch([() => endpoint.params.marketplace, () => endpoint.params.state], 
  ([newMarketplace, newState], [oldMarketplace, oldState]) => {
    marketplace.value = newMarketplace;
    state.value = newState;
    
    // Atualizar notificações quando mudar de categoria
    if (newMarketplace !== oldMarketplace || newState !== oldState) {
      fetchNotifications();
    }
  }
);

onMounted(() => {
  fetchNotifications();
  setupNotificationListeners();
  
  // Atualizar notificações a cada 10 segundos (10000ms)
  notificationInterval = setInterval(fetchNotifications, 10000);
});

onBeforeUnmount(() => {
  // Limpar o intervalo e remover escutas de eventos
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
  
  if (emitter) {
    emitter.off('notifications-updated');
  }
});

// Estado para o diálogo de novo chat
const newChatDialogVisible = ref(false);

// Abrir diálogo para criar novo chat
const openNewChatDialog = () => {
  newChatDialogVisible.value = true;
};

// Callback quando um chat é criado
const onChatCreated = () => {
  // Atualizar notificações após criar um novo chat
  fetchNotifications();
};
</script>

<style scoped>
.active-item {
  background-color: var(--p-surface-200) !important;
}
</style>
