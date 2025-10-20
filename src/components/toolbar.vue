<template>
  <div style="border-radius: 0%; width: 100%; margin-bottom: 0.5em; ">
    
    <Menubar :model="leftItems">
      <template #itemicon="{ item, class: iconClass }">
        <i :class="['pi', item.icon, iconClass]" style="font-size: smaller;"></i>
      </template>

      <template #end>
        <div id="profile_button" v-if="!isProfilePage" class="flex items-center gap-2">
          <Button label="Perfil" icon="pi pi-user" severity="contrast" rounded @click="toggleDropdown"  />
          <Menu :model="profileOptions" :popup="true" ref="menu" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Menu from 'primevue/menu';
import { inject } from 'vue';

const base_url = inject('base_url');
const router = useRouter();
const route = useRoute();  // Usando useRoute para obter a rota atual

// Itens do Menubar
const leftItems = ref([
  { label: 'Home', icon: 'pi pi-home', command: () => goTo('Home') },
  { label: 'Marketplace', icon: 'pi pi-shopping-bag', items: [
            {
                label: 'Encomendas',
                items: [
                    {
                        label: 'Leroy Merlin',
                        icon: 'pi pi-megaphone',
                        command: () => goTo('Leroy') 
                    },
                    
                    {
                        label: 'Worten PT',
                        icon: 'pi pi-megaphone',
                        command: () => goTo('Worten') 
                    }

                ],
            },
            // {
            //     label: 'Ofertas',
            //     command: () =>router.push('/offers/leroy/')
            // },
            
            { 
              label: 'Mensagens', icon: 'pi pi-envelope', 
              command: () => router.push('/inbox/leroy/pendente') 
            },
            
          ] },
          
  { label: 'Devoluções', icon: 'pi pi-wallet', command: () => goTo('Devolucoes') },
  { label: 'Incidentes', icon: 'pi pi-exclamation-triangle', command: () => goTo('Incidentes') },
]);


const profileOptions = ref([
  
  { label: 'Meu Perfil', icon: 'pi pi-user', command: () => goTo('Profile') },
  { separator: true },
  { label: 'Sair', icon: 'pi pi-sign-out', command: logout }
]);


const menu = ref(null);

// Função para navegar para a rota específica
function goTo(routeName) {
  router.push({ name: routeName });
}

// Função para exibir o dropdown
function toggleDropdown(event) {
  menu.value.toggle(event);
}

// Função de logout
async function logout() {
  try {
    const response = await fetch(`${base_url}/member/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Inclui cookies na requisição
    });

    if (response.ok) {
      // Redirecionar para a página de login após o logout
      router.push({ name: 'Login' });
    } else {
      console.error('Erro ao realizar logout', await response.json());
    }
  } catch (error) {
    console.error('Erro de rede ao tentar logout', error);
  }
}

// Função para obter os dados do perfil do usuário com cache
async function getProfile() {
  const cachedProfile = JSON.parse(localStorage.getItem('profile'));
  const cacheTimestamp = localStorage.getItem('profileTimestamp');
  const currentTime = new Date().getTime();

  // Se não houver cache ou o cache estiver expirado (mais de 30 segundos)
  if (!cachedProfile || !cacheTimestamp || (currentTime - cacheTimestamp) > 60000) {
    try {
      const response = await fetch(`${base_url}/member/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclui cookies na requisição
      });

      if (response.ok) {
        const data = await response.json();
        // Cache do perfil e timestamp
        localStorage.setItem('profile', JSON.stringify(data));
        localStorage.setItem('profileTimestamp', currentTime.toString());

        // Armazena a função do usuário (se é admin ou não)
        if (data.success && data.data.funcao === 'administrador') {
            leftItems.value.push({
              label: 'Membros', icon: 'pi pi-users', command: () => goTo('Membros')
            });
        }
      } else {
        console.error('Erro ao obter perfil', await response.json());
      }
    } catch (error) {
      console.error('Erro de rede ao tentar obter perfil', error);
    }
  } else {
    // Usar dados do cache se não estiver expirado
    const data = cachedProfile;
    // Armazena a função do usuário (se é admin ou não)
    if (data.success && data.data.funcao === 'administrador') {
      // Adiciona a opção de Faturas se for administrador
      // leftItems.value.push({
      //   label: 'Faturas', icon: 'pi pi-wallet', command: () => goTo('Faturas')
      // });
      leftItems.value.push({
            label: 'Membros', icon: 'pi pi-users', command: () => goTo('Membros')
          });
      
    }
  }
}

// Computed property para verificar se estamos na página de perfil
const isProfilePage = computed(() => {
  return route.name === 'Profile';  // Verifica se a rota atual é a página 'Profile'
});

// Chama a função para obter o perfil quando o componente é montado
onMounted(() => {
  getProfile();
});

</script>

<style scoped>
/* Cursor pointer para o avatar */
.cursor-pointer {
  cursor: pointer;
}

:deep(.p-menubar-submenu)  {
  z-index: 99999 !important;
}
</style>
