import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../components/Login.vue';





// import Register from '../components/SignUp.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/transaksi',
        name: 'tansaksi',
        component: () => import( '../views/Transaksi.vue')
      },           
      {
        path: '/produk',
        name: 'produk',
        component: () => import( '../views/Produk.vue')
      },    
      {
        path: '/history',
        name: 'history',
        component: () => import( '../views/History.vue')
      },          
      {
        path: '/bundling',
        name: 'bundling',
        component: () => import( '../views/Bundling.vue')
      },              
      {
        path: '/pengguna',
        name: 'pengguna',
        component: () => import( '../views/Pengguna.vue')
      },    
      {
        path: '/laporan/penjualan',
        name: 'laporan penjualan',
        component: () => import( '../views/LapPenjualan.vue')
      },         
      {
        path: '/laporan/shift',
        name: 'laporan Shift',
        component: () => import( '../views/LapShift.vue')
      },               
      // kasir
      {
        path: '/antrian',
        name: 'antrian',
        component: () => import( '../views/TransaksiQueue.vue')
      },            
      {
        path: '/penjualan',
        name: 'penjualan',
        component: () => import( '../views/Penjualan.vue')
      },                 
      {
        path: '/item',
        name: 'item',
        component: () => import( '../components/TabelProduk.vue')
      },                 
      {
        path: '/shift',
        name: 'shift',
        component: () => import( '../views/Shift.vue')
      },                    
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/:catchAll',
    name: 'pageNotFound',
    component: () => import('../components/PageNotFound.vue'),
  },
  
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
