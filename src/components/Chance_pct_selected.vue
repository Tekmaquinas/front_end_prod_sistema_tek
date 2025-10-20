<template>

    <Dialog v-model:visible="visible" modal header="Editar Porcentagem" :style="{ width: '60vw' }" :breakpoints="{ '500px': '60vw', '375px': '40vw' }">
      <div class="gap-1">
        <div class="grid-container" style="width:100%;">
          <div class="grid grid-cols-1 gap-2" style="flex-wrap: wrap; column-gap: 25px;">
            
            <Accordion value="0">
                <AccordionPanel value="0">
                    <AccordionHeader>LMPT - Portugal</AccordionHeader>
                    <AccordionContent>
                        <div class="w-full" style="margin-bottom: 20px;">
                            <div class="grid grid-cols-2 " style="flex-wrap: wrap; column-gap: 10px;">
                                <div class="m-0 column_border_right" style="padding-right: 10px; margin-right: 0px;">
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço Original:</p>
                                            <p style="font-weight: 600;">{{ formatCurrency(localData['price']) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço de Venda:</p>
                                            <p style="color: green;font-weight: 500;">{{ formatCurrency(localData['price_discount_LMPT']) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço Minimo:</p>
                                            <p style="color: green;font-weight: 500;">{{ formatCurrency(localData['min_price_LMPT']) }}</p>
                                        </div>
                                    </div>
                                </div>

                                
                                <div class="m-0">
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Padrão %:</p>
                                            <p>{{ localData['percent_1_discount_LMPT'] }} %</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Condicionado %:</p>
                                            <p>{{ localData['percent_2_discount_LMPT'] }} %</p>
                                        </div>
                                    </div>

                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Aplicado %:</p>
                                            <p>{{ localData['percent_2_discount_LMPT'] }} %</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
   
                        </div>
                        <div class="w-full">
                            <div class="grid grid-cols-3 " style="flex-wrap: wrap; column-gap: 10px;">    
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                                        
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <i class="pi pi-money-bill"></i>
                                                </InputGroupAddon>
                                                <IftaLabel>
                                                    <InputNumber v-model="localData.min_price_LMPT" inputId="price_promo" showButtons :min="-100" :step="10" mode="currency" currency="EUR" fluid />
                                                    <label for="price_promo">Preço Minimo</label>
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
                                                    <InputNumber v-model="localData.percent_2_discount_LMPT" inputId="pct_promo" showButtons :step="5" mode="decimal" fluid :min="-100" :max="1000" />
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
                                                <InputNumber v-model="localData['percent_1_discount_LMPT']" inputId="pct_default" showButtons :step="5" mode="decimal" fluid :min="-100" :max="1000" />
                                                <label for="pct_default">Margem Padrão</label>
                                            </IftaLabel>
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>
                        </div>




                    </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="1">
                    <AccordionHeader>LMES - Espanha</AccordionHeader>
                    <AccordionContent>
                        <div class="w-full" style="margin-bottom: 20px;">
                            <div class="grid grid-cols-2 " style="flex-wrap: wrap; column-gap: 10px;">
                                <div class="m-0 column_border_right" style="padding-right: 10px; margin-right: 0px;">
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço Original:</p>
                                            <p style="font-weight: 600;">{{ formatCurrency(localData['price']) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço de Venda:</p>
                                            <p style="color: green;font-weight: 500;">{{ formatCurrency(localData['price_discount_LMES']) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço Minimo:</p>
                                            <p style="color: green;font-weight: 500;">{{ formatCurrency(localData['min_price_LMES']) }}</p>
                                        </div>
                                    </div>
                                </div>

                                
                                <div class="m-0">
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Padrão %:</p>
                                            <p>{{ localData['percent_1_discount_LMES'] }} %</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Condicionado %:</p>
                                            <p>{{ localData['percent_2_discount_LMES'] }} %</p>
                                        </div>
                                    </div>

                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Aplicado %:</p>
                                            <p>{{ localData['percent_2_discount_LMES'] }} %</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
   
                        </div>
                        <div class="w-full">
                            <div class="grid grid-cols-3 " style="flex-wrap: wrap; column-gap: 10px;">    
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                                        
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <i class="pi pi-money-bill"></i>
                                                </InputGroupAddon>
                                                <IftaLabel>
                                                    <InputNumber v-model="localData.min_price_LMES" inputId="price_promo" showButtons :min="-100" :step="10" mode="currency" currency="EUR" fluid />
                                                    <label for="price_promo">Preço Minimo</label>
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
                                                    <InputNumber v-model="localData['percent_2_discount_LMES']" inputId="pct_promo" showButtons :step="5" mode="decimal" fluid :min="-100" :max="1000" />
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
                                                <InputNumber v-model="localData['percent_1_discount_LMES']" inputId="pct_default" showButtons :step="5" mode="decimal" fluid :min="-100" :max="1000" />
                                                <label for="pct_default">Margem Padrão</label>
                                            </IftaLabel>
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>
                        </div>




                    </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="2">
                    <AccordionHeader>LMIT - Italia</AccordionHeader>
                    <AccordionContent>
                        <div class="w-full" style="margin-bottom: 20px;">
                            <div class="grid grid-cols-2 " style="flex-wrap: wrap; column-gap: 10px;">
                                <div class="m-0 column_border_right" style="padding-right: 10px; margin-right: 0px;">
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço Original:</p>
                                            <p style="font-weight: 600;">{{ formatCurrency(localData['price']) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço de Venda:</p>
                                            <p style="color: green;font-weight: 500;">{{ formatCurrency(localData['price_discount_LMIT']) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço Minimo:</p>
                                            <p style="color: green;font-weight: 500;">{{ formatCurrency(localData['min_price_LMIT']) }}</p>
                                        </div>
                                    </div>
                                </div>

                                
                                <div class="m-0">
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Padrão %:</p>
                                            <p>{{ localData['percent_1_discount_LMIT'] }} %</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Condicionado %:</p>
                                            <p>{{ localData['percent_2_discount_LMIT'] }} %</p>
                                        </div>
                                    </div>

                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Aplicado %:</p>
                                            <p>{{ localData['percent_2_discount_LMIT'] }} %</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
   
                        </div>
                        <div class="w-full">
                            <div class="grid grid-cols-3 " style="flex-wrap: wrap; column-gap: 10px;">    
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                                        
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <i class="pi pi-money-bill"></i>
                                                </InputGroupAddon>
                                                <IftaLabel>
                                                    <InputNumber v-model="localData.min_price_LMIT" inputId="price_promo" showButtons :min="-100" :step="10" mode="currency" currency="EUR" fluid />
                                                    <label for="price_promo">Preço Minimo</label>
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
                                                    <InputNumber v-model="localData['percent_2_discount_LMIT']" inputId="pct_promo" showButtons :step="5" mode="decimal" fluid :min="-100" :max="1000" />
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
                                                <InputNumber v-model="localData['percent_1_discount_LMIT']" inputId="pct_default" showButtons :step="5" mode="decimal" fluid :min="-100" :max="1000" />
                                                <label for="pct_default">Margem Padrão</label>
                                            </IftaLabel>
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>
                        </div>




                    </AccordionContent>
                </AccordionPanel>

                <AccordionPanel value="3">
                    <AccordionHeader>LMFR - França</AccordionHeader>
                    <AccordionContent>
                        <div class="w-full" style="margin-bottom: 20px;">
                            <div class="grid grid-cols-2 " style="flex-wrap: wrap; column-gap: 10px;">
                                <div class="m-0 column_border_right" style="padding-right: 10px; margin-right: 0px;">
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço Original:</p>
                                            <p style="font-weight: 600;">{{ formatCurrency(localData['price']) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço de Venda:</p>
                                            <p style="color: green;font-weight: 500;">{{ formatCurrency(localData['price_discount_LMFR']) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Preço Minimo:</p>
                                            <p style="color: green;font-weight: 500;">{{ formatCurrency(localData['min_price_LMFR']) }}</p>
                                        </div>
                                    </div>
                                </div>

                                
                                <div class="m-0">
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Padrão %:</p>
                                            <p>{{ localData['percent_1_discount_LMFR'] }} %</p>
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Condicionado %:</p>
                                            <p>{{ localData['percent_2_discount_LMFR'] }} %</p>
                                        </div>
                                    </div>

                                    <div class="flex justify-between">
                                        <div class="flex justify-between w-full" style="border-bottom:  solid 1px rgb(211, 211, 211) !important;">
                                            <p>Calc Aplicado %:</p>
                                            <p>{{ localData['percent_2_discount_LMFR'] }} %</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
   
                        </div>
                        <div class="w-full">
                            <div class="grid grid-cols-3 " style="flex-wrap: wrap; column-gap: 10px;">    
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="flex items-center gap-4 mb-2" style="width: 100%;">
                                        
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <i class="pi pi-money-bill"></i>
                                                </InputGroupAddon>
                                                <IftaLabel>
                                                    <InputNumber v-model="localData.min_price_LMFR" inputId="price_promo" showButtons :min="-100" :step="10" mode="currency" currency="EUR" fluid />
                                                    <label for="price_promo">Preço Minimo</label>
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
                                                    <InputNumber v-model="localData['percent_2_discount_LMFR']" inputId="pct_promo" showButtons :step="5" mode="decimal" fluid :min="-100" :max="1000" />
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
                                                <InputNumber v-model="localData['percent_1_discount_LMFR']" inputId="pct_default" showButtons :step="5" mode="decimal" fluid :min="-100" :max="1000" />
                                                <label for="pct_default">Margem Padrão</label>
                                            </IftaLabel>
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>
                        </div>




                    </AccordionContent>
                </AccordionPanel>
                
            </Accordion>

          </div>
        </div>
      </div>
      <div class="flex items-center" style="justify-content:end !important; margin-top: 20px;">
        <div class="flex items-end gap-4">
          <Button label="Cancelar" text severity="secondary" @click="closeDialog" autofocus />
          <Button label="Salvar" severity="contrast" @click="sendchanges" autofocus />
        </div>
      </div>
    </Dialog>

  </template>
<script setup>
    import { ref, reactive, defineProps, defineEmits, watch, inject } from "vue";

    const base_url = inject("base_url_ofertas");
    const visible = ref(false);

    const props = defineProps({

        data: {
            type: Object,
            required: true,
        },
        route: {
            type: [String, Object],
            required: true,
        },        
        fonte: {
            type: String,
            required: true,
        },
        });
    
    const localData = reactive({ ...props.data });
    const emit = defineEmits();

    console.log(localData);

    // Atualiza localData ao detectar mudanças em props.data
    watch(
    () => props.data,
    (newData) => {
        Object.assign(localData, newData);
    },
    { deep: true, immediate: true }
    );

    // Reseta localData ao estado inicial
    const resetLocalData = () => {
    Object.assign(localData, props.data);
    };

    // Fecha o diálogo e reseta os dados
    const closeDialog = () => {
    resetLocalData();
    emit("update:visible", false);
    };

    const sendchanges = async () => {
    try {
        console.log("Dados enviados para a API:", localData);

        if (!localData.sku) {
        throw new Error("Order ID está ausente. Não é possível atualizar.");
        }
        
        const response = await fetch(
            `${base_url}/offers/${props.fonte}/update_v2`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(localData),
            credentials: "include",
        }
        );

        if (!response.ok) {
        throw new Error(`Erro ${response.status}: Não foi possível atualizar.`);
        }

        const data = await response.json();
        console.log("Resposta do servidor:", data);

        emit("updateData", [data]);
        resetLocalData();
        closeDialog();
    } catch (error) {
        console.error("Erro ao enviar alterações:", error);
    }
    };

    const formatCurrency = (value) => {
    return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR'});
}

</script>
