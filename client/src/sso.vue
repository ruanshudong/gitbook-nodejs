<template>
  <div id="app">
    <el-container >
     <router-view style="height:100%"></router-view>
    </el-container>
  </div>
</template>


<script >

export default {
  name: 'sso',
  data() {
    return {
    };
  },
  methods: {
    
    // checkLogin() {

    //   this.$ajax.getJSON("/sso/isLogin")
    //     .then((data) => {
    //       if(!data.login) {
    //         location.hash=data.hash;
    //       }
    //     })
    //     .catch((err) => {
    //       location.hash='/login';
    //       // location.href="/login.html";
    //     });
    // },
  },
  created() {
  },
  mounted() {
  },
}

</script>