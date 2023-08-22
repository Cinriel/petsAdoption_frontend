<template>
<div class="container">
  <el-form 
    :model="userRegisterForm" 
    status-icon 
    :rules="rules" 
    ref="userRegisterForm" 
    label-width="100px" 
    class="demo-ruleForm"
    id='userRegisterForm'
    label-position='left'
    >
    <div class="title">注册</div>
    <!-- 用户名 -->
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userRegisterForm.username"></el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item label="密码" prop="password">
      <el-input type="password" show-password v-model="userRegisterForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="password2">
      <el-input type="password" show-password v-model="userRegisterForm.password2" autocomplete="off"></el-input>
    </el-form-item>
    <!-- 性别 -->
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="userRegisterForm.gender">
        <el-radio label="男"></el-radio>
        <el-radio label="女"></el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 邮箱 -->
    <el-form-item label="邮箱" prop="email">
      <el-input  v-model="userRegisterForm.email" autocomplete="off"></el-input>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item label="验证码" prop="captcha">
      <el-row  type="flex" justify="space-between">
        <el-col :span="15">
          <el-input 
            prop='captcha'
            placeholder="请输入验证码" 
            v-model="userRegisterForm.captcha" 
            prefix-icon="el-icon-user"
            required
            >
          </el-input>
        </el-col>
        <el-col :span="6">
          <img :src='captchaSrc' alt="出错了"  @click='getKaptcha'>
        </el-col>
      </el-row>
    </el-form-item>
    <!-- 提交/重置 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm('userRegisterForm')">提交</el-button>
      <el-button @click="resetForm('userRegisterForm')">重置</el-button>
      <el-button @click="toLoginPage">登录</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'
import {Base64} from 'js-base64'  // 检查 todo
export default {
  name:"UserRegister",
  data(){
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userRegisterForm.checkPassword !== '') {
          this.$refs.userRegisterForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value != this.userRegisterForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateUsername = (rule, value, callback)=>{
      axios.get("http://43.143.254.110:8001/api/user/existUsername?username="+value).then(res=>{
        if(res.data === 0){
          callback();
        }else{
          callback(new Error('用户名已存在'));
        }
      })
    };
    
    return{
      userRegisterForm:{
        username:'',
        password:'',
        password2:"",
        gender:'',
        email:"",
        captcha:"",
        uuid:"",
      },
      captchaSrc:'',
      // 校验规则
      rules: {
        // 用户名
        username:[
          {pattern: /^([\u4e00-\u9fa5]{2,4})|([a-zA-Z0-9_\u4e00-\u9fa5]{2,16})$/, message: '请输入2-16位用户名',trigger: 'change'},
          {required: true, message: '请输入用户名', trigger: 'blur' },
          {validator: validateUsername,trigger:"change"}
        ],
        // 密码
        password: [
          {required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        // 确认密码
        password2: [
          { validator: validatePassword2, trigger: 'blur' }
        ],
        // 性别
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        // 邮箱
        email:[
          {required: true, message: '请输入邮箱', trigger: 'blur' },
          {pattern: /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/, message:"请输入正确的邮箱账号", trigger:"change"}
        ],
        // 验证码
        captcha:[
          {required: true, message: '请输入验证码', trigger: 'blur' },
        ]

      }
    }
  },
  methods:{
    ...mapActions('globalOptions',['loadingStatus']),
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
      console.log("getKaptcha");
      this.captchaSrc = 'http://43.143.254.110:8001/api/oauth/kaptcha?uuid='+this.userRegisterForm.uuid+"&date="+new Date();
    },
    submitForm(formName) {
      this.loadingStatus(true)
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 验证成功，提交
          let data = this.userRegisterForm;
          delete data['password2']
          data.password = Base64.encode(this.userRegisterForm.password);
          let res = await axios.post('/api/oauth/register', data);
          this.loadingStatus(false)
          // 注册成功
          if(res.data.flag){
            this.$message.success(res.data.message);
            // 跳转登录界面
            if(this.from){
              this.$router.push(this.from)
            }else{
              this.$router.push('/')
            }
          // 注册/登陆失败
          }else{
            this.$message.error(res.data.message);
          }
        // 验证失败,取消提交
        } else {
          this.$message.error("请验证表单");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toLoginPage(){
      this.$router.push({"name":'login', params: { 'from': this.from }})
    }
  }, 
  mounted(){
    console.log(this.$route);
    this.from = this.$route.params.from
    this.userRegisterForm.uuid = this.generateUUID()
    this.getKaptcha()
  }
}
</script>

<style scoped>
  .container{
    width: 100%;
    height: 100vh;
    background-image: linear-gradient(to bottom right, rgb(114, 135, 254), rgb(130, 88, 186));
  }
  #userRegisterForm{
    padding: 20px;
    width: 600px;
    height: 600px;
    margin: 0 auto;
    margin-top: 5%;
    border-radius: 15px;
    box-shadow: 0 10px 50px 0px rbg(59, 45, 159);
    background-color: rgb(253, 253, 253);
    text-align: left;
  }
  .title{
    color: rgb(2, 2, 2);
    font-size: 30px;
    font-weight: 400;
    text-align: center;
  }
  #userRegisterForm .el-input__inner{
    border: 0;
    background: none;
    outline: none;
    display: block;
    width: 100%;
    padding: 5px 0;
    transition: .2s;
    border-bottom: 1px solid rgb(199, 191, 219);
  }
  
  
  /* * {
      padding: 0;
      margin: 0;
  }
  html {
      height: 100%;
  }

  
  .login-container {
      width: 600px;
      height: 315px;
      margin: 0 auto;
      margin-top: 10%;
      border-radius: 15px;
      box-shadow: 0 10px 50px 0px rbg(59, 45, 159);
      background-color: rgb(95, 76, 194);
  }
  .left-container {
      display: inline-block;
      width: 330px;
      height: 15.7rem; 
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      padding: 2rem;
      background-image: linear-gradient(to bottom right, rgb(118, 76, 163), rgb(92, 103, 211));

  }
  .title {
      color: #fff;
      font-size: 18px;
      font-weight: 200;
  }
  .title span {
      border-bottom: 3px solid rgb(237, 221, 22);
  }
  .input-container {
      padding: 10px 0;
  }
  input {
      border: 0;
      background: none;
      outline: none;
      color: #fff;
      margin: 20px 0;
      display: block;
      width: 100%;
      padding: 5px 0;
      transition: .2s;
      border-bottom: 1px solid rgb(199, 191, 219);
  }
  input:hover {
      border-bottom-color: #fff;
  }
  ::-webkit-input-placeholder {
      color: rgb(199, 191, 219);
  }
  .message-container {
      font-size: 14px;
      transition: .2s;
      color: rgb(199, 191, 219);
      cursor: pointer;
  }
  .message-container:hover {
      color: #fff;
  }
  .right-container {
      width: 145px;
      display: inline-block;
      height: calc(100% - 120px);
      vertical-align: top;
      padding: 60px 0;
  }
  .regist-container {
      text-align: center;
      color: #fff;
      font-size: 18px;
      font-weight: 200;
  }
  .regist-container span {
      border-bottom: 3px solid rgb(237, 221, 22);
  }
  .action-container {
      font-size: 10px;
      color: #fff;
      text-align: center;
      position: relative;
      top: 200px;
  }
  .action-container span {
      border: 1px solid rgb(237, 221, 22);
      padding: 10px;
      display: inline;
      line-height: 20px;
      border-radius: 20px;
      position: absolute;
      bottom: 10px;
      left: calc(72px - 20px);
      transition: .2s;
      cursor: pointer;
  }
  .action-container span:hover {
      background-color: rgb(237, 221, 22);
      color: rgb(95, 76, 194);
  }
  .displayInrow{
      display: flex;
      flex-direction: row;
  }
  .displayInrow>img{
      width: 9rem;
      height: 3rem;
  }
  .tip{
      color: red;
      font-size: 0.5rem;
      float: left
  } */
</style>