import Vue from 'vue'
import 'semantic-ui-vue';

import 'semantic-ui-css/semantic.min.css';

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
