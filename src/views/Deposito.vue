<template>
    <toolbar />
    <div style="margin: auto .5rem; padding: 2.5rem; background-color: white;  flex: 1; border-radius: 15px; margin-top: 10px;">
        <DataTable 
        :value="itens_warehouse" 
        size="small" 
        stripedRows
        :rows="5" 
        paginator
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :pt="{cell: { style: 'padding: 0 !important' }}"
        >
        <template #header>          
            <div class="flex flex-wrap items-center justify-between gap-5" style=" margin-bottom: .2rem;">
                    <div class="flex w-full gap-3 " >
                        <div class="flex flex-col w-8/12">
                            <label for="link_vevor">Link vevor</label>
                            <InputText id="link_vevor" v-model="link" aria-describedby="username-help" size="small" :invalid="!link?.includes('www.vevor.de') && link" />
                            <span v-if="!link?.includes('www.vevor.de') && link" style="font-size:14px; color: red;"  size="small" severity="danger" variant="simple">
                                Apenas Links Vevor
                            </span>
                        </div>
                        <div class="flex flex-col w-3/16">
                            <label for="quantidade">Q. stock</label>
                            <InputNumber id="quantidade" v-model="quantidade" :useGrouping="false" showButtons :min="0" fluid size="small"  />
                        </div>
                        <div class="flex flex-col w-3/12">
                            <label for="preco_worten">Preço Worten</label>
                            <InputNumber id="preco_worten" v-model="preco_worten" showButtons mode="currency" currency="EUR" locale="de-DE" fluid :min="0" :step="0.25" size="small"
                            :invalid="selectedtype.code === '1' && preco_worten === 0"
                            />
                            <span style="font-size:14px; color: red;" v-if="selectedtype.code === '1' && preco_worten === 0" size="small" severity="danger" variant="simple">
                                Valor Incorreto!
                            </span>
                        </div>
                        <div class="flex flex-col w-3/12">
                            <label for="preco_leroy">Preço Leroy</label>
                            <InputNumber id="preco_leroy" v-model="preco_leroy" showButtons mode="currency" currency="EUR" locale="de-DE" fluid :min="0" :step="0.25" size="small"
                            :invalid="selectedtype.code === '1' && preco_leroy === 0"
                            />
                            <span style="font-size:14px; color: red;" v-if="selectedtype.code === '1' && preco_leroy === 0" size="small" severity="danger" variant="simple">
                                Valor Incorreto!
                            </span>
                        </div>
                        <div class="flex flex-col w-3/12">
                            <label for="condition">Condição</label>
                            <Select id="condition" v-model="selectedtype" :options="options_conditions" optionLabel="name" placeholder="Selecione a condição" size="small" />
                        </div>

                        <div class="justify-end mt-5">
                            <Button label="Adicionar" @click="addItem" :disabled="!selectedtype && selectedtype.code === '1' && preco_worten === 0 || !link?.includes('vevor.de') && link || selectedtype.code === '1' && preco_leroy === 0 " />
                        </div>
                    </div>
                </div>
            </template>


            <Column field="thumb" header="imagem" style="min-width: 40px;max-width: 41px;align-self: center;">
                    <template #body="{ data, field }">
                        <img :src="data.thumb" :alt="data.name" class="w-24 rounded image_products" />
                    </template>
            </Column>
            <Column field="name" header="Item" style="min-width: 150px; max-width: 360px;">
                <template #body="{ data, field }">
                    <a :href="data['link']" 
                        target="_blank" 
                        style="font-weight: 500; display: inline-block; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" 
                        rel="noopener noreferrer">
                        {{ data['name'] }}
                    </a>
                    <p style=" font-size: small; font-stretch: condensed;" 
                        class="text-surface-500 dark:text-surface-100" 
                        rounded>
                        sku product: {{ data.sku }}
                    </p>
                </template>

            </Column>
            <Column field="stock" header="quantidade"  class="!text-end" style="width: 1.5rem; padding: 5px;"></Column>
            <Column headerStyle="text-align: center;" field="original_price" header="Preço Vevor" class="text-center"  style="width: 10rem;">
                <template #body="{ data, field }">
                    <p class="text-center" >{{ data[field] }}</p>
                </template>
            </Column>

            <Column headerStyle="text-align: center;" field="seller_leroy_price" header="Preço Leroy" class="text-center"  style="width: 10rem;">
                <template #body="{ data, field }">
                    <p class="text-center" >{{ data[field] }}</p>
                </template>
            </Column>

            <Column headerStyle="text-align: center;" field="seller_worten_price" header="Preço Worten" class="text-center"  style="width: 10rem;">
                <template #body="{ data, field }">
                    <p class="text-center" >{{ data[field] }}</p>
                </template>
            </Column>
            
            <Column headerStyle="text-align: center;" field="role_price" header="Precificação" class="text-center"  style="width: 6rem;">
                <template #body="{ data, field }">
                    <Tag v-if="data[field] === '1'" class="text-center" value="Preço Fixo" severity="info" style="font-weight: 500;"/>
                    <Tag v-else-if="data[field] === '0'" class="text-center" value="Dinâmico" severity="secondary" style="font-weight: 500;"/>
                </template>
            </Column>
            <Column style="width: 0.1rem; padding-right: 15px;">
                <template #body="{ data }">
                <div>
                    <Button
                    icon="pi pi-pen-to-square"
                    @click="OpenEditor(data)"
                    severity="secondary"
                    style="background: transparent; border: none;"
                    rounded
                    ></Button>
                </div>
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog v-model:visible="showDialogEditor" modal  :style="{ width: '50dvw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <template #header>
            <div class="justify-center gap-2">
                <h3 class="font-bold whitespace-nowrap">Editando Item</h3>
                <ProgressBar v-if="isEditing===true" mode="indeterminate" style="height: 6px;" class="w-full"></ProgressBar>

            </div>
            
        </template>
        
        <div class="w-full gap-3">
            <!-- Conteúdo do diálogo, inputs e etc. -->
            <div class="flex w-full gap-3">
                <div class="flex flex-col w-full">
                    <label for="link_vevor_editor">Link vevor</label>
                    <InputText id="link_vevor_editor" v-model="selectedRowData.link" aria-describedby="username-help" size="small" fluid :invalid="!selectedRowData.link?.includes('www.vevor.de') && selectedRowData.link"/>
                    <span v-if="!selectedRowData.link?.includes('www.vevor.de') && selectedRowData.link" style="font-size:14px; color: red;"  size="small" severity="danger" variant="simple">
                        Apenas Links Vevor
                    </span>
                </div>
                <div class="flex flex-col">
                    <label for="quantidade_editor">Q. stock</label>
                    <InputNumber id="quantidade_editor" v-model="selectedRowData.stock" :useGrouping="false" showButtons :min="0" fluid size="small" autofocus />
                </div>
            </div>
            <div class="flex w-full gap-3 mt-5">
                <div class="flex flex-col w-4/12">
                    <label for="preco_worten_editor">Preço Worten</label>
                    <InputNumber id="preco_worten_editor" v-model="selectedRowData.seller_worten_price" showButtons mode="currency" currency="EUR" locale="de-DE" fluid :min="0" :step="0.25" size="small" :invalid="selectedRowData.role_price === '1' && selectedRowData.seller_worten_price === 0"/>
                    <!-- <span style="font-size:14px; color: red;" v-if="selectedRowData.role_price === '1' && selectedRowData.seller_worten_price === 0" size="small" severity="danger" variant="simple">
                        Valor Incorreto!
                    </span> -->
                    <Message size="small" severity="secondary" variant="simple">
                        Preço atual: {{ selectedRowData.old_seller_worten_price }}.
                    </Message>
                </div>
                <div class="flex flex-col w-4/12">
                    <label for="preco_leroy_editor">Preço Leroy</label>
                    <InputNumber id="preco_leroy_editor" v-model="selectedRowData.seller_leroy_price"  showButtons mode="currency" currency="EUR" locale="de-DE" fluid :min="0" :step="0.25" size="small" :invalid="selectedRowData.role_price === '1' && selectedRowData.seller_leroy_price === 0"/>
                    <!-- <span style="font-size:14px; color: red;" v-if="selectedRowData.role_price === '1' && selectedRowData.seller_leroy_price === 0" size="small" severity="danger" variant="simple">
                        Valor Incorreto!
                    </span> -->
                    <Message size="small" severity="secondary" variant="simple">
                        Preço atual: {{ selectedRowData.old_seller_leroy_price }}.
                    </Message>
                </div>
                <div class="flex flex-col w-4/12">
                    <label for="condition_editor">Condição</label>
                    <Select  v-model="selectedRowData.role_price" inputId="condition_editor"  :options="options_conditions"  optionLabel="name" optionValue="code"  size="small" />
                </div>
            </div>
        </div>
        <template #footer>
            <!-- Exibe o ProgressBar quando isEditing for true -->
             <div class="flex w-full">
                <div v-if="isEditing !==true" class="flex w-full mt-5 gap-5">
                    
                    <ConfirmPopup></ConfirmPopup>
                    <Button label="Deletar" @click="confirm1($event)"  severity="danger" variant="outlined"  />
                </div>
                <div class="flex justify-end w-full">
                    <div v-if="isEditing !==true" class="flex mt-5 gap-5">
                        <Button label="Cancelar" @click="CloseEditor()" severity="contrast" variant="outlined"/>
                        <Button label="Salvar Alteração" @click="EditItem" severity="contrast" :disabled="selectedRowData.role_price === '1' && selectedRowData.seller_worten_price === 0 ||selectedRowData.role_price === '1' && selectedRowData.seller_leroy_price === 0 || !selectedRowData.link?.includes('www.vevor.de') && selectedRowData.link "/>
                    </div>

                    <div v-if="isEditing ===true" class="flex mt-5 gap-5" >
                        <Button label="Cancelar" @click="CloseEditor()" severity="contrast" variant="outlined"  />
                        <Button label="Salvar Alteração" @click="EditItem" severity="contrast" disabled />
                    </div>
                </div>

             </div>

        </template>
    </Dialog>
    <Toast />
</template>
    
<script setup>
import { ref, onMounted, inject } from 'vue';
import toolbar from '../components/toolbar.vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const base_url = inject('base_url_ofertas')
const link = ref(null);
const itens_warehouse = ref([]);
const preco_worten = ref(0);
const preco_leroy = ref(0);
const quantidade = ref(1);
const selectedtype = ref({ name: 'Preço Dinamico', code: "0" });
const selectedRowData = ref({});
const showDialogEditor = ref(false);
const isEditing = ref(false); 


const confirm1 = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Tem certeza que quer deletar?',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Deletar',
            severity: 'danger'
        },
        accept: () => {
            toast.add({ severity: 'info', summary: 'Apagado', detail: 'item foi removido com sucesso', life: 5000 });
            DeleteItem()
        },
        reject: () => {}
    });
};


const options_conditions = ref([
    { name: 'Preço Fixo', code: "1" },
    { name: 'Preço Dinamico', code: "0" },
]);



const ReloadPageSelected = () => { LoadOffers(); };

const OpenEditor = (rowData) => {
    selectedRowData.value = rowData;
    selectedRowData.value.seller_leroy_price = 0
    selectedRowData.value.seller_worten_price = 0
    showDialogEditor.value = true;   // Abre o diálogo
};

const CloseEditor = () => {
    selectedRowData.value = {}; // Limpa os dados da linha
    showDialogEditor.value = false;   // Fecha o diálogo
};

const LoadOffers = async () => {
    try {
    const response = await fetch(`${base_url}/warehouse/all`, {
        method: 'GET',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch members');
    }
    const data = await response.json();
    itens_warehouse.value = data;
    } catch (error) {
    console.error('Error fetching members:', error);
    }
};

const addItem = async () => {
    try {
    const response = await fetch(`${base_url}/warehouse/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        link: link.value,
        stock: quantidade.value,
        seller_leroy_price: preco_leroy.value,
        seller_worten_price: preco_worten.value,
        role_price: selectedtype.value.code,
        }),
    });
    if (!response.ok) {
        throw new Error('Erro ao adicionar item');
    }
    // Limpar os campos após adicionar (opcional)
    link.value = null;
    preco_leroy.value = 0;
    preco_worten.value = 0;
    selectedtype.value = options_conditions.value.find(c => c.code === "0");
    await LoadOffers(); // Atualizar lista
    toast.add({ severity: 'success', summary: 'Criado', detail: 'seu item foi adicionado com sucesso!', life: 10000 });
    } catch (error) {
    console.error('Erro ao adicionar item:', error);
    }
};

const EditItem = async () => {
    isEditing.value = true;
    try {
    const response = await fetch(`${base_url}/warehouse/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        id: selectedRowData.value.id,
        link: selectedRowData.value.link,
        stock: selectedRowData.value.stock,
        seller_leroy_price: selectedRowData.value.seller_leroy_price,
        seller_worten_price: selectedRowData.value.seller_worten_price,
        role_price: selectedRowData.value.role_price,
        }),
    });
    if (!response.ok) {
        throw new Error('Erro ao editar item');
    }
    
    const data = await response.json();
    const index = itens_warehouse.value.findIndex(item => item.id === data.id);
    if (index !== -1) {
    itens_warehouse.value[index] = { ...itens_warehouse.value[index], ...data };
    }

    } catch (error) {
    console.error('Erro ao editar item:', error);
    } finally {
    isEditing.value = false;
    CloseEditor();
    }
};

const DeleteItem = async () => {
    isEditing.value = true;
    try {
    const response = await fetch(`${base_url}/warehouse/delete`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        id: selectedRowData.value.id,
        }),
    });
    if (!response.ok) {
        throw new Error('Erro ao editar item');
    }
    const data = await response.json();
    itens_warehouse.value = data;

    } catch (error) {
    console.error('Erro ao editar item:', error);
    } finally {
    isEditing.value = false;
    CloseEditor();
    }
};

onMounted(() => {
    LoadOffers();
});
</script>
    
<style scoped>
.deposito {
    padding: 20px;
}
</style>
