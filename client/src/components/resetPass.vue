<template>
  <div>

    <!-- 重置密码 -->
    <el-card class="box-card">
      <h1>重置密码</h1>
      <el-form
        label-width="80px"
        :model="data"
        ref="ruleForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="设置密码" prop="password" required>
          <el-input
            placeholder="长度在 6 到 16 个字符"
            v-model="data.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPass" required>
          <el-input
            placeholder="请重复输入密码"
            v-model="data.checkPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-button type="primary" size="small" round @click="resetPass">提 交</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import sha1 from 'sha1';
export default {
  name: "ResetPass",
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

    return {
      data: {
        password: "",
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
    resetPass: function() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          const token = this.getQueryVariable('token');
          this.$ajax
            .postJSON("/sso/resetPass", {password: sha1(this.data.password), token: token})
            .then((res) => {
                this.$message({
                  message: "重置密码成功, 即将跳转登录",
                  type: "success",
                });

                setTimeout(()=>{
                  location.href = res.href;
                }, 1000); 
            }).catch(err=>{
                this.$message({
                  message: "连接已经过期, 重置密码失败!",
                  type: "warning",
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

