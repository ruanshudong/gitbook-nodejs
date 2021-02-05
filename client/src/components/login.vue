<template>
  <div>
    <!-- 登录 -->
    <el-card class="box-card" v-show="showLogin">
      <h1>{{ msg }}登录优品文档</h1>
      <el-form
        label-width="0"
        ref="ruleFormLogin"
        :model="ruleFormLogin"
        :rules="rules"
      >
        <el-form-item prop="uid">
          <el-input
            v-model="ruleFormLogin.uid"
            placeholder="邮箱"
            prefix-icon="el-icon-user"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            v-model="ruleFormLogin.password"
            show-password
            prefix-icon="el-icon-key"
          >
          </el-input>
        </el-form-item>
        <el-button size="small" round @click="show_registry">注 册</el-button>
        <el-button type="primary" size="small" round @click="login"
          >登 录</el-button
        >
      </el-form>
    </el-card>

    <!-- 注册 -->
    <el-card class="box-card" v-show="showRegistry">
      <h1>{{ msg }}注册为新用户</h1>
      <el-form
        label-width="80px"
        :model="ruleForm"
        ref="ruleForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="邮箱" prop="uid">
          <el-input
            v-model="ruleForm.uid"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <el-input
            placeholder="长度在 6 到 16 个字符"
            v-model="ruleForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPass">
          <el-input
            placeholder="请重复输入密码"
            v-model="ruleForm.checkPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-button size="small" round @click="show_login">返 回</el-button>
        <el-button type="primary" size="small" round @click="registry"
          >提 交</el-button
        >
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      msg: "欢迎",
      ruleFormLogin: {
        uid: "",
        password: "",
      },
      ruleForm: {
        uid: "",
        password: "",
        checkPass: "",
      },
      showLogin: 1,
      showRegistry: 0,
      rules: {
        uid: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "账号长度在4到16个字符",
            trigger: "blur",
          },
        ],

        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在6到16个字符",
            trigger: "blur",
          },
        ],

        uid: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 4, max: 16, message: "长度在4到16个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请设置密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6到16个字符", trigger: "blur" },
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    login: function () {
      this.$refs["ruleFormLogin"].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/login", {
              userName: this.ruleFormLogin.uid,
              passWord: this.ruleFormLogin.password,
            })
            .then((res) => {
              if (res.data.isLogin == 1) {
                window.location = "/";
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
              } else {
                this.$message({
                  message: "用户名或密码错误，请重新输入",
                  type: "warning",
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    show_registry: function () {
      this.showRegistry = 1;
      this.showLogin = 0;
    },
    show_login: function () {
      this.showRegistry = 0;
      this.showLogin = 1;
    },

    registry: function () {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$ajax.portJSON("/api/register", {
            userName: this.ruleForm.uid,
            passWord: this.ruleForm.password,
          });
          this.$message({
            message: "恭喜你，验证邮件已经发送到邮箱，请激活后登录",
            type: "success",
          });
        } else {
          console.log("error submit!!");
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
