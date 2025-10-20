<template>
    <Toast position="bottom-center" group="lg" />
    <div class="px-6 py-20 md:px-12 lg:px-20 mt-auto">
        <div class="rounded-2xl bg-surface-0  p-6 shadow lg:w-4/12 mx-auto max-w-96">
            <div class="text-center mb-8">
                <svg class="mb-4 mx-auto fill-surface-600 h-16" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z"
                    />
                </svg>

                <div class="text-surface-900 light:text-surface-0 text-3xl font-medium mb-4">Bem-vindo de Volta</div>
            </div>
            <Form
                    v-slot="$form"
                    :initialValues="initialValues"
                    :resolver="resolver"
                    :validateOnValueUpdate="false"
                    :validateOnBlur="true"
                    @submit="(values) => {login(values); }"
                    class="flex flex-col gap-4"
                    >
                <IftaLabel>
                    <IconField>
                        <InputIcon class="pi pi-user" />
                        <InputText
                        id="email"
                        name="email"
                        type="text"
                        fluid
                        variant="filled"
                        autocomplete="email"
                        :formControl="{ validateOnValueUpdate: true }"
                        />
                    </IconField>
                    <label for="email">E-mail</label>
                    <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error.message }}</Message>
                </IftaLabel>

                <IftaLabel>
                    <Password
                    id="password"
                    name="password"
                    type="text"
                    fluid
                    :feedback="false"
                    variant="filled"
                    autocomplete="current-password"
                    toggleMask
                    />
                    <label for="password">Senha</label>
                    <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.password.error.message }}</Message>
                </IftaLabel>


                <div class="flex items-center gap-2">
                    <Checkbox
                            v-model="rememberMe"
                            name="rememberMe"
                            value="true"
                            label="Lembrar-me"
                            inputId="rememberMe"
                            />
                    <label for="rememberMe"> Lembrar-me </label>
                </div>




                <Button type="submit" severity="contrast" label="Submit" />
            </Form>
            
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast'; // Import useToast
import { Form } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { inject } from 'vue';

const rememberMe = ref(false);
const base_url = inject('base_url');
const base_url_ofertas = inject('base_url_ofertas');
const base_url_devolucoes = inject('base_url_devolucoes');
const toast = useToast();
const initialValues = ref({
    email: '',
    password: '',
    lastName: ''
});


if (localStorage.getItem('email') && localStorage.getItem('password')) {
    initialValues.value.email = localStorage.getItem('email');
    initialValues.value.password = localStorage.getItem('password');
}

const resolver = zodResolver(
  z.object({
    email: z.string().min(1, { message: 'Email is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  })
);

const login = async (values) => {
    const formData = new FormData();
    formData.append('email', values.values.email);
    formData.append('password', values.values.password);

    try {
        await fetch(`${base_url_ofertas}/v1/membros/login`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            mode:'cors'
        });

        const response = await fetch(`${base_url_devolucoes}/v1/membros/login`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            mode:'cors'
        });


        const response = await fetch(`${base_url}/member/login`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            mode:'cors'
        });


        if (!response.ok) {
            throw new Error('Erro de autenticação');
        }

        const data = await response.json();

        if (data.success) {
            if (rememberMe.value) {
                localStorage.setItem('email', values.values.email);
                localStorage.setItem('password', values.values.password);
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }

            window.location.href = data.redirect_url;
        } else {
            throw new Error('Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        toast.add({
            severity: 'error',
            summary: 'Erro de Autenticação',
            detail: error.message,
            group: 'lg',
            life: 3000,
        });
    }
};

</script>


