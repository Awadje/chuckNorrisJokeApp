import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import App from './App.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: 'root',
      component: App,
      redirect: { name: 'base' },
      meta: { requiresAuth: true }
    },
    {
      path: '/base',
      name: 'base',
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "base" */ './views/Base.vue'),
    
    }
  ]
})
