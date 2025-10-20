
<template>
    <div class="flex flex-wrap items-center justify-between gap-1">
        <Button @click="visible = true"  severity="contrast" label="Alterar Porcentagem" size="small" rounded raised/>
        <Dialog v-model:visible="visible" modal header="Editar Porcentagem" :style="{ width: '50vw' }" :breakpoints="{ '500px': '60vw', '375px': '40vw' }">
            
                <div class="flex items-center gap-4 mb-4">
                    <IftaLabel class="w-full md:w-80">
                        <MultiSelect v-model="selectedCanaldeVendas" inputId="ms_cities" :options="CanaldeVendas" optionLabel="name" :maxSelectedLabels="3" class="w-full"variant="filled" />
                        <label for="ms_cities">Canal de Vendas</label>
                    </IftaLabel>
                </div>
                        
                <div class="flex items-center gap-4 mb-4">
                    <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                        
                            <InputGroup>
                                <InputGroupAddon>
                                    <i class="pi pi-money-bill"></i>
                                </InputGroupAddon>
                                <IftaLabel>
                                    <InputNumber v-model="price" inputId="price_promo" showButtons :min="-100" :step="10" mode="currency" currency="EUR" fluid />
                                    <label for="price_promo">Preço Promocional</label>
                                </IftaLabel>
                            </InputGroup>
                        
                    </div>
                    
                </div>

                <div class="flex items-center gap-4 mb-4">
                    <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                            <InputGroup>
                                <InputGroupAddon>
                                    <i class="pi pi-percentage"></i>
                                </InputGroupAddon>
                                <IftaLabel>
                                    <InputNumber v-model="percent_2" inputId="pct_promo" showButtons :step="0.01" mode="decimal" fluid :min="-100" :max="1000" />
                                    <label for="pct_promo">Margem Promocional</label>
                                </IftaLabel>
                            </InputGroup>
                        
                    </div>
                    
                </div>

                <div class="flex items-center gap-4 mb-4">
                    <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-percentage"></i>
                            </InputGroupAddon>
                            <IftaLabel>
                                <InputNumber v-model="percent_1" inputId="pct_default" showButtons :step="0.01" mode="decimal" fluid :min="-100" :max="1000" />
                                <label for="pct_default">Margem Padrão</label>
                            </IftaLabel>
                        </InputGroup>
                    </div>
                </div>



            <template #footer>
                <Button label="Cancel" text severity="secondary"  @click="visible = false" autofocus />
                <Button label="Save" severity="contrast" @click="sendchanges(percent_1,price,percent_2,selectedCanaldeVendas,CanaldeVendas)" autofocus />
            </template>
        </Dialog>
    </div>
</template>


<script setup>
    import { ref, reactive, defineProps, defineEmits, watch, inject } from "vue";
    const visible = ref(false);
    const percent_2 = ref(50);
    const price = ref(0);
    const percent_1 = ref(50);
    
    const props = defineProps({
        route: {
            type: [String, Object],
            required: true,
        },
        fonte: {
            type: String,
            required: true,
        },
        });

    const base_url = inject('base_url_ofertas');

    const selectedCanaldeVendas = ref(null);
    const CanaldeVendas = ref([
        { name: 'LMPT', code: 'LMPT' },
        { name: 'LMFR', code: 'LMFR' },
        { name: 'LMIT', code: 'LMIT' },
        { name: 'LMES', code: 'LMES' }
    ]);


    const sendchanges = async (percent_1, price, percent_2, canaisSelecionados) => {
        try {
            const payload = {
                canais: canaisSelecionados.map(filter => filter.code),
                marketplaces: [props.route], // Apenas o código das opções selecionadas
                percent_1:percent_1,
                percent_2:percent_2,
                min_price:price,
                fonte:props.fonte,
            };

            console.log(payload);

            const response = await fetch(
                `${base_url}/offers/${props.fonte}/percent`,
                    {
                        method: 'POST', // Changed to POST
                        credentials: 'include', // Ensures authentication via cookies
                        headers: {
                            'Content-Type': 'application/json', // Content type is JSON
                        },
                        body: JSON.stringify(payload), // Send the payload as the body of the request
                    }
                );


            // Verifica se o usuário foi redirecionado
            if (response.redirected || response.status === 302 || response.status === 401) {
                window.location.href = "/login"; // Redireciona para a página de login
                return;
            }

            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }

            const data = await response.json();

            // Feche o modal após a execução bem-sucedida
            visible.value = false;

        } catch (error) {
            console.error("Erro ao enviar alterações:", error);
        }
    };



</script>
