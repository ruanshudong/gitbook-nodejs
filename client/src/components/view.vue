<template>
  <div v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    >
    <span v-html="html"> </span>
</div>
  
</template>

<script >

export default {
  name: 'Page',
  data() {
    return {
      loading: false,
      html: ''
    };
  },
  methods: {
   
    proxyImage: function (e) {
            if (e.target.tagName.toUpperCase() === 'IMG') {
              this.img = e.target.src
            }
    },
    fetchData() {

      this.loading = true;
      let page = location.hash;

      this.$ajax .getJSON("/api/view", { page }) .then((data) => {
        setTimeout(() => {
          this.loading = false;
          this.html = data.data;          
        }, 200);

        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  created() {
    this.fetchData();
  },
  mounted() {
  },
}

</script>

