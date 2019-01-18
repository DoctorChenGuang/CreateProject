import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'menu',
      component: require('@/components/menu').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
