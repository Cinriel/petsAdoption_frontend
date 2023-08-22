<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">请登录</div>

      <el-form class="form-wrapper" ref="form" :model="userData" :rules='rules' label-width="80px" label-position='left'>
        <el-form-item label="用户名" prop="username">
          <el-input 
          placeholder="请输入用户名" 
          v-model="userData.username" 
          prefix-icon="el-icon-user"
          required
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
          prop='password'
          placeholder="请输入密码" 
          v-model="userData.password" 
          show-password prefix-icon="el-icon-unlock"
          required
          ></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <el-row>
            <el-col :span="14">
              <el-input 
                prop='captcha'
                placeholder="请输入验证码" 
                v-model="userData.captcha" 
                prefix-icon="el-icon-user"
                required>
              </el-input>
            </el-col>
            <el-col :span="10">
              <img :src='captchaSrc' alt="出错了"  @click='getKaptcha'>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 默认submit，会导致自动提交 -->
        <button class="btn" @click.prevent='login'>登录</button>
      </el-form>

        <div class="msg">
          没有账号?
          <router-link :to="{ name: 'register', params: { 'from': from }}">注册</router-link>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'
export default {
  name:"UserLogin",
  data(){
    return {
      userData:{
        username:"",				 //用户名
        password:"",				 //密码
        captcha:"",          //用户输入的验证码
      },
      rules:{
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        captcha:[
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ]
      },
      uuid:'',
      from:"",
      captchaSrc:'',			 //验证码图片地址 
    }
  },
  methods:{
    ...mapActions('globalOptions',['loadingStatus']),
    login(){
      this.loadingStatus(true)
      let data={
        'username':this.userData.username,
        'password': window.btoa(this.userData.password),
        'uuid': this.uuid,
        'code': this.userData.captcha
      }
      axios.post('http://192.168.124.71:8001/api/oauth/login', data).then(res=>{
        this.loadingStatus(false)
        if(res.data.flag){
          this.$message.success(res.data.message)
          if(this.from){
            this.$router.push(this.from)
          }else{
            this.$router.push('/')
          }
        }else{
          this.$message.error(res.data.message)
        }
      })
      // this.message = res.data.message
    },
    generateUUID() {
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
          d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    },
    getKaptcha(){
      this.captchaSrc = 'http://192.168.124.71:8001/api/oauth/kaptcha?uuid='+this.uuid+"&date="+new Date();
    }
  },
  mounted(){
    this.from = this.$route.params.from
    this.uuid = this.generateUUID()
    this.getKaptcha()
  }
}
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  html {
    height: 100%;
  }
  body {
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100vh;
    background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
  }
  .login-wrapper {
    background-color: #fff;
    width: 450px;
    height: 588px;
    border-radius: 15px;
    padding: 0 50px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .header {
    font-size: 38px;
    font-weight: bold;
    text-align: center;
    line-height: 200px;
  }
  .input-item {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    border: 0;
    padding: 10px;
    border-bottom: 1px solid rgb(128, 125, 125);
    font-size: 15px;
    outline: none;
  }
  .input-item:placeholder {
    text-transform: uppercase;
  }
  .btn {
    text-align: center;
    padding: 10px;
    width: 100%;
    margin-top: 40px;
    background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
    color: #fff;
    border: none;
  }
  .msg {
    text-align: center;
    line-height: 88px;
  }
  a {
    text-decoration-line: none;
    color: #abc1ee;
  }
  #tip{
    font-size: 0.5rem;
    color: red;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
</style>