(function(e){function t(t){for(var a,o,s=t[0],c=t[1],l=t[2],h=0,d=[];h<s.length;h++)o=s[h],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&d.push(r[o][0]),r[o]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a]);u&&u(t);while(d.length)d.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],a=!0,s=1;s<n.length;s++){var c=n[s];0!==r[c]&&(a=!1)}a&&(i.splice(t--,1),e=o(o.s=n[0]))}return e}var a={},r={index:0},i=[];function o(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=a,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(n,a,function(t){return e[t]}.bind(null,a));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var u=c;i.push([1,"chunk-vendors"]),n()})({0:function(e,t){},1:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);var a=n("a026"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("el-container",[n("router-view",{staticStyle:{height:"100%"}})],1)],1)},i=[],o={name:"Main",data(){return{}},methods:{async checkLogin(){try{const e=await this.$ajax.getJSON("/sso/isLogin");e.login||(location.href=e.href)}catch(e){console.log(e)}}},created(){},async mounted(){await this.checkLogin()}},s=o,c=n("2877"),l=Object(c["a"])(s,r,i,!1,null,null,null),u=l.exports,h=n("8c4f"),d=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-container",[n("el-header",{attrs:{width:"100%"}},[n("img",{staticClass:"logo",attrs:{src:"/static/images/logo.png"}}),n("div",{staticClass:"search_bar"},[n("el-input",{staticClass:"input-with-select",attrs:{placeholder:"请输入搜索关键字"},model:{value:e.input,callback:function(t){e.input=t},expression:"input"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:e.query},slot:"append"})],1)],1),""!=e.uid?n("el-menu",{staticClass:"btn_login_out",attrs:{"default-active":e.activeIndex,mode:"horizontal"},on:{select:e.handleSelect}},[n("el-submenu",{attrs:{index:"1"}},[n("template",{slot:"title"},[n("div",{staticClass:"login_bar"},[e._v("你好，"),n("span",[e._v(e._s(e.uid))])])]),n("el-menu-item",{staticClass:"el-icon-unlock",attrs:{index:"1"}},[e._v(" 修改密码")]),n("br"),n("el-menu-item",{staticClass:"el-icon-switch-button",attrs:{index:"2"}},[e._v(" 退出")])],2)],1):e._e()],1),n("el-container",[n("el-aside",{attrs:{width:"300px"}},[n("div",[n("el-tree",{attrs:{"auto-expand-parent":!0,"default-expanded-keys":e.checkedKeys,"node-key":"id",data:e.treeData,props:e.defaultProps,"highlight-current":""},on:{"node-click":e.selectTree}})],1)]),n("el-main",{directives:[{name:"viewer",rawName:"v-viewer"}],attrs:{id:"main",width:"90%"}},[e.search?e._e():n("div",{attrs:{width:"100%"}},[n("router-view"),n("div",{staticClass:"backTop"},[e._v("回到顶部")])],1),e.search?n("div",{staticStyle:{margin:"30px"}},[e._l(e.queryData,(function(t,a){return n("el-tag",{key:a,staticStyle:{cursor:"pointer",margin:"3px"},attrs:{type:"success"},on:{click:function(n){return e.searchDoc(t)}}},[e._v(e._s(t.name))])})),n("el-divider")],2):e._e(),e.showPage?n("router-view"):e._e()],1)],1)],1)},f=[],p={name:"Index",data(){return{expandedKeys:[],checkedKeys:[],uid:"--",activeIndex:"0",input:"",search:!1,showPage:!1,queryData:[],treeErrMsg:"load failed",treeData:[],treeSearchKey:"",loading:!1,html:"",page:"README.md",defaultProps:{children:"children",label:"label"}}},methods:{backTop(){document.getElementById("main").scrollTop=0},query(){this.$ajax.getJSON("/api/search",{query:this.input}).then(e=>{location.hash="/",this.search=!0,this.showPage=!1,this.queryData=e.page}).catch(e=>{})},getUid(){this.$ajax.getJSON("/sso/getLoginUid").then(e=>{this.uid=e.uid}).catch(e=>{})},handleSelect(e){switch(e){case"1":location.href="/sso.html#modifyPass";break;case"2":location.href="/logout";break}},searchDoc(e){this.search=!0,e.href&&(this.showPage=!0,this.$router.push(""+e.href.substring(1)))},selectTree(e){this.search=!1,e.href&&(this.showPage=!1,this.$router.push("/"+e.href)),setTimeout('document.getElementById("main").scrollTop = 0',200)},handleData(e){e&&e.length&&e.forEach(e=>{e.label=e.name,e.nodeKey=e.id,this.treeSearchKey&&(e.expand=!0),e.children&&e.children.length&&this.handleData(e.children)})},searchTree(e,t){let n=this.findNode(e,t);if(void 0==n)return"";n.path.unshift(e.id);let a=n.path,r=n.node,i=this.findLeaves(r);return{path:a,leaves:i}},findNode(e,t){if(e.id==t)return{path:[],node:e};let n;for(let a=0;a<e.children.length;a++)if(n=this.findNode(e.children[a],t),void 0!=n)return n.path.unshift(e.children[a].id),n},findLeaves(e){if(0==e.children.length)return[e.id];let t=[],n=[];for(let a=0;a<e.children.length;a++)n=this.findLeaves(e.children[a]),t=n.concat(t);return t},queryTargetNode(e,t){let n={};if(e&&e.length>0)for(let a=0,r=e.length;a<r;a++){let r=this.searchTree(e[a],t);if(r){n=r;break}}return n},getTreeData(e,t){this.treeData=[],this.$ajax.getJSON("/api/tree",{searchKey:e||"",type:t}).then(e=>{function t(e,n,a){void 0===a&&(a=[]);for(var r=0;r<n.length;r++){var i=a.concat();if(i.push(n[r].href),e==n[r].href)return n[r].id;if(n[r].children){var o=t(e,n[r].children,i);if(o)return o}}}document.title=e.title,this.treeData=e.tree,this.handleData(this.treeData),this.selectTree({href:""});var n=t(decodeURIComponent(this.$route.path.substr(1)),e.tree);try{const t=this.queryTargetNode(e.tree,n);this.expandedKeys=t.path,this.checkedKeys=t.leaves}catch(a){console.log(a)}}).catch(e=>{this.treeErrMsg=e.err_msg||e.message||"load failed",this.treeData=[]})}},created(){this.getTreeData("",0),this.getUid()},mounted(){$(".backTop").click((function(){$("main").scrollTop(0)})),$("main").scroll((function(){this.scrollTop>$(this).height()?$(".backTop").addClass("fade_in"):$(".backTop").removeClass("fade_in")}))}},g=p,m=Object(c["a"])(g,d,f,!1,null,null,null),v=m.exports,y=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading"}},[n("span",{domProps:{innerHTML:e._s(e.html)}})])},b=[],w={name:"Page",data(){return{loading:!1,html:""}},methods:{proxyImage:function(e){"IMG"===e.target.tagName.toUpperCase()&&(this.img=e.target.src)},fetchData(){this.loading=!0;let e=location.hash;this.$ajax.getJSON("/api/view",{page:e}).then(e=>{setTimeout(()=>{this.loading=!1,this.html=e.page},200)}).catch(e=>{this.loading=!1})}},watch:{$route:"fetchData"},created(){this.fetchData()},mounted(){}},x=w,O=Object(c["a"])(x,y,b,!1,null,null,null),j=O.exports;const _=h["a"].prototype.push;h["a"].prototype.push=function(e){return _.call(this,e).catch(e=>e)},a["default"].use(h["a"]);var S=new h["a"]({routes:[{path:"/",name:"Index",component:v,children:[{path:"*",component:j}]},{path:"*",redirect:"/"}],scrollBehavior(e,t,n){return{x:0,y:0}}}),T=n("5c96"),k=n.n(T),P=(n("0fae"),n("b3f5"),n("28dd")),E=n("f51c"),D=(n("6672"),n("1487")),N=n.n(D),C=(n("6e2e"),n("e7c1"),n("0808"),n("6944")),M=n.n(C);a["default"].use(M.a),a["default"].directive("highlight",(function(e){let t=e.querySelectorAll("pre code");t.forEach(e=>{N.a.highlightBlock(e)})})),a["default"].config.productionTip=!1,a["default"].use(P["a"]),E["b"].call(void 0).then(()=>{a["default"].use(k.a,{i18n:(e,t)=>E["a"].t(e,t)}),new a["default"]({i18n:E["a"],el:"#app",router:S,components:{Main:u},template:"<Main/>"})})},6672:function(e,t,n){},"7ad2":function(e,t,n){"use strict";const a=e=>"string"===typeof e,r=Array.isArray,i=e=>"object"===typeof e&&null!==e,o=e=>"function"===typeof e,s=Object.assign;function c(e){return String(e).replace(/[^!'()~*\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu,encodeURIComponent).replace(/ /g,"+").replace(/[!'()~*]/g,e=>"%"+e.charCodeAt().toString(16).slice(-2).toUpperCase())}function l(e){if(!e)return"";const t=[];return Object.keys(e).forEach(n=>{let a=e[n];null!==a&&void 0!==a||(a=""),t.push(`${c(n)}=${c(a)}`)}),t.join("&").replace(/%20/g,"+")}function u(e){const t=(e,n,a)=>r(a)||i(a)?(Object.keys(a).forEach(r=>{t(e,`${n}[${r}]`,a[r])}),e):(e[n]=a,e);return l(Object.keys(e).reduce((n,a)=>t(n,a,e[a]),{}))}class h{constructor(e){this.defaults=e}get(e){return s({},this.defaults,e)}set(e,t){if(e){if(a(e)){const n=e.split(".");n.reduce((e,a,r)=>(r===n.length-1&&(e[a]=t),e[a]),this.defaults)}i(e)&&Object.keys(e).forEach(t=>{this.set(t,e[t])}),r(e)&&e.forEach(e=>this.set(e,t))}}remove(e){if(e){if(a(e)){const t=e.split(".");t.reduce((e,n,a)=>(a===t.length-1&&delete e[n],e[n]),this.defaults)}r(e)&&e.forEach(e=>this.remove(e))}}}class d{constructor(e){this.handler=e}set(e){o(e)&&(this.handler=e)}exec(){o(this.handler)&&this.handler.apply(null,arguments)}}class f{constructor(e){this.base=e||""}set(e){a(e)&&(this.base=e)}get(e){return this.base+(e||"")}}const p=new f,g=new h({credentials:"same-origin",timeout:5e3}),m=new h({"X-Requested-With":"XMLHttpRequest"}),v=new h({}),y=new d,b=new d(()=>!0);function w(e,t){let n=l(v.get(t));return n&&(n=-1===e.indexOf("?")?"?"+n:"&"+n),e+n}function x(e){const t=e.status;if(t>=200&&t<300||304===t)return e;throw y.exec(t,e),new Error(e.statusText)}function O(e){return e.json().then(null,t=>(y.exec(500,e),Promise.reject(t)))}function j(e){return b.handler(e)?e:Promise.reject(e)}function _(e){return Promise.reject(e)}function S(e,t){const n=g.get({headers:m.get()});return fetch(p.get(w(e,t)),n).then(x).then(O).catch(_)}function T(e,t){const n=g.get({headers:m.get()});return fetch(p.get(w(e,t)),n).then(x).then(O).then(j).catch(_)}function k(e,t){const n=g.get({method:"POST",headers:m.get({"Content-Type":"application/x-www-form-urlencoded"}),body:u(v.get(t))});return fetch(p.get(e),n).then(x).then(O).then(j).catch(_)}function P(e,t){const n=g.get({method:"POST",headers:m.get(),body:t}),a=v.get({});return Object.keys(a).forEach(e=>{t.append(e,a[e])}),fetch(p.get(e),n).then(x).then(O).then(j).catch(_)}function $(e,t){const n=g.get({method:"POST",headers:m.get({Accept:"application/json","Content-Type":"application/json"}),body:JSON.stringify(v.get(t))});return fetch(p.get(e),n).then(x).then(O).then(j).catch(_)}function E(e,t){const n=g.get({method:"PUT",headers:m.get({"Content-Type":"application/x-www-form-urlencoded"}),body:u(v.get(t))});return fetch(p.get(e),n).then(x).then(O).then(j).catch(_)}function D(e,t){const n=g.get({method:"DELETE",headers:m.get()});return fetch(p.get(w(e,t)),n).then(x).then(O).then(j).catch(_)}function N(e,t){window.open(p.get(w(e,t)))}t["a"]={ServerUrl:p,Options:g,Headers:m,Body:v,StatusHandler:y,ResultHandler:b,get:S,getJSON:T,post:k,postForm:P,postJSON:$,put:E,remove:D,download:N}},b3f5:function(e,t,n){"use strict";n("6d93");var a=n("a026"),r=n("7ad2");r["a"].ServerUrl.set("/pages"),r["a"].ResultHandler.set(e=>!(!e||200!==e.ret_code||null==e.data)),["getJSON","postJSON"].forEach(e=>{const t=r["a"][e];r["a"]["_"+e]=t,r["a"][e]=(...e)=>t.call(null,...e).then(e=>e.data)}),Object.defineProperty(a["default"].prototype,"$ajax",{get(){return r["a"]}});r["a"]},f51c:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return u}));var a=n("a026"),r=n("a925"),i=n("00e7"),o=n.n(i),s=n("7ad2");a["default"].use(r["a"]),a["default"].use(o.a);const c=new r["a"]({});var l=[];function u(){return new Promise((e,t)=>{s["a"].getJSON("/api/get_locale").then(t=>{let n=o.a.get("locale");if("[object Object]"==Object.prototype.toString.call(t)){for(var a in t)c.setLocaleMessage(a,t[a]),l.push({localeCode:a,localeName:t[a]["localeName"],localeMessages:t});n=t[n]?n:"cn",l=t}c.locale=n,e()}).catch(e=>{t(e)})})}}});