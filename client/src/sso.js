// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Sso from './sso.vue'
import router from './router/sso'

import ElementUI from 'element-ui'
  
import 'element-ui/lib/theme-chalk/index.css'

import './plugins/ajax';

import vueResource from "vue-resource";

import {i18n, loadLang} from './locale/i18n'

import './assets/css/style.css'

Vue.config.productionTip = false;

Vue.use(vueResource);

/* eslint-disable no-new */
loadLang.call(this).then(() => {

  Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
  })

  new Vue({
    i18n: i18n,
    el: '#app',
    router,
    components: {Sso},
    template: '<Sso/>'
  });
})
