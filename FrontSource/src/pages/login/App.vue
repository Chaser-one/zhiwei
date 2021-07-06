<template bacground="./as">
  <div style="width: 100vw;height: 100vh">
    <BgCanvas id="bg"></BgCanvas>
    <el-row :gutter="10" class="form">
      <el-col :span="14" class="bg-img"></el-col>
      <el-col :span="10">
        <div class="login-wrapper" v-if="isLogin">
          <h1 style="text-align:center;color: #16ccec;margin: 5px">登录</h1>
          <el-form :model="loginForm" label-width="100px" ref="loginForm" :rules="rules">
            <el-form-item label="用户名" prop="userName"  class="label">
              <el-input v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" class="label">
              <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
              <el-button type="danger" @click="resetForm('loginForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="text-align: right">
            <span style="color: #3a8ee6">没有账号,点击</span>
            <el-button type="primary" @click="switchStatus">注册</el-button>
          </div>
        </div>
        <div class="register-wrapper" v-else>
          <h1 style="text-align: center">注册</h1>
          <el-form ref="registerForm" :model="registerForm" label-width="100px" :rules="rules">
            <el-form-item label="头像" prop="avatar" class="label">
              <el-upload
                  class="avatar-uploader"
                  :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                  name="blogIllustrations"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
              >
                <img v-if="registerForm.avatar" :src="registerForm.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户名" prop="userName" class="label">
              <el-input v-model="registerForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" class="label">
              <el-input v-model="registerForm.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword" class="label">
              <el-input v-model="registerForm.confirmPassword" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('registerForm')">提交</el-button>
              <el-button type="danger" @click="resetForm('registerForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="text-align: right">
            <span style="color: #3a8ee6">有账号,点击</span>
            <el-button type="primary" @click="switchStatus">登录</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>c
import BgCanvas from "@/pages/login/Components/BgCanvas"
import defaultConfig from "@/config/config.default"
import AuthorService from "@/service/AuthorService"
export default {
  name: "LoginPage",
  data() {
    let validatePass = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请输入密码'));
      } else {
        if (this.registerForm.confirmPassword) {
          this.$refs.registerForm.validateField('confirmPassword')
        }
        cb()
      }
    }
    let validatePass2 = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请输入密码'));
      } else if (value !== this.registerForm.password) {
        cb(new Error('两次输入的密码不一样'))
      } else {
        cb()
      }
    }
    return {
      defaultConfig,
      isLogin: true,
      loginForm: {
        userName: '',
        password: ''
      },
      registerForm: {
        userName: '',
        password: '',
        confirmPassword: '',
        avatar: ''
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '用户名在6~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码长度在6~16个字符之间',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码长度在6~16个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components:{
    BgCanvas
  },
  methods: {
    switchStatus() {
      this.isLogin = !this.isLogin
    },
    submitForm(formName){
      this.$refs[formName].validate((valid)=>{
        if (valid){
          if (formName==='loginForm'){
            AuthorService.loginUser(this.loginForm).then(rs => {
              if (rs.data.status === 200){
                this.$message.success('登录成功')
                sessionStorage.setItem('Authorization',rs.headers.authorization)
                window.location.replace(`${defaultConfig.hostname}/index.html`);
              }else {
                this.$message.error('登录失败:'+rs.data.message)
              }
            })
          }else {
            AuthorService.registerUser(this.registerForm).then(rs=>{
              if (rs.data.status === 200){
                sessionStorage.setItem('Authorization',rs.headers.authorization)
                this.$message.success('注册成功')
                let timer=setTimeout(()=>{
                  window.location.replace(`${defaultConfig.hostname}/login.html`);
                  clearTimeout(timer)
                },1000)

              }else {
                this.$message.error('注册失败:'+rs.data.message)
              }
            })
          }
        }else {
          this.$message.error('验证失败')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields() //重置表单元素字段
    },
    handleAvatarSuccess(rs) {
      // console.log('头像上传成功', rs.data.imgList[0])
      this.registerForm.avatar = rs.data.imgList[0]
    }
  }
}
</script>

<style>
  #bg{
    z-index: -1;
  }
  .form{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  }
  .login-wrapper, .register-wrapper {
    width: 80%;
    margin: auto;
    opacity: 0.8;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #cfd4db;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }

  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
  .label .el-form-item__label{
    color: #6d9ac8;
  }
  .bg-img{
    position: fixed;
    z-index: -1;
    /*background-image: url("./assets/1.png");*/
    height: 100%;
    width: 100%;
    opacity: 0.3;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
</style>
