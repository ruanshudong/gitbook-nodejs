<template>
  <div id="app" >
    <el-container >
     <router-view style="height:100%">
     </router-view>
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
    
    async checkLogin() {
      try {

        const data = await this.$ajax.getJSON("/sso/isLogin");

        if(!data.login) {
          location.href=data.href;
        }
      }catch(err) {
        console.log(err);
      };
    },
  },
  created() {
  },
  async mounted() {
    await this.checkLogin();
  },
}

</script>