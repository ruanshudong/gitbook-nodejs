// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Main from './main.vue'
import router from './router/main'

import ElementUI from 'element-ui'
  
import 'element-ui/lib/theme-chalk/index.css'

import './plugins/ajax';

import vueResource from "vue-resource";

import {i18n, loadLang} from './locale/i18n'

import './assets/css/style.css'


//代码高亮文件引入
import hljs from 'highlight.js'
//样式文件,这里我选的是sublime样式，文件里面还有其他样式可供选择
import 'highlight.js/styles/monokai-sublime.css' 

import $ from 'n-zepto'
// import 'n-zepto/fx.js'

import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer';
Vue.use(Viewer);



Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
      blocks.forEach((block)=>{
      hljs.highlightBlock(block)
  })
})


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
    components: {Main},
    template: '<Main/>'
  });
})
