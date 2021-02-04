<template>
  <el-container style="height: 500px; ">
    <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
      <div>
        <el-tree :data="treeData" :props="defaultProps" @node-click="selectTree"></el-tree>
      </div>
      
    </el-aside>

    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script >

export default {
  name: 'Index',
  data() {
    return {
      treeErrMsg: "load failed",
      treeData: [],
      treeSearchKey: "",
      page: "README.md",
      isIconPlay: false,
      defaultProps: {
          children: 'children',
          label: 'label'
        }
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
        setTimeout(function() {
          that.isIconPlay = false;
        }, 1000);
      }
    },
    treeSearch(type) {
      this.iconLoading();
      this.getTreeData(this.treeSearchKey, type);
    },
    selectTree(nodeKey) {
      if(nodeKey.href) {
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
          type: type
        })
        .then((data) => {
          document.title=data.title;
          this.treeData = data.tree;
          this.handleData(this.treeData);
          this.selectTree({href: ''});
        })
        .catch((err) => {

          this.treeErrMsg = err.err_msg || err.message || "load failed";
          this.treeData = [];
        });
    },
  },
  created() {},
  mounted() {
    this.getTreeData('', 0);
  },
}

</script>

<style>

</style>
