import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
import './plugins/mavonEditor';
import axios from 'axios';

Vue.config.productionTip = false;

axios.interceptors.request.use((config) => {
  if (localStorage.getItem('JWT_TOKEN')) {
    config.headers.Authorization = localStorage.getItem('JWT_TOKEN');
  }
  return config;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
