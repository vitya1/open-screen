import Vue from 'vue'
import axios from 'axios';
import 'semantic-ui-vue';

import 'semantic-ui-css/semantic.min.css';

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
