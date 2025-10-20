<template>
    <div class="card">
      <DataTable :value="members" tableStyle="min-width: 50rem">
        <template #header>          
          <div class="flex flex-wrap items-center justify-between gap-5">
            <div class="flex flex-wrap items-center justify-between gap-5">
              <span class="text-xl font-bold">Membros</span>
            
            </div>
            <div class="flex flex-wrap items-center justify-between gap-5">
              <div class="flex flex-wrap items-center justify-between gap-1">
                  <Button @click="visible = true"  severity="contrast" label="Adicionar Usuario" size="small" rounded raised />
                  <Dialog v-model:visible="visible" modal header="Formulário" :style="{ width: '30vw' }" :breakpoints="{ '500px': '60vw', '375px': '40vw' }">

                    <form @submit.prevent="handleRegister">
                      <div class="flex items-center gap-4 mb-4">
                          <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                              <InputGroup>
                                  <IftaLabel>
                                    <InputText v-model="newMember.nome" id="nome" type="text" required />
                                    <label for="nome">Nome e sobrenome</label>
                                  </IftaLabel>
                              </InputGroup>
                          </div>
                      </div>

                      <div class="flex items-center gap-4 mb-4">
                          <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                              <InputGroup>
                                  <IftaLabel>
                                    <InputText v-model="newMember.email" id="email" type="email" required />
                                    <label for="email">E-mail</label>
                                  </IftaLabel>
                              </InputGroup>
                          </div>
                      </div>
                      <div class="flex items-center gap-4 mb-4">
                          <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                              <InputGroup>
                                  <IftaLabel>
                                    <Password  id="senha" v-model="newMember.senha" promptLabel="Digite uma senha" weakLabel="muito simples" mediumLabel="Complexidade média" strongLabel="Senha complexa" />
                                    <label for="senha">Senha</label>
                                  </IftaLabel>
                              </InputGroup>
                          </div>
                      </div>
                      
                      <div class="flex items-center justify-between gap-4 mb-4">
                        <Select v-model="selectedLevel" :options="Levels" optionLabel="name" placeholder="Nivel de Acesso" style="width: 45%;" class="w-full" />
                        <div class="flex justify-end" style="width: 55%;">
                          <Button label="Cancel" text severity="secondary"  @click="visible = false" autofocus />
                          <Button label="Cadastrar" severity="contrast" type="submit" autofocus  />
                        </div>

                      </div>
                    </form>

                  </Dialog>
              </div>
                <Button icon="pi pi-refresh" severity="contrast" size="small" rounded raised @click="ReloadPageSelected" />
            </div>

          </div>
        </template>
        <Column field="nome" header="Nome"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="funcao" header="Função"></Column>
        <template #footer>
          In total there are {{ members.length }} members.
        </template>
      </DataTable>
      <Toast position="bottom-right" group="br" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { inject } from 'vue';
  import { useToast } from "primevue/usetoast";


  const toast = useToast();
  const base_url = inject('base_url'); // URL base do API
  const members = ref([]);
  const visible = ref(false);
  const selectedLevel = ref();
  const Levels = ref([
      { name: 'Membro', code: 'membro' },
      { name: 'Administrador', code: 'administrador' },
      { name: 'Gestor', code: 'gestor' },

  ]);

  const newMember = ref({
    nome: '',
    email: '',
    senha: '',
    funcao: ''
  });

    // Evento de mudança de página
const ReloadPageSelected = () => {
  loadMembers();
  };

  // Função para carregar os membros do endpoint
const loadMembers = async () => {
    try {
      const response = await fetch(`${base_url}/member/all`, {
        method: 'GET',
        credentials: 'include', // Inclui os cookies de autenticação
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
  
      const data = await response.json();
      members.value = data.data; // Armazenar os dados dos membros na variável 'members'
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

const handleRegister = async () => {
  console.log('Tentando cadastrar novo membro:', newMember.value); // Verifique os dados antes de enviar
    const response = await fetch(`${base_url}/member/register`, {
      method: 'POST',
      credentials: 'include', // Inclui os cookies de autenticação
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMember.value), // Enviar o corpo como JSON
    });

    if (!response.ok) {
      throw new Error('Failed to register member');
    }

    const data = await response.json();
    console.log('Resposta do servidor:', data); // Log da resposta do servidor

    if (data.status === 'OK') {
      // Mensagem de sucesso
      toast.add({
                      severity: 'success',
                      summary: 'Membro cadastrado com sucesso!',
                      group: 'br',
                      life: 3000
                  });
      loadMembers(); // Recarregar a lista de membros
      newMember.value = { nome: '', email: '', senha: '', funcao: 'membro' }; // Limpar os campos do formulário
    }
    visible.value = false;
  
};

  // Carregar os membros assim que o componente for montado
  onMounted(() => {
    loadMembers();
  });
  </script>
  