(function(e){function t(t){for(var r,c,u=t[0],s=t[1],i=t[2],h=0,f=[];h<u.length;h++)c=u[h],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&f.push(a[c][0]),a[c]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);l&&l(t);while(f.length)f.shift()();return o.push.apply(o,i||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,u=1;u<n.length;u++){var s=n[u];0!==a[s]&&(r=!1)}r&&(o.splice(t--,1),e=c(c.s=n[0]))}return e}var r={},a={index:0},o=[];function c(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=e,c.c=r,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)c.d(n,r,function(t){return e[t]}.bind(null,r));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],s=u.push.bind(u);u.push=t,u=u.slice();for(var i=0;i<u.length;i++)t(u[i]);var l=s;o.push([1,"chunk-vendors"]),n()})({0:function(e,t){},1:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);var r=n("a026"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("el-container",[n("router-view",{staticStyle:{height:"100%"}})],1)],1)},o=[],c={name:"Main",data(){return{}},methods:{checkLogin(){this.$ajax.getJSON("/sso/isLogin").then(e=>{e.login||(location.href=e.href)}).catch(e=>{location.href="/sso.html#/login"})}},created(){this.checkLogin()},mounted(){}},u=c,s=n("2877"),i=Object(s["a"])(u,a,o,!1,null,null,null),l=i.exports,h=n("8c4f"),f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-container",{staticStyle:{height:"500px"}},[n("el-aside",{staticStyle:{"background-color":"rgb(238, 241, 246)"},attrs:{width:"300px"}},[n("div",[n("el-tree",{attrs:{data:e.treeData,props:e.defaultProps},on:{"node-click":e.selectTree}})],1)]),n("el-container",[n("el-main",[n("router-view")],1)],1)],1)},d=[],p={name:"Index",data(){return{treeErrMsg:"load failed",treeData:[],treeSearchKey:"",page:"README.md",isIconPlay:!1,defaultProps:{children:"children",label:"label"}}},methods:{iconLoading(){const e=this;e.isIconPlay||(e.isIconPlay=!0,setTimeout((function(){e.isIconPlay=!1}),1e3))},treeSearch(e){this.iconLoading(),this.getTreeData(this.treeSearchKey,e)},selectTree(e){e.href&&this.$router.push("/"+e.href)},handleData(e){e&&e.length&&e.forEach(e=>{e.label=e.name,e.nodeKey=e.id,this.treeSearchKey&&(e.expand=!0),e.children&&e.children.length&&this.handleData(e.children)})},getTreeData(e,t){this.treeData=[],this.$ajax.getJSON("/api/tree",{searchKey:e||"",type:t}).then(e=>{document.title=e.title,this.treeData=e.tree,this.handleData(this.treeData),this.selectTree({href:""})}).catch(e=>{this.treeErrMsg=e.err_msg||e.message||"load failed",this.treeData=[]})}},created(){},mounted(){this.getTreeData("",0)}},g=p,b=Object(s["a"])(g,f,d,!1,null,null,null),y=b.exports,m=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("span",{domProps:{innerHTML:e._s(e.html)}})},v=[],O={name:"Page",data(){return{html:""}},methods:{fetchData(){let e=location.hash;this.$ajax.getJSON("/api/view",{page:e}).then(e=>{this.html=e.data}).catch(e=>{})}},watch:{$route:"fetchData"},created(){this.fetchData()},mounted(){}},w=O,j=(n("b9ee"),Object(s["a"])(w,m,v,!1,null,null,null)),S=j.exports;const x=h["a"].prototype.push;h["a"].prototype.push=function(e){return x.call(this,e).catch(e=>e)},r["default"].use(h["a"]);var P=new h["a"]({routes:[{path:"/",name:"Index",component:y,children:[{path:"*",component:S}]},{path:"*",redirect:"/"}],scrollBehavior(e,t,n){return{x:0,y:0}}}),T=n("5c96"),E=n.n(T),D=(n("0fae"),n("b3f5"),n("28dd")),_=n("f51c");r["default"].config.productionTip=!1,r["default"].use(D["a"]),_["b"].call(void 0).then(()=>{r["default"].use(E.a,{i18n:(e,t)=>_["a"].t(e,t)}),new r["default"]({i18n:_["a"],el:"#app",router:P,components:{Main:l},template:"<Main/>"})})},6226:function(e,t,n){},"7ad2":function(e,t,n){"use strict";const r=e=>"string"===typeof e,a=Array.isArray,o=e=>"object"===typeof e&&null!==e,c=e=>"function"===typeof e,u=Object.assign;function s(e){return String(e).replace(/[^!'()~*\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu,encodeURIComponent).replace(/ /g,"+").replace(/[!'()~*]/g,e=>"%"+e.charCodeAt().toString(16).slice(-2).toUpperCase())}function i(e){if(!e)return"";const t=[];return Object.keys(e).forEach(n=>{let r=e[n];null!==r&&void 0!==r||(r=""),t.push(`${s(n)}=${s(r)}`)}),t.join("&").replace(/%20/g,"+")}function l(e){const t=(e,n,r)=>a(r)||o(r)?(Object.keys(r).forEach(a=>{t(e,`${n}[${a}]`,r[a])}),e):(e[n]=r,e);return i(Object.keys(e).reduce((n,r)=>t(n,r,e[r]),{}))}class h{constructor(e){this.defaults=e}get(e){return u({},this.defaults,e)}set(e,t){if(e){if(r(e)){const n=e.split(".");n.reduce((e,r,a)=>(a===n.length-1&&(e[r]=t),e[r]),this.defaults)}o(e)&&Object.keys(e).forEach(t=>{this.set(t,e[t])}),a(e)&&e.forEach(e=>this.set(e,t))}}remove(e){if(e){if(r(e)){const t=e.split(".");t.reduce((e,n,r)=>(r===t.length-1&&delete e[n],e[n]),this.defaults)}a(e)&&e.forEach(e=>this.remove(e))}}}class f{constructor(e){this.handler=e}set(e){c(e)&&(this.handler=e)}exec(){c(this.handler)&&this.handler.apply(null,arguments)}}class d{constructor(e){this.base=e||""}set(e){r(e)&&(this.base=e)}get(e){return this.base+(e||"")}}const p=new d,g=new h({credentials:"same-origin",timeout:5e3}),b=new h({"X-Requested-With":"XMLHttpRequest"}),y=new h({}),m=new f,v=new f(()=>!0);function O(e,t){let n=i(y.get(t));return n&&(n=-1===e.indexOf("?")?"?"+n:"&"+n),e+n}function w(e){const t=e.status;if(t>=200&&t<300||304===t)return e;throw m.exec(t,e),new Error(e.statusText)}function j(e){return e.json().then(null,t=>(m.exec(500,e),Promise.reject(t)))}function S(e){return v.handler(e)?e:Promise.reject(e)}function x(e){return Promise.reject(e)}function P(e,t){const n=g.get({headers:b.get()});return fetch(p.get(O(e,t)),n).then(w).then(j).catch(x)}function T(e,t){const n=g.get({headers:b.get()});return fetch(p.get(O(e,t)),n).then(w).then(j).then(S).catch(x)}function E(e,t){const n=g.get({method:"POST",headers:b.get({"Content-Type":"application/x-www-form-urlencoded"}),body:l(y.get(t))});return fetch(p.get(e),n).then(w).then(j).then(S).catch(x)}function D(e,t){const n=g.get({method:"POST",headers:b.get(),body:t}),r=y.get({});return Object.keys(r).forEach(e=>{t.append(e,r[e])}),fetch(p.get(e),n).then(w).then(j).then(S).catch(x)}function _(e,t){const n=g.get({method:"POST",headers:b.get({Accept:"application/json","Content-Type":"application/json"}),body:JSON.stringify(y.get(t))});return fetch(p.get(e),n).then(w).then(j).then(S).catch(x)}function M(e,t){const n=g.get({method:"PUT",headers:b.get({"Content-Type":"application/x-www-form-urlencoded"}),body:l(y.get(t))});return fetch(p.get(e),n).then(w).then(j).then(S).catch(x)}function $(e,t){const n=g.get({method:"DELETE",headers:b.get()});return fetch(p.get(O(e,t)),n).then(w).then(j).then(S).catch(x)}function k(e,t){window.open(p.get(O(e,t)))}t["a"]={ServerUrl:p,Options:g,Headers:b,Body:y,StatusHandler:m,ResultHandler:v,get:P,getJSON:T,post:E,postForm:D,postJSON:_,put:M,remove:$,download:k}},b3f5:function(e,t,n){"use strict";n("6d93");var r=n("a026"),a=n("7ad2");a["a"].ServerUrl.set("/pages"),a["a"].ResultHandler.set(e=>!(!e||200!==e.ret_code||null==e.data)),["getJSON","postJSON"].forEach(e=>{const t=a["a"][e];a["a"]["_"+e]=t,a["a"][e]=(...e)=>t.call(null,...e).then(e=>e.data)}),Object.defineProperty(r["default"].prototype,"$ajax",{get(){return a["a"]}});a["a"]},b9ee:function(e,t,n){"use strict";n("6226")},f51c:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return l}));var r=n("a026"),a=n("a925"),o=n("00e7"),c=n.n(o),u=n("7ad2");r["default"].use(a["a"]),r["default"].use(c.a);const s=new a["a"]({});var i=[];function l(){return new Promise((e,t)=>{u["a"].getJSON("/api/get_locale").then(t=>{let n=c.a.get("locale");if("[object Object]"==Object.prototype.toString.call(t)){for(var r in t)s.setLocaleMessage(r,t[r]),i.push({localeCode:r,localeName:t[r]["localeName"],localeMessages:t});n=t[n]?n:"cn",i=t}s.locale=n,e()}).catch(e=>{t(e)})})}}});