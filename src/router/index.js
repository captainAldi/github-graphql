import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { 
      auth: true 
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/organizations',
    name: 'Organizations',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Organizations.vue'),
    meta: { 
      auth: true 
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // jika routing ada meta auth-nya maka
  if (to.matched.some(record => record.meta.auth)) {
    // jika user adalah guest
    if(store.getters['auth/guest']){
      // tampilkan pesan bahwa harus login dulu
      store.dispatch('alert/set', {
        status : true,
        text  : 'Login first !',
        color  : 'error',
      })
      store.dispatch('prevUrl/setPrevUrl', to.path) 
      //redirect ke form login
      next('/login')
    }
    else{
      next()
    } 
  }
  else{
      next()
  }
})

export default router
