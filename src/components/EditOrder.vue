<template>
  <Dialog v-model:visible="visible" modal :header="'Informações do pedido: ' + localData.order_id"  :style="{ width: '70rem',padding:'0px' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" maximizable :contentStyle="{ height: 'auto'}" >
    <div>
      <Accordion value="0">
          <AccordionPanel value="0">
                <AccordionHeader>Informações do Cliente</AccordionHeader>
                <AccordionContent>
                    <div class="flex justify-between gap-3">
                        <IftaLabel style="margin-bottom: 10px; min-width: 150px;">
                            <IconField>
                                <InputText v-model="localData.customer_id" inputId="withoutgrouping" id="id_client" :useGrouping="false" disabled fluid variant="filled"/>
                            </IconField>
                            <label for="id_client">ID Client</label>
                        </IftaLabel>
                        <IftaLabel style="margin-bottom: 10px;" class="w-full">
                            <IconField>
                                <InputIcon class="pi pi-user" />
                                <InputText v-model="localData.firstname" inputId="withoutgrouping" id="name" :useGrouping="false" fluid />
                            </IconField>
                            <label for="name">Cliente</label>
                        </IftaLabel>
                        <IftaLabel style="margin-bottom: 10px; max-width: 300px;"  class="w-full">
                            <IconField>
                                <InputIcon class="pi pi-phone" />
                                <InputText v-model="localData.phone" inputId="withoutgrouping" id="phonenumber" :useGrouping="false" fluid />
                            </IconField>
                            <label for="phonenumber">Telefone</label>
                        </IftaLabel>
                    </div>
                    <span v-if="localData.edit" class="error-message">
                        Endereço 1 deve ter menos de 35 caracteres.
                    </span>
                    <div class="flex justify-between gap-3">
                        <InputGroup style="margin-bottom: 10px; max-width: 60%;" >
                            <InputGroupAddon >
                                <i class="pi pi-map"></i>
                            </InputGroupAddon>
                            <InputText v-model="localData.street_1" placeholder="Endereço" :class="{ 'error-input': localData.edit }"/>
                        </InputGroup>
                        <IftaLabel style="margin-bottom: 10px;">
                            <IconField>
                                <InputText v-model="localData.city" inputId="withoutgrouping" id="city" :useGrouping="false" fluid />
                            </IconField>
                            <label for="city">Cidade</label>
                        </IftaLabel>
                        <IftaLabel style="margin-bottom: 10px;">
                            <IconField>
                                <InputText v-model="localData.zip_code" inputId="withoutgrouping" id="zipcode" :useGrouping="false" fluid />
                            </IconField>
                            <label for="zipcode">Codigo Postal</label>
                        </IftaLabel>
                    </div>
                    <div class="flex justify-between gap-3">
                        <InputGroup style="margin-bottom: 10px; ">
                            <InputGroupAddon>
                                <i class="pi pi-map"></i>
                            </InputGroupAddon>
                            <InputText v-model="localData.street_2" placeholder="Endereço 2 (complemento)" />
                        </InputGroup>
                        <InputGroup style="margin-bottom: 10px; max-width: 130px;">
                            <InputGroupAddon>
                                <i class="pi pi-map-marker"></i>
                            </InputGroupAddon>
                            <IftaLabel>
                              <Select v-model="localData.locale" inputId="country" :options="countries" optionLabel="name" optionValue="code" variant="filled" />

                                <label for="country">pais</label>
                            </IftaLabel>
                        </InputGroup>
                    </div>
                </AccordionContent>
          </AccordionPanel> 

          <AccordionPanel value="1" style="margin-bottom: 10px;">
              <AccordionHeader>Informações do Pedido</AccordionHeader>
                  <AccordionContent>
                  <div class="flex items-start gap-4">
                      <div>
                          <Image  v-if="localData.thumb" :src="localData.thumb" alt="Foto" width="260" />
                         
                      </div>
                      <div class="flex flex-col gap-3" style="width: 100%;">
                          <div class="card" style=" padding-top: 0px;">
                              <a v-if="localData.thumb" :href="localData.link" target="_blank" style="text-decoration: none;">
                              <h5>{{localData.product_title}}</h5>
                              </a>
                              <p class="m-0" style="font-size: 13px;">
                                  <span style="font-weight: 700; margin-right: 15px;">SKU: </span>  {{ localData.sku }}
                              </p>
                              <p v-if="localData.thumb" class="m-0" style="font-size: 13px;">
                                  <span style="font-weight: 700; margin-right: 7px;">Stock: </span>  {{ localData.stock }}
                              </p>
                              <div class="flex gap-2" style="margin-top: 20px;">
                                  <IftaLabel class="w-full" style="display: flex; flex-direction: column; margin-bottom: 10px; min-width: 150px;">
                                      <IconField>
                                          <InputText v-model="localData.link" inputId="withoutgrouping" id="link" :useGrouping="false" fluid variant="filled" />
                                      </IconField>
                                      <label for="link">Link</label>
                                  </IftaLabel>
                                  <IftaLabel style="display: flex; flex-direction: column; margin-bottom: 8px; max-width: 120px;">
                                      <IconField>
                                          <InputNumber v-model="localData.quantity" inputId="minmax-buttons" mode="decimal" showButtons :min="0" :max="100" fluid />
                                      </IconField>
                                      <label for="minmax-buttons">Qtd.</label>
                                  </IftaLabel>
                              </div>
                          </div>
                      </div>
                  </div>
              </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="2">
              <AccordionHeader>Informações de Transporte do Pedido</AccordionHeader>
                  <AccordionContent>
                      <div class="flex justify-between gap-2">
                          <IftaLabel>
                              <Select v-model="localData.shipping_carrier_standard_code" inputId="seletor_transportadora" :options="seletor_transportadora" optionLabel="name" optionValue="code" variant="filled" style="min-width: 300px;" />
                              <label for="seletor_transportadora">Selecione a transportadora</label>
                          </IftaLabel>
                          <IftaLabel class="w-full" style="margin-bottom: 10px;">
                              <IconField>
                                  <InputText v-model="localData.shipping_tracking" inputId="withoutgrouping" id="tracking" :useGrouping="false" fluid />
                              </IconField>
                              <label for="tracking">Código de rastreamento</label>
                          </IftaLabel>
                          <IftaLabel class="w-full" style="margin-bottom: 10px;">
                              <div class="flex justify-between">
                                  <div class="flex-1">
                                      <IconField>
                                          <InputText v-model="localData.vevor_id" inputId="withoutgrouping" id="vevor_id" :useGrouping="false" fluid />
                                      </IconField>
                                      <label for="vevor_id">Nº Vevor</label>
                                  </div>
                                  
                                   <div v-if="localData.vevor_id" class="grid grid-cols-1">
                                      <Button  icon="pi pi-refresh"  severity="contrast" variant="outlined" style="margin: auto; margin-left: 10px;" class="p-button-rounded p-button-info" @click="checarEncomenda" />
                                    </div>
                                    
                                    <div v-else class="grid grid-cols-1">
                                      <Button  icon="pi pi-refresh"  severity="contrast" variant="outlined" style="margin: auto; margin-left: 10px;" class="p-button-rounded p-button-info" @click="checarEncomenda" disabled />
                                    </div>

                                </div>
                          </IftaLabel>

                      </div>
                  </AccordionContent>
          </AccordionPanel>
      </Accordion>
    </div>

  <div class="flex justify-end gap-2" style="margin-top: 10px;">
    <Button label="Cancelar" text severity="secondary" @click="closeDialog" autofocus />
    <Button label="Salvar" severity="contrast" @click="sendchanges" autofocus />
  </div>
  <Toast position="bottom-center" group="brr" />
  </Dialog>
</template>

<script setup>
  import { ref, reactive, defineProps, defineEmits, watch, inject } from "vue";
  import { useToast } from "primevue/usetoast";

  const toast = useToast();
  const base_url = inject("base_url");
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
  });


  const localData = reactive({ ...props.data });
  const countries = ref([
      { name: 'FR', code: 'FR' },
      { name: 'PT', code: 'PT' },
      { name: 'IT', code: 'IT' },
      { name: 'ES', code: 'ES' }
  ]);




  const seletor_transportadora = ref(props.route === 'leroy' ? [
    { name: 'GLS Spain', code: 'gls-es' },
    { name: 'GLS Germany', code: 'gls-de' },
    { name: 'GLS Italy', code: 'gls-it' },
    { name: 'GLS Portugal', code: 'gls-pt' },
    { name: 'FR_GLS', code: 'gls' },
    { name: 'IT_TNT', code: 'tnt-it' },
    { name: 'FR_DPD Predict', code: 'dpd-fr' },
    { name: 'ES_CORREOSEXPRESS', code: 'correos-express' },
    { name: 'FR_Colissimo', code: 'colissimo' },
    { name: 'FR_Chronopost', code: 'chronopost' },
    { name: 'ES_UPS', code: 'ups' },
    { name: 'ES_17TRACK', code: '17track' },
    { name: 'FR_GEODIS', code: 'geodis' },
    { name: 'FedEx', code: 'fedex' },
    { name: 'Amazon Italy', code: 'amazon-it' },
    { name: 'DE_DHL Deutschland', code: 'dhl-packet' },
  ] : [
    { name: 'GLS ES', code: 'gls-es' },
    { name: 'TNT', code: 'tnt' },
    { name: 'DPD', code: 'dpd-pt' },
    { name: 'Correos Express', code: 'correos-express' },
    { name: 'La Poste', code: 'colissimo' },
    { name: 'Chronopost France', code: 'chronopost' },
    { name: 'UPS', code: 'tnt' },
    { name: 'DHL', code: 'dhl' },
  ]);


  const emit = defineEmits();
    console.log(localData)
  watch(
    () => props.data,
    (newData) => {
      Object.assign(localData, newData);
    },
    { deep: true, immediate: true }
  );


  watch(
    () => localData.street_1,
    () => {
      validateStreetLength();
    }
  );

  const validateStreetLength = () => {
    localData.edit = localData.street_1.length >= 35;
  };


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

      if (!localData.order_id) {
        throw new Error("Order ID está ausente. Não é possível atualizar.");
      }

      const response = await fetch(
        `${base_url}/orders/${localData.order_id}/update`,
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

  const checarEncomenda = async () => {

      const vevorIdInput = document.getElementById("vevor_id");
      const vevorId = vevorIdInput ? vevorIdInput.value : "";

      if (!vevorId) {
        console.error("Erro: O campo 'Nº Vevor' está vazio.");
        return;
      }

      const response = await fetch(
        `${base_url}/orders/CheckTrackingID?vevor_id=${encodeURIComponent(vevorId)}&marketplace=${props.route}&zip_code=${localData.zip_code}&order_id=${localData.order_id}&unique_order_id=${localData.unique_id_order}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const text = await response.text();
      console.log("Resposta bruta da API:", text);

      if (!response.ok) {
        if (response.status === 404) {

          toast.add({
                severity: 'info',
                summary: 'Sem Codigo de Rastreio',
                detail: "no momento não foi identificado nenhum codigo de rastreio, tente mais tarde...",
                group: 'brr',
                life: 5000
            });

          return; 
        }
        
        throw new Error(`Erro ${response.status}: ${text}`);
      }

      const data = JSON.parse(text);
      console.log("Resposta JSON da API:", data);


      localData.shipping_carrier_standard_code = data.shipping_carrier_standard_code;
      localData.shipping_tracking = data.tracking;
      localData.state_progress = data.status_progress;

      toast.add({
                severity: 'success',
                summary: 'Codigo de Rastreio Encontrado!',
                detail: "o codigo foi atualizado no marketplace com sucesso!",
                group: 'brr',
                life: 5000
            });
    
  };

</script>

<style scoped>
.input_infos {
  padding-top: 1.5rem !important;
  background-color: rgba(255, 255, 255, 0) !important;
  box-shadow: none !important;
  display: inline-block !important;
  min-width: 50px !important;
  width: 100% !important;
  max-width: 100% !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  word-break: break-all;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.error-input {
  border: 1px solid red !important;
  background-color: #ffe6e636 !important;
}

.error-message {
  color: rgb(255, 0, 0) !important;
  font-size: 0.85rem !important;
  margin-top: 5px !important;
}
</style>
