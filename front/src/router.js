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
          component: Main,
          meta: {
              title: 'Main Page - Legalscreen.org',
          },
      },
      {
          path: '/about',
          name: 'about',
          component: About,
          meta: {
              title: 'About Page - Legalscreen.org',
          },
      },
      {
          path: '/v/:id',
          name: 'view',
          component: Detail,
          meta: {
              title: 'Screen detail - Legalscreen.org',
          },
      }
    ]
})
