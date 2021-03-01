<template>
  <div>
     <img class="logo" src="/static/images/logo_white.png">
    <!-- 登录 -->
    <el-card  class="box-card" v-show="1">
      <h1>登 录</h1>
      <el-form
        label-width="0"
        ref="ruleFormLogin"
        :model="data"
        :rules="rules"
      >
        <el-form-item prop="uid">
          <el-input
            v-model="data.uid"
            placeholder="用户邮箱"
            prefix-icon="el-icon-message"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="输入密码"
            v-model="data.password"
            show-password
            prefix-icon="el-icon-key"
          >
          </el-input>
        </el-form-item>
        <el-form-item required>
          <div class="captcha_box">
            <el-input
            prefix-icon="el-icon-finished"            
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

    
        <el-button type="primary" size="small" round @click="login" class="btn_long">登 录</el-button>
        <div class="sub_menu">
          <a size="small" style="float:right" round @click="forget_pass">找回密码</a>
          <a size="small" round @click="show_registry">注 册</a>
        </div>
      </el-form>
    </el-card>

    <!-- 注册 -->
    <el-card class="box-card" v-show="showRegistry">
      <h1>注 册</h1>
      <el-form
        label-width="80px"
        :model="data"
        ref="ruleForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="邮箱" prop="uid" required>
          <el-input v-model="data.uid" placeholder="请输入邮箱"  prefix-icon="el-icon-message" ></el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="password">
          <el-input
             prefix-icon="el-icon-key"
            placeholder="必须为6到16个字符"
            v-model="data.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPass"  required>
          <el-input
            prefix-icon="el-icon-key"
            placeholder="请重复上面的密码"
            v-model="data.checkPass"
            show-password
          ></el-input>
        </el-form-item>       
        <el-button  class="btn_long"  type="primary" size="small" round @click="register">注 册</el-button>
        <div class="sub_menu"> <a size="small" round @click="show_login">返 回</a></div>
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
        <el-form-item label="邮箱" prop="uid" required >
          <el-input v-model="data.uid" placeholder="请输入注册邮箱"  prefix-icon="el-icon-message"></el-input>
        </el-form-item>

        <el-button class="btn_long" type="primary" size="small" round @click="forget">提 交</el-button>
        <div class="sub_menu"><a size="small" round @click="show_login">返 回</a></div>
      </el-form>
    </el-card>

  <div class="copyright"> Copyright©2012-2021 优品科技管理股份有限公司 400-603-1846 版权所有 <a href="http://www.miitbeian.gov.cn" target="_blank">粤ICP备15103921号-3</a></div></div>  
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
      const mailReg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
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
      activeName: 'first',
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
     handleClick(tab, event) {
        console.log(tab, event);
      },
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
              message: "恭喜你，验证邮件已经发送到邮箱，请激活后登录, 正在跳转到登录界面",
              type: "success",
            });

            setTimeout(()=>{
              location.href="/"; 
            }, 3000);
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

