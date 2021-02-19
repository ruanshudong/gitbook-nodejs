<template>
  <div id="app">
    <el-container >
     <router-view style="height:100%"></router-view>
    </el-container>
  </div>
</template>


<script >

export default {
  name: 'Main',
  data() {
    return {
    };
  },
  methods: {
    
    checkLogin() {

      this.$ajax.getJSON("/sso/isLogin")
        .then((data) => {
          if(!data.login) {
            location.href=data.href;
          }
        })
        .catch((err) => {
          location.href='/sso.html#/login';
        });
    },
  },
  created() {
    this.checkLogin();
  },
  mounted() {
  },
}

</script>