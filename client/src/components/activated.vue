<template>
  <div>

    <!-- 激活 -->
    <el-card class="box-card">
      <h1>正在激活用户, 请稍后...</h1>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Activated",
  data() {

    return {
    };
  },
  mounted () {
   
   this.activated();
  },
  methods: {
    getQueryVariable(variable) {
     
      let pos = location.href.indexOf('?');
      if(pos == -1) {
        return '';
      }

      let query = location.href.substring(pos+1);

      let vars = query.split("&");
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");

        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return '';
    },
    activated: function() {
      const token = this.getQueryVariable('token');
      this.$ajax
        .postJSON("/sso/activated", {token: token})
        .then((res) => {
            this.$message({
              message: "激活成功, 即将跳转登录",
              type: "success",
            });

            setTimeout(()=>{
              location.href = res.href;
            }, 1000); 
        }).catch(err=>{
            this.$message({
              message: "激活失败, 请检查连接的合法性!",
              type: "warning",
            });
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-card {
  width: 450px;
  margin: 0 auto;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
