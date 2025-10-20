<template>
    <Card>
        <template #content >
            <div class="bg-white dark:bg-surface-900 p-5 md:p-10 lg:p-20" style="border-radius: 20px;">
                <div class="flex justify-between lg:items-end mb-6 flex-col lg:flex-row gap-4">
                    <div class="bg-surface-0 dark:bg-surface-950">
                        
                        <div class="flex lg:items-center flex-col lg:flex-row">
                            <Tabs :value="path_" class="grow">
                                <TabList>
                                    <Tab v-for="tab in items" :key="tab.label" :value="tab.route" style="line-height: .4; padding: 5px 20px;">
                                        <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="`${tab.route}`" custom>
                                            <a v-ripple :href="href" @click="navigate" class="flex items-center gap-1 text-inherit justify-between">
                                                <i :class="tab.icon" />
                                                <span>{{ tab.label }}</span>
                                                <Badge v-if="shop === 'leroy' & tab.code !== null " class="ml-auto " :value="meta_data?.records?.[`${shop}`]?.[`${tab.code}`] || null "  severity="secondary" size="small" outlined />
                                                <Badge v-if="shop === 'worten' & tab.code !== null " class="ml-auto " :value="meta_data?.records?.[`${shop}`]?.[`${tab.code}`] || null "  severity="secondary" size="small" outlined />
                                            
                                            </a>
                                        </router-link>
                                    </Tab>
                                </TabList>
                            </Tabs>
                        </div>
                    </div>


                    <div class="flex items-center gap-4">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText id="search" name="search" type="text" placeholder="Pesquisar" variant="filled" fluid size="small" style="max-width: 20dvw;"/>
                        </IconField>
                    </div>

                </div>

                <DataTable 
                        
                        v-model:selection="selectedOrder" 
                        :value="loading ? LoadingRows : offers_data"
                        :expanded-rows="expandedRows" 
                        responsive-layout="scroll" 
                        data-key="id" 
                        size="small"
                        class="mb-4" 
                        scrollable

                        scrollHeight="79dvh"
                        >
                    <Column selection-mode="multiple" style="width: 3rem" />

                    <Column field="image_thumb" header="Product Name"  style="min-width: 420px;max-width: 420px; padding-right: 35px;">
                        <template #body="{data, field}">
                            <div v-if="loading" class="flex items-center">
                                <Skeleton  style="margin: 2px;" size="2.5rem" class="mr-2"/>
                                <div style="width: 92%;">
                                    <Skeleton  style="margin: 2px;"/>
                                    <Skeleton  style="margin: 2px; width: 50%;"/>
                                </div>
                                
                            </div>
                            
                            <div v-else class="flex items-center">

                                <img v-if="data[field] !== null" :src="data[field]"  class="w-12 h-12 mr-4" />
                                <img v-else :src="data['product_media']"  class="w-12 h-12 mr-4" />
                                
                                <div style="width: 92%;">
                                    <a 
                                        :href="data.product_link" 
                                        target="_blank" 
                                        style="font-size: 12px; font-weight: 500; display: inline-block; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" 
                                        rel="noopener noreferrer">
                                    
                                        <span>{{ data.product_title }}</span>
                                    
                                    </a>

                                    <!-- <h5 class="text-surface-700 dark:text-surface-50">{{ data['product_title'] }}</h5> -->
                                    <p class="text-surface-500 dark:text-surface-400">Reference: <a href="https://www.google.com/" target="_blank" style="font-size: 12px;" > {{ data['offer_sku'] }}</a></p>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column field="ean" header="Codigo EAN" class="w-1/6">
                        <template #body="{data, field}">
                            <Skeleton v-if="loading" style="margin: 2px;" />
                            <span  v-else class="whitespace-nowrap px-2 py-1 text-sm bg-surface-100 dark:bg-surface-800 rounded-lg text-surface-900 dark:text-surface-50" style="font-size: small;">{{ data[field] }}</span>
                        </template>
                    </Column>

                    <Column field="state" header="Status" style="min-width: 11%;">
                        <template #body="{data, field}">
                            <Skeleton v-if="loading" style="margin: 2px;" />
                            <span v-else style="width: 100%;"
                                :class="[
                                    'px-2 py-0 text-sm  rounded-lg flex items-center gap-1 w-fit ',
                                    {
                                        'status-4': data[field] === true,
                                        'status-3': data[field] === false,
                                    }
                                ]"
                            >

                                <span class="text-sm" style="font-size: small; text-align: center !important; width: 100%;">
                                    {{ data[field] === true ? 'Ativo' : 'Inativo' }}
                                </span>
                            </span>
                        </template>
                    </Column>
                    <Column field="stock" header="Stock" style="width: 10%;">
                        <template #body="{ data, field }">
                            <Skeleton v-if="loading" style="margin: 2px;" />
                            <div v-else
                            style="display: flex; justify-content: flex-end; align-items: center; font-size: 12px; position: relative;"
                            @mouseover="data.showTag = true"
                            @mouseleave="data.showTag = false"
                            >
                            <span class="text-sm" style="font-size: small; text-align: center !important;">
                                {{ data[field] }}
                            </span>
                            <Tag
                                v-if="data.showTag"
                                icon="pi pi-fw pi-sync"
                                severity="Primary"
                                rounded
                                style="cursor: pointer; margin-left: 5px; background-color: white; transition: background-color 0.3s;"
                            />
                            <Tag
                                v-else
                                icon="pi pi-fw pi-sync"
                                severity="Primary"
                                rounded
                                style="cursor: pointer; margin-left: 5px; background-color: transparent; color: transparent;"
                            />
                            </div>
                        </template>
                    </Column>

                    <Column expander style="width: 1rem" />
                    <template #expansion="{data, field }">
                        <div class="flex flex-col  w-full gap-4 rounded-lg mt-3 mb-3">
                            <!-- <div class="flex w-full justify-between items-center p-3 bg-surface-50 dark:bg-surface-900 rounded-lg border border-surface overflow-hidden">
                                <div class="flex items-center">
                                    <span class="block border border-surface w-6 h-6 mr-3">
                                        <img src="https://cdn.brandfetch.io/idPUxvDluR/w/1080/h/1080/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" alt="VEVOR" class="w-full h-full rounded-lg" />
                                    </span>
                                    <div>
                                        <span class=" pl-2 text-surface-900 dark:text-surface-0" style="font-size:normal; font-weight: 600;">VEVOR Store</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Button
                                        label="Editar"
                                        outlined
                                        size="small"
                                        class="!bg-surface-0 dark:!bg-surface-950 !text-surface-900 dark:!text-surface-50 !border !border-surface-200 dark:!border-surface-700 hover:!bg-surface-50 dark:hover:!bg-surface-900"
                                    />
                                    <Button label="Enviar" size="small" />
                                </div> 
                            </div> -->
<!-- 
                            <div class="flex gap-2 w-full">
                                <div class="w-6/12 bg-surface-50 dark:bg-surface-900 border border-surface rounded-lg overflow-hidden">
                                    <div class="px-4 py-2 flex justify-between items-center bg-surface-50 dark:bg-surface-900 border-b border-surface">
                                        <span class=" pl-2 text-surface-900 dark:text-surface-0" style="font-size:17px; font-weight: 400;">Tekmaquinas</span>
                                        <Button
                                            icon="pi pi-file-edit"
                                            size="small"
                                            severity="contrast" variant="outlined"

                                        />
                                    </div>

                                    <div class="flex-wrap rounded-lg bg-surface-0 dark:bg-surface-950 h-full">
                                        <div class="flex flex-col">
                                            <div class="flex flex-wrap px-3 py-2">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Name:</span>
                                                <span class="block font-medium"> Emma Stone</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Address:</span>
                                                <span class="block font-medium">1234 Apple St, Faketown, NY, 00000</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">City:</span>
                                                <span class="block font-medium">Florida</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Country:</span>
                                                <span class="block font-medium">nited States</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Zip Code:</span>
                                                <span class="block font-medium">D2110</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Phone:</span>
                                                <span class="block font-medium">+1 (000) 000-0000</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="w-6/12 bg-surface-50 dark:bg-surface-900 border border-surface rounded-lg overflow-hidden">
                                    <div class="px-4 py-2 flex justify-between items-center bg-surface-50 dark:bg-surface-900 border-b border-surface">
                                        <span class=" pl-2 text-surface-900 dark:text-surface-0" style="font-size:17px; font-weight: 400;">Canais de Vendas</span>
                                        <Button
                                            icon="pi pi-file-edit"
                                            size="small"
                                            severity="contrast" variant="outlined"

                                        />
                                    </div>

                                    <div class="flex-wrap rounded-lg bg-surface-0 dark:bg-surface-950 h-full">
                                        <div class="flex flex-col">
                                            <div class="flex flex-wrap px-3 py-2">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Name:</span>
                                                <span class="block font-medium"> Emma Stone</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Address:</span>
                                                <span class="block font-medium">1234 Apple St, Faketown, NY, 00000</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">City:</span>
                                                <span class="block font-medium">Florida</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Country:</span>
                                                <span class="block font-medium">nited States</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Zip Code:</span>
                                                <span class="block font-medium">D2110</span>
                                            </div>
                                            <div class="flex flex-wrap px-3 py-1">
                                                <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-1">Phone:</span>
                                                <span class="block font-medium">+1 (000) 000-0000</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>                  
                            </div>  -->
                            <div class="w-full bg-surface-50 dark:bg-surface-900 border border-surface rounded-lg overflow-hidden">
                                <div class="px-4 py-3 flex justify-between items-center bg-surface-50 dark:bg-surface-900 border-b border-surface">
                                    <div class="flex items-center">
                                        <span class="block border border-surface rounded-lg w-8 h-8 mr-3">
                                            <img src="https://cdn.brandfetch.io/idPUxvDluR/w/1080/h/1080/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" alt="VEVOR" class="w-full h-full rounded-lg" />
                                        </span>
                                        <div>
                                            <span class=" pl-2 text-surface-900 dark:text-surface-0" style="font-size:large; font-weight: 600;">Detalhes da Oferta</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex rounded-lg bg-surface-0 dark:bg-surface-950 p-5">
                                    <Image :src="data['image_big']" width="250" preview />

                                    <div class="flex flex-col w-full">
                                        <div class="flex px-4 py-3 justify-between">
                                            <span class="block min-w-28 text-surface-600 dark:text-surface-200 px-3">Titulo: </span>
                                            <span class="block font-medium"> {{ data['product_title'] }} </span>
                                        </div>
                                        <div class="flex flex-wrap px-4 py-3 justify-between">
                                            <span class="block min-w-28 text-surface-600 dark:text-surface-200">SKU do produto:</span>
                                            <span class="block font-medium">{{ data['product_sku'] }}</span>
                                        </div>
                                        <div class="flex flex-wrap px-4 py-3 justify-between">
                                            <span class="block min-w-28 text-surface-600 dark:text-surface-200">Estimated Tax</span>
                                            <span class="block font-medium">$27</span>
                                        </div>
                                        <span class="block h-px bg-surface-200 dark:bg-surface-700 mx-4" />
                                        <div class="flex flex-wrap px-4 py-3 justify-between">
                                            <span class="block min-w-28 text-surface-600 dark:text-surface-200">Total</span>
                                            <span class="block font-medium">$226</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataTable>
            </div>

        </template>
    </Card>

</template>
    
<script setup>
    import { ref, onMounted, inject, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { saveToCache, getFromCache } from '../../utils.mjs';

    
        
    const selectedOrder = ref(null);
    const loading   = ref(false);
    const LoadingRows = ref(new Array(20).fill({}));

    const base_url  = inject('base_url_ofertas')
    const endpoint  = useRoute()
    const router  = useRouter()

    const shop  = ref(endpoint.params.shop)
    const state = ref(endpoint.params?.state || null)
    const path_ = ref(endpoint.path)

    const offers_data = ref([]);
    const meta_data = ref({})
    const expandedRows = ref({});

    const items = ref([
        { route: `/offers/${shop.value}/`, label: 'Todas', code: 'all'},
        { route: `/offers/${shop.value}/active`, label: 'Ativas', code: 'active'},
        { route: `/offers/${shop.value}/inactive`, label: 'Inativas', code: 'inactive'}
    ]);


    const orders = ref([
        {
            id: 1,
            productName: 'Nike Air Force 1 LV8',
            brand: 'Nike',
            brandImage: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/nike-logo.png',
            description: "Men's Training Shoes",
            image: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/orderhistory-2-1.png',
            orderCode: 'CD-6348639',
            orderDate: '11/17/2023 03:25pm',
            status: 'Pending',
            total: 226,
            billingAddress: {
                name: 'Emma Stone',
                address: '1234 Apple St, Faketown, NY, 00000',
                city: 'Florida',
                country: 'United States',
                zipCode: 'D2110',
                phone: '+1 (000) 000-0000'
            },
            shippingAddress: {
                name: 'Emma Stone',
                address: '1234 Apple St, Faketown, NY, 00000',
                city: 'Florida',
                country: 'United States',
                zipCode: 'D2110',
                phone: '+1 (000) 000-0000'
            },
            paymentInfo: {
                cardLast4: '2924',
                cardImage: '/path/to/mastercard.png'
            },
            subtotal: 199,
            shipping: 0,
            tax: 27
        },
        {
            id: 2,
            productName: 'Nike Air Force 1 07 LV8',
            brand: 'Nike',
            brandImage: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/nike-logo.png',
            description: "Men's Lifestyle Shoes",
            image: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/orderhistory-2-2.png',
            orderCode: 'AB-9876543',
            orderDate: '11/18/2023 10:15am',
            status: 'Delivered',
            total: 189,
            billingAddress: {
                name: 'John Doe',
                address: '5678 Oak Ave, Realville, CA, 11111',
                city: 'Los Angeles',
                country: 'United States',
                zipCode: 'E3220',
                phone: '+1 (111) 111-1111'
            },
            shippingAddress: {
                name: 'John Doe',
                address: '5678 Oak Ave, Realville, CA, 11111',
                city: 'Los Angeles',
                country: 'United States',
                zipCode: 'E3220',
                phone: '+1 (111) 111-1111'
            },
            paymentInfo: {
                cardLast4: '5678',
                cardImage: '/path/to/visa.png'
            },
            subtotal: 169,
            shipping: 0,
            tax: 20
        },
        {
            id: 3,
            productName: 'Nike Air Force 1 07',
            brand: 'Nike',
            brandImage: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/nike-logo.png',
            description: "Women's Sneakers",
            image: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/orderhistory-2-3.png',
            orderCode: 'EF-2468135',
            orderDate: '11/19/2023 02:45pm',
            status: 'Preparing',
            total: 210,
            billingAddress: {
                name: 'Alice Johnson',
                address: '9012 Elm St, Wonderland, TX, 22222',
                city: 'Austin',
                country: 'United States',
                zipCode: 'F4330',
                phone: '+1 (222) 222-2222'
            },
            shippingAddress: {
                name: 'Alice Johnson',
                address: '9012 Elm St, Wonderland, TX, 22222',
                city: 'Austin',
                country: 'United States',
                zipCode: 'F4330',
                phone: '+1 (222) 222-2222'
            },
            paymentInfo: {
                cardLast4: '9012',
                cardImage: '/path/to/amex.png'
            },
            subtotal: 185,
            shipping: 5,
            tax: 20
        },
        {
            id: 4,
            productName: 'Nike Air Force 1 Low By You',
            brand: 'Nike',
            brandImage: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/nike-logo.png',
            description: 'Customizable Sneakers',
            image: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/orderhistory-2-4.png',
            orderCode: 'GH-1357924',
            orderDate: '11/20/2023 09:30am',
            status: 'Pending',
            total: 245,
            billingAddress: {
                name: 'Bob Smith',
                address: '3456 Pine Rd, Greentown, WA, 33333',
                city: 'Seattle',
                country: 'United States',
                zipCode: 'G5440',
                phone: '+1 (333) 333-3333'
            },
            shippingAddress: {
                name: 'Bob Smith',
                address: '3456 Pine Rd, Greentown, WA, 33333',
                city: 'Seattle',
                country: 'United States',
                zipCode: 'G5440',
                phone: '+1 (333) 333-3333'
            },
            paymentInfo: {
                cardLast4: '3456',
                cardImage: '/path/to/discover.png'
            },
            subtotal: 215,
            shipping: 0,
            tax: 30
        },
        {
            id: 5,
            productName: 'Nike Air Monarch IV',
            brand: 'Nike',
            brandImage: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/nike-logo.png',
            description: "Men's Training Shoes",
            image: 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/ecommerce/orderhistory/orderhistory-2-5.png',
            orderCode: 'IJ-8642097',
            orderDate: '11/21/2023 11:55am',
            status: 'Delivered',
            total: 175,
            billingAddress: {
                name: 'Charlie Brown',
                address: '7890 Maple Ln, Cartoon City, IL, 44444',
                city: 'Chicago',
                country: 'United States',
                zipCode: 'H6550',
                phone: '+1 (444) 444-4444'
            },
            shippingAddress: {
                name: 'Charlie Brown',
                address: '7890 Maple Ln, Cartoon City, IL, 44444',
                city: 'Chicago',
                country: 'United States',
                zipCode: 'H6550',
                phone: '+1 (444) 444-4444'
            },
            paymentInfo: {
                cardLast4: '7890',
                cardImage: '/path/to/mastercard.png'
            },
            subtotal: 155,
            shipping: 5,
            tax: 15
        }
    ]);

    onMounted(() => {
        GetTotalRecords();
        GetAllOffers();
    });

    watch(() => endpoint.params,
        (newParams) => {
            shop.value = newParams.shop
            state.value = newParams?.state || null
            GetTotalRecords();
            GetAllOffers()
        }
    )

    watch(() => endpoint.path,
        (newParams) => {
            path_.value = newParams
            items.value = [
                    { route: `/offers/${shop.value}/`, label: 'Todas', code: 'all'},
                    { route: `/offers/${shop.value}/active`, label: 'Ativas', code: 'active'},
                    { route: `/offers/${shop.value}/inactive`, label: 'Inativas', code: 'inactive'},
                ]
        }
    )

    const GetAllOffers = async () => {
        loading.value = true
        try {
            
            const params = new URLSearchParams({ marketplace: shop.value });
            if (state.value !== null) {
                params.append('state', state.value);
            }
            
            const cachedData = getFromCache(`${params.toString()}`, 60000);
            if (cachedData) {
                offers_data.value = cachedData;
                loading.value = false
                return;
            }

            
            const response = await fetch(`${base_url}/v1/ofertas/?${params.toString()}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },});

            if (!response.ok) {
                throw new Error('Failed to fetch members');
                }

            const data = await response.json();
            offers_data.value = data;
            saveToCache(`${params.toString()}`, data);
            loading.value = false
            } catch (error) {
                console.error('Error fetching members:', error);
                }
    };

    const GetTotalRecords = async () => {
        const cachedData = getFromCache(`navigation_records`, 60000);
        if (cachedData) {
          meta_data.value = cachedData;
          return;
        }
        const response = await fetch(`${base_url}/v1/ofertas/metrics?datamode=records&shop=all`, {
            method: 'GET',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },});

        if (!response.ok) {
            throw new Error('Failed to fetch members');
            }

        const data = await response.json();
        meta_data.value = data;
        
        saveToCache(`navigation_records`, data);

        return;
    };

    function formatarTimestamp(timestamp) {
        const timestampMs = typeof timestamp === 'number' ? timestamp * 1000 : timestamp;
        const data = new Date(timestampMs);
        
        const dia = ('0' + data.getDate()).slice(-2);
        const mes = ('0' + (data.getMonth() + 1)).slice(-2);
        const ano = data.getFullYear();
        const horas = ('0' + data.getHours()).slice(-2);
        const minutos = ('0' + data.getMinutes()).slice(-2);
        
        return `${horas}:${minutos}`;
    }

</script>

<style scoped>
    ::v-deep(.p-card-body ) {
        padding: 0px !important;
    }
</style>
