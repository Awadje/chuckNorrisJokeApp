import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'


Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  let auth = JSON.parse(localStorage.getItem('auth'))
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (auth === null || !auth.authenticated) {
      console.info('Redirecting because authentication')
      next({
        path: '/home',
        query: { redirect: to.fullPath }
      })
    } else {
      console.info('Allowed')
      next()
    }
} else {
  next()
}
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
