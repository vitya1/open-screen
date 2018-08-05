import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main.vue'
import Detail from '@/components/Detail.vue'
import About from '@/components/About.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
      {
          path: '/',
          name: 'main',
          component: Main
      },
      {
          path: '/about',
          name: 'about',
          component: About
      },
      {
          path: '/:id',
          name: 'view',
          component: Detail
      }
    ]
})
