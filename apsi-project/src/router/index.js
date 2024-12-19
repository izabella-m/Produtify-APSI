import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/areadovendedor',
    name: 'VendedorArea',
    children: [
      {
        path: 'cadastrarnovoproduto',
        name: 'CadastrarNovoProduto',
        component: () => import('../views/vendedor/ProductRegister.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
