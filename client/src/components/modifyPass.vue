<template>
  <div>

    <!-- 修改密码 -->
    <el-card class="box-card">
      <h1>修改密码</h1>
      <el-form
        label-width="150px"
        :model="data"
        ref="ruleForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="请输入旧密码" prop="newPassword" required>
          <el-input
            placeholder="长度在 6 到 16 个字符"
            v-model="data.oldPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="oldPassword" required>
          <el-input
            placeholder="长度在 6 到 16 个字符"
            v-model="data.newPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复输入新密码" prop="checkPass" required>
          <el-input
            placeholder="请重复输入密码"
            v-model="data.checkPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-button class="btn_long" type="primary" size="small" round @click="modifyPass">修 改</el-button>
        
         <div class="sub_menu"><a size="small" round @click="showIndex">返 回</a></div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import sha1 from 'sha1';
export default {
  name: "ModifyPass",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.data.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      data: {
        newPassword: "",
        oldPassword: "",
        checkPass: "",
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在6到16个字符",
            trigger: "blur",
          },
        ],
        checkPass: [
          { required: true, message: "请设置密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6到16个字符", trigger: "blur" },
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    showIndex: function() {
      location.href="/";
    },
    modifyPass: function() {
      this.$refs["ruleForm"].validate((valid) => {

        if (valid) {
          this.$ajax
            .postJSON("/sso/modifyPass", {oldPassword: sha1(this.data.oldPassword), newPassword: sha1(this.data.newPassword)})
            .then((res) => {
                this.$message({
                  message: "修改密码成功, 即将跳转登录",
                  type: "success",
                });

                setTimeout(()=>{
                  location.href = '/';
                }, 1000); 
            }).catch(err=>{
                this.$message({
                  message: err.err_msg,
                  type: "error",
                });
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-card {
  width: 600px;
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
