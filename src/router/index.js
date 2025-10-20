import { createRouter, createWebHistory } from 'vue-router';

// const base_url = 'http://localhost:80';
const base_url  = 'https://apitekmaquinas.squareweb.app';
const path_404  = '/:pathMatch(.*)*'
const meta_     = { requiresAuth: true } 

const routes = [
    
    { meta: meta_ , sensitive: true, component: () => import('../views/Home.vue'),       name: 'Home',       path: '/',         children: null, },
    { meta: meta_ , sensitive: true, component: () => import('../views/Login.vue'),      name: 'Login',      path: '/login',    children: null, },
    { meta: meta_ , sensitive: true, component: () => import('../views/Leroy.vue'),      name: 'Leroy',      path: '/leroy',    children: null, },
    { meta: meta_ , sensitive: true, component: () => import('../views/Worten.vue'),     name: 'Worten',     path: '/worten',   children: null, },
    { meta: meta_ , sensitive: true, component: () => import('../views/Profile.vue'),    name: 'Profile',    path: '/profile',  children: null, },
    { meta: meta_ , sensitive: true, component: () => import('../views/Membros.vue'),    name: 'Membros',    path: '/membros',  children: null, },
    { meta: meta_ , sensitive: true, component: () => import('../views/Deposito.vue'),   name: 'Deposito',   path: '/warehouse',children: null, },
    { meta: meta_ , sensitive: true, component: () => import('../views/_Devolucoes.vue'),name: 'Devolucoes', path: '/returns',  children: null, },
    { meta: null  , sensitive: true, component: () => import('../views/_NotFound.vue'),  name: 'NotFound',   path: path_404,    children: null, },

    // { 
    //     meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Imports_.vue'),  name: 'Imports',   
    //     path: '/offers/imports', children: null,
    // },
    // { 
    //     meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Warehouse_.vue'),  name: 'Warehouse',   
    //     path: '/offers/warehouse', children: null,
    // },
    // { 
    //     meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Adjust_.vue'),  name: 'Adjust',   
    //     path: '/offers/adjust', children: null,
    // },
    // { 
    //     meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Reports_.vue'),  name: 'Reports',   
    //     path: '/offers/report', children: null,
    // },

    {   
        meta: meta_ , sensitive: true,   component: () => import('../components/mensagens_/Metricas.vue'),  name: 'Metrics', 
        path: '/metricas',
    },

    // { 
    //     meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Index_.vue'),  name: 'Ofertas',   
    //     path: '/offers/:shop(leroy|worten)/',    
    //     children: [
    //                 { path:':state(active|inactive)', meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Index_.vue')},
    //                 { path:'imports', meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Imports_.vue')},
    //                 { path:'adjust', meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Index_.vue')},
    //                 { path:'ranking', meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Index_.vue')},
    //                 { path:'report', meta: meta_ , sensitive: true, component: () => import('../views/Ofertas/Index_.vue')},

    //             ], 
    // },

    

    { 
        meta: meta_ , sensitive: true, component: () => import('../views/Mensagens.vue'),  name: 'Mensagens',
        path: '/inbox/:marketplace(leroy|worten|all)/:state(pendente|nao_lidos|lidos|atencao|operador|finalizado|saved)',
        children: [

            { 
                path: "chat/:id", 
                meta: { requiresAuth: true, title: "Chat - Detalhes" },
                component: () => import("../views/Chat.vue"), 
                beforeEnter: async (to, from, next) => {
                    const id = to.params.id;
                    try {
                        // Tentar carregar o chat diretamente pelo ID da rota
                        const chat = await ChatService.getChat(id);
                        // Se temos thread_id e é diferente do ID da rota, redirecionar
                        if (chat && chat.thread_id && chat.thread_id !== id) {
                            return next({
                                path: `/inbox/${to.params.marketplace}/${to.params.status}/chat/${chat.thread_id}`,
                                replace: true
                            });
                        }
                        // Se chegou aqui, o ID é válido
                        return next();
                    } catch (error) {
                        // Não foi possível carregar, permitir o acesso de qualquer forma
                        // O componente tratará os erros
                        return next();
                    }
                } 
            }
        ]
    },


    ];



const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
    if (to.path === '/login') {
        return next();
    }

    try {
        const response = await fetch(`${base_url}/member/check`, { method: 'GET', credentials: 'include' , headers: {'X-Custom-Cookie': `${document.cookie}`,}});

        if (response.ok) {

            const data = await response.json();
            const isAuthenticated = data.success;

            if (to.meta.requiresAuth && !isAuthenticated) {
                return next('/login');
            } else { 
                return next();
            } 
    
        }

        } catch (error) {
            console.error('Erro na verificação de autenticação:', error);
            if (to.path !== '/login') {
                next('/login');
            } else {
                next();
            }
        }
});

export default router;
