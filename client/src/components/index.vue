<template>
<el-container>
  <el-header width="100%">
    <img class="logo" src="/images/logo.png">
    <div class="search_bar">      
        <el-input placeholder="请输入搜索关键字" v-model="input" class="input-with-select">       
        <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>      
    </div>
    <div class="login_bar">你好，<span>64835173@qq.com</span><span class="v_line">|</span>退出</div>
  </el-header>
  <el-container>
    <el-aside width="300px">
        <div>
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="selectTree"
          ></el-tree>
        </div>
    </el-aside>
    <el-main>
       <router-view></router-view>      
    </el-main>
  </el-container>
</el-container>

</template>

<script >
export default {
  name: "Index",
  data() {
    return {
      input: '',
      treeErrMsg: "load failed",
      treeData: [],
      treeSearchKey: "",
      page: "README.md",
      isIconPlay: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  // directives: {
  //   vscroll: {
  //     componentUpdated(el) {
  //       let boxEl = el;
  //       let itemEl = el.children;
  //       let currEl = null;

  //       for(let i = 0; i < itemEl.length; i++) {
  //         let item = itemEl.item(i);

  //         const iclass = item.getAttribute("class");

  //         if (iclass && iclass.indexOf("active") > -1) {
  //           currEl = item;
  //         } else {
  //           return;
  //         }
  //       };

  //       if (currEl.offsetLeft < boxEl.scrollLeft) {
  //         const x = currEl.offsetLeft;
  //         boxEl.scrollTo(x, 0);
  //       } else if (
  //         currEl.offsetLeft + currEl.offsetWidth >
  //         boxEl.scrollLeft + boxEl.offsetWidth
  //       ) {
  //         const x = currEl.offsetLeft + currEl.offsetWidth - boxEl.offsetWidth;
  //         boxEl.scrollTo(x, 0);
  //       }
  //     },
  //   },
  // },
  methods: {
    iconLoading() {
      const that = this;
      if (!that.isIconPlay) {
        that.isIconPlay = true;
        setTimeout(function () {
          that.isIconPlay = false;
        }, 1000);
      }
    },
    treeSearch(type) {
      this.iconLoading();
      this.getTreeData(this.treeSearchKey, type);
    },
    selectTree(nodeKey) {
      if (nodeKey.href) {
        this.$router.push(`/${nodeKey.href}`);
      }
    },
    // 处理接口返回数据
    handleData(res) {
      if (!res || !res.length) return;
      res.forEach((node) => {
        node.label = node.name; //eslint-disable-line
        node.nodeKey = node.id; //eslint-disable-line

        if (this.treeSearchKey) {
          node.expand = true;
        }

        if (node.children && node.children.length) {
          this.handleData(node.children);
        }
      });
    },
    getTreeData(key, type) {
      this.treeData = [];

      this.$ajax
        .getJSON("/api/tree", {
          searchKey: key || "",
          type: type,
        })
        .then((data) => {
          document.title = data.title;
          this.treeData = data.tree;
          this.handleData(this.treeData);
          this.selectTree({ href: "" });
        })
        .catch((err) => {
          this.treeErrMsg = err.err_msg || err.message || "load failed";
          this.treeData = [];
        });
    },
  },
  created() {},
  mounted() {
    this.getTreeData("", 0);
  },
};
</script>

<style>
body,button,dd,div,dl,fieldset,figure,footer,h1,h2,h3,h4,h5,h6,header,input,menu,nav,ol,p,select,span,td,textarea,th,ul{margin:0;padding:0;-webkit-text-size-adjust:none}
li{list-style:none}
em,i{font-style:normal}
a,a:visited{border:none;text-decoration:none}
fieldset,img,input{border:none}
input,textarea{outline:0;resize:none;-webkit-appearance:none}
body{word-wrap:break-word;font-family:"-apple-system",BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei","Source Han Sans CN",sans-serif;line-height:1.6;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-user-select:none}
.clear{zoom:1}
.clear:after,.clear:before{display:block;content:""}
.clear:after{clear:both}
.fl{float:left;display:block}
.fr{float:right;display:block}
.none{display:none!important}
input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration,input[type=search]::-webkit-search-results-button,input[type=search]::-webkit-search-results-decoration{display:none}
::-webkit-scrollbar-track{border:1px solid #4d7fbf;background-color:#f5f5f5}
::-webkit-scrollbar{width:8px;height:8px;background-color:#f5f5f5}
::-webkit-scrollbar-thumb{background-color:#4d7fbf}
body{color:#333;font-size:16px}
.el-aside{background:#fbfbfb;height:100%;border-right:1px solid rgb(0 0 0 / 7%); padding-top: 90px;}
.el-main{padding:0 200px 40px!important}
.el-tree{background:0 0!important}
.el-tree-node{font-size:18px;line-height:1.6}
.el-tree-node__content{padding:4px 14px!important}
.el-tree-node__expand-icon{font-size:14px!important}
.is-current>.el-tree-node__content{background:#f0f4ff!important;color:#ccc;color:#326dd8;font-weight:700}
.is-current .el-tree-node__expand-icon{color:#326dd8}
.el-tree-node__expand-icon.expanded{color:#326dd8!important}
[role=group] .el-tree-node__content{padding-left:40px!important}
.el-tree-node__label{color:#333!important}
#app,.el-container,body,html{height:100%}
h1,h2,h3,h4,h5,h6{color:#4d7fbf}
h1{font-size:28px;margin:80px 0}
h2{font-size:20px;margin:20px 0}
h3{font-size:18px;margin:25px 0}
h4{font-size:16px;margin:20px 0}
a{text-decoration:underline;color:#900b09;margin:0 10px}
h2 a{margin:0}
td>a,th>a{margin:0}
p{margin-bottom:20px;font-size:16px;line-height:1.8}
strong{color:#4d7fbf}
blockquote{border-left:5px solid #ddd;padding:10px 5px 10px 15px;margin:15px 0;font-size:15px;color:#555;background-color:#f5f5f5}
blockquote ul{margin-bottom:0}
blockquote ul a{margin:0}
pre{border:none!important;margin:0!important}
code{background:#fbfbfb;margin:20px 20px;border:1px solid #c3ccd0;width:100%;background-color:#201e2f;white-space:pre-wrap!important;padding:10px!important;margin:15px 0;display:block;line-height:1.7;box-sizing:border-box;border-radius:3px;font-size:14px;font-family:Consolas,"Liberation Mono",Menlo,Courier,monospace!important;overflow-x:auto;border:1px solid #201e2f;color:#f8f8f2}
ol,ul{padding-left:20px;margin-bottom:30px}
ol li,ul li{list-style:initial;line-height:1.8;list-color:#4d7fbf}
ol li p,ul li p{margin-bottom:0}
table{font-family:verdana,arial,sans-serif;font-size:15px;color:#333;border-width:1px;border-color:#c3ccd0;border-collapse:collapse;margin-bottom:20px;margin:30px 20px}
table th{border-width:1px;padding:8px;border-style:solid;border-color:#c3ccd0;min-width:50px}
table th strong{color:#333!important}
table th:nth-child(1){text-align:left}
table td{border-width:1px;padding:0 8px;line-height:30px;border-style:solid;border-color:#c3ccd0;color:#555}
table th,table tr:nth-child(2n){background-color:#f8f8f8!important}

.el-tree-node__expand-icon.expanded {
    transform: rotate(0deg)!important;
}
.el-tree-node__expand-icon{ color: #333!important;}

/* 正常文件夹 */
.el-icon-caret-right:before{content: "\e78a"!important;font-size: 18px;}
/* 打开文件夹 */
.is-expanded  .el-icon-caret-right:before{content: "\e784"!important;font-size: 18px;}

/* 二级目录 */
*[role=group]  .el-icon-caret-right:before{content: "\e78a"!important;font-size: 18px;}
*[role=group]  .is-expanded .el-icon-caret-right:before{content: "\e784"!important;font-size: 18px;}

/* 二级目录下文件 */
 *[role=group]  .is-leaf.el-tree-node__expand-icon:before{content: "\e78b"!important; color: #333; font-size: 18px; padding-left: 20px;} 

/* 正常文件 */
.is-leaf.el-tree-node__expand-icon:before{content: "\e78b"!important; color: #333; font-size: 18px;} 
.is-current>.el-tree-node__content :before{ font-weight:bold;}

.el-header{    position: fixed;
    height: 55px;
    top: 0px;
    width: 100%;
    z-index: 1000;
    background: #F9F9f9;
    border-bottom: 1px solid #DDD; box-shadow: 0 2px 4px rgba(0,0,0,0.05);}

    .logo{ margin:10px;}
    .search_bar{ position: absolute; left: 400px; right:  400px; top: 10px;}
    .login_bar{ position: absolute; right: 0; top: 15px; right: 20px; font-size: 14px; color: #333;}
    .search_bar input{border: none;background: #EFEFEF;height: 35px;
    line-height: 35px;    font-size: 14px;
    color: #333;    padding: 0 8px;
}
    .login_bar span{ color: #4d7fbf;}
      .login_bar span.v_line{margin: 0 10px; color: #999;}
    .el-input-group__append{background: #ea7c21!important;}
    .el-icon-search{font-size: 18px; color: #fff;}
    /* .el-input.is-active .el-input__inner, .el-input__inner:focus{     border-color: none!important;} */
</style>
