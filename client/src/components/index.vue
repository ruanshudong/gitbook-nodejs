<template>




<el-container>
  <el-header width="100%">
    <img class="logo" src="/static/images/logo.png">
    <!-- <div class="search_bar">      
        <el-input placeholder="请输入搜索关键字" v-model="input" class="input-with-select">       
        <el-button slot="append" icon="el-icon-search" @click="query"></el-button>
        </el-input>      
    </div> -->

<el-menu :default-active="activeIndex" class="btn_login_out" mode="horizontal" @select="handleSelect" v-if="uid != ''">
  <el-submenu index="1">
    <template slot="title">
     <div class="login_bar">你好，<span>{{uid}}</span></div>         
      </template>
    <el-menu-item index="1" class="el-icon-unlock"> 修改密码</el-menu-item>
    <br>
    <el-menu-item index="2" class="el-icon-switch-button"> 退出</el-menu-item>
  </el-submenu>
</el-menu>
    
  </el-header>
  <el-container>
    <el-aside width="300px">
        <div>
          <el-tree
            :auto-expand-parent = "true"
            :default-expanded-keys="checkedKeys"     
            node-key="id"
            :data="treeData"
            :props="defaultProps"
            @node-click="selectTree"
            highlight-current
          ></el-tree>
        </div>
    </el-aside>

    <el-main id="main" v-viewer>
      <div v-if="!search">
       <router-view></router-view>
       <div class="backTop">回到顶部</div>
      </div>
      <div v-if="search">
        <el-tag type="success" style="cursor: pointer" v-for="(data, index) in queryData" :key="index" @click="selectTree(data.href)">{{data.name}}</el-tag>
      </div>
    </el-main>

  </el-container>
</el-container>

</template>

<script >
export default {
  name: "Index",
  data() {
    return {
      expandedKeys:[],
      checkedKeys:[],
      uid: '--',
      activeIndex: "0",
      input: '',
      search: false,
      queryData: [],
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
  methods: {
    backTop(){
      document.getElementById("main").scrollTop = 0;
    },
    query() {

      this.$ajax
        .getJSON("/api/search", {query: this.input})
        .then((data) => {
          this.search = true;
          this.queryData = data;
        })
        .catch((err) => {
        });      

    },
    getUid() {

      this.$ajax
        .getJSON("/sso/getLoginUid")
        .then((data) => {
          this.uid = data.uid;
        })
        .catch((err) => {
        });
    },
    handleSelect(menu) {

      switch(menu) {
        case "1":
          {
            location.href="/sso.html#modifyPass";  
            break;
          }
        case "2":
          {
          location.href="/logout";
          break;
          }

      }
    },
    selectTree(nodeKey) {

      this.search = false;

      // location.href = nodeKey.href;

      if (nodeKey.href) {
        this.$router.push(`/${nodeKey.href}`);
      }
      setTimeout('document.getElementById("main").scrollTop = 0',200)
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
    // 主方法查询目标节点
    searchTree(tree, id) {
        let res = this.findNode(tree, id)
        //边界处理，输入的id不存在相对应的节点时
        if (res == undefined) {
            return ''
        }
        res.path.unshift(tree.id)
        let path = res.path
        let node = res.node
        let leaves = this.findLeaves(node)
        return {
            path,
            leaves
        }
    },
    // 深度遍历查找目标节点及缓存相关路径
    findNode(tree, id) {
        if (tree.id == id) {
            return {
                path: [],
                node: tree
            }
        }
        let res;
        for (let i = 0; i < tree.children.length; i++) {
            res = this.findNode(tree.children[i], id)
            if (res != undefined) {
                res.path.unshift(tree.children[i].id)
                return res
            }
        }
        return undefined
    },
    // 递归获取叶子节点
    findLeaves(node) {
        if (node.children.length == 0) {
            return [node.id]
        }
        let leaves = []
        let res = []
        for (let i = 0; i < node.children.length; i++) {
            res = this.findLeaves(node.children[i])
            leaves = res.concat(leaves)
        }
        return leaves
    },
    // 查询目标节点path
   queryTargetNode(jsonData, targetNode) {
        let target = {};
        if(jsonData && jsonData.length > 0) {
            for(let i = 0, len = jsonData.length; i < len; i++) {
                let res = this.searchTree(jsonData[i], targetNode);
                if(res) {
                    target = res;
                    break;
                }
            }
        }
        return target;
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

          //递归实现
          //@href    查找对应的id，
          //@nodes   原始Json数据
          //@path    供递归使用
          function findPathByLeafId(href, nodes, path) {
            if(path === undefined) {
              path = [];
            }
            for(var i = 0; i < nodes.length; i++) {
                var tmpPath = path.concat();
                tmpPath.push(nodes[i].href);        
                if(href == nodes[i].href) {
                  // return nodes[i].id;
                  return nodes[i].id;
                }
                if(nodes[i].children) {
                  var findResult = findPathByLeafId(href, nodes[i].children, tmpPath);
                  if(findResult) {
                    // return nodes[i].children.id;
                    return findResult;
                  }
                }
            }
          }
          var curNode = findPathByLeafId(decodeURIComponent(this.$route.path.substr(1)), data.tree);

          try {
            
            const expandedRes = this.queryTargetNode(data.tree, curNode);
  
            this.expandedKeys = expandedRes.path
            
            this.checkedKeys = expandedRes.leaves
          } catch (error) {
            console.log(error)
          }
          
          
        })
        .catch((err) => {
          this.treeErrMsg = err.err_msg || err.message || "load failed";
          this.treeData = [];
        });
    },
  },
  created() {
    this.getTreeData("", 0);
    this.getUid();
  },
  mounted() {
    $(".backTop").click(function(){
       $("main").scrollTop(0);
      // $("main").animate({scrollTop:0},'slow');
            
    })

   $("main").scroll(function() {
      if(this.scrollTop > $(this).height()){
          $(".backTop").addClass("fade_in");
      }
      else{
          $(".backTop").removeClass("fade_in");
      }
      
   })
  },
};
</script>

