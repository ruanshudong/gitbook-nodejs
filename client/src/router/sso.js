import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import ResetPass from '@/components/resetPass.vue'
import ModifyPass from '@/components/modifyPass.vue'
import Activated from '@/components/activated.vue'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/resetPass',
      name: 'ResetPass',
      component: ResetPass
    },
    {
      path: '/modifyPass',
      name: 'ModifyPass',
      component: ModifyPass
    },
    {
      path: '/activated',
      name: 'Activated',
      component: Activated
    },
    {
      path: '*',
      redirect: '/login',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
