<template>
  <div>
    <!-- 登录 -->
    <el-card class="box-card" v-show="showLogin">
      <h1>{{ msg }}登录优品文档</h1>
      <el-form
        label-width="0"
        ref="ruleFormLogin"
        :model="data"
        :rules="rules"
      >
        <el-form-item prop="uid">
          <el-input
            v-model="data.uid"
            placeholder="邮箱"
            prefix-icon="el-icon-user"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            v-model="data.password"
            show-password
            prefix-icon="el-icon-key"
          >
          </el-input>
        </el-form-item>
        <el-form-item required>
          <div class="captcha_box">
            <el-input
              type="text"
              :placeholder="$t('login.captcha')"
              v-model="data.captcha"
              required
              :required-tip="$t('login.captchaTips')"
              @keydown.enter="login"
            ></el-input>
            <img class="captcha_code" title="点击刷新" :src="captchaUrl" @click="reloadCaptcha" />
          </div>
        </el-form-item>

        <el-button size="small" round @click="show_registry">注 册</el-button>
        <el-button type="primary" size="small" round @click="login">登 录</el-button>
        <el-button size="small" style="float:right" round @click="forget_pass">找回密码</el-button>
      </el-form>
    </el-card>

    <!-- 注册 -->
    <el-card class="box-card" v-show="showRegistry">
      <h1>{{ msg }}注册为新用户</h1>
      <el-form
        label-width="80px"
        :model="data"
        ref="ruleForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="邮箱" prop="uid" required>
          <el-input v-model="data.uid" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <el-input
            placeholder="长度在 6 到 16 个字符"
            v-model="data.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPass">
          <el-input
            placeholder="请重复输入密码"
            v-model="data.checkPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-button size="small" round @click="show_login">返 回</el-button>
        <el-button type="primary" size="small" round @click="register">提 交</el-button>
      </el-form>
    </el-card>


    <!-- 找回密码 -->
    <el-card class="box-card" v-show="showForget">
      <h1>找回密码</h1>
      <el-form
        label-width="80px"
        :model="data"
        ref="ruleForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="邮箱" prop="uid" required>
          <el-input v-model="data.uid" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-button size="small" round @click="show_login">返 回</el-button>
        <el-button type="primary" size="small" round @click="forget">提 交</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import sha1 from 'sha1';

export default {
  name: "Login",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.data.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    var validateEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("请输入合法的邮箱地址"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };

    return {
      msg: "欢迎",
      data: {
        uid: "",
        captcha: "",
        password: "",
        checkPass: "",
      },
      captchaUrl: `/captcha?${Math.random()}`,
      showLogin: 1,
      showRegistry: 0,
      showForget: 0,
      rules: {
        uid: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { message: "请输入合法的邮箱地址", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        // uid: [],
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
    reloadCaptcha() {
      this.captchaUrl = `/pages/sso/captcha?${Math.random()}`
    },
    login: function() {
      this.$refs["ruleFormLogin"].validate((valid) => {
        if (valid) {
          this.$ajax
            .postJSON("/sso/login", {uid: this.data.uid, password: sha1(this.data.password), captcha: this.data.captcha})
            .then((res) => {
                window.location.href = "/";
            }).catch(err=>{
                this.$message({
                  message: err.err_msg,
                  type: "warning",
                });
            });
        } else {
          return false;
        }
      });
    },
    forget_pass: function() {
      this.showForget = 1;
      this.showRegistry = 0;
      this.showLogin = 0;

    },
    show_registry: function() {
      this.showForget = 0;
      this.showRegistry = 1;
      this.showLogin = 0;
    },
    show_login: function() {
      this.showForget = 0;
      this.showRegistry = 0;
      this.showLogin = 1;
    },
    forget: function() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$ajax.postJSON("/sso/forget", {uid: this.data.uid}).then(data=>{
            this.$message({
              message: "恭喜你，找回密码邮件已经发送到邮箱，请重新设置密码后登陆",
              type: "success",
            });
          }).catch(err=>{
            this.$message({
              message: err,
              type: "error",
            });            
          });

        } else {
          return false;
        }
      });
    },
    register: function() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$ajax.postJSON("/sso/register", {uid: this.data.uid, password: sha1(this.data.password)}).then(data=>{
            this.$message({
              message: "恭喜你，验证邮件已经发送到邮箱，请激活后登录",
              type: "success",
            });
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
  mounted() {
    this.reloadCaptcha();
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
.captcha_box{display:flex;}
.captcha_code{cursor:pointer;display:block;height:32px;margin-left:20px;}
</style>
