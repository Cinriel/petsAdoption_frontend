<template>
<!-- 标头 -->
  <el-header style="text-align: right; font-size: 12px; height:30px; ">
    <ul class="fl">
      <router-link to="/" >首页</router-link> &nbsp;
      <span class="el-icon-location-information"></span>
      <span>{{location}}</span>
    </ul>
    <ul class="fr">
      <li v-if="!username">
        <router-link :to="{path:'/login'}">你好，请登录</router-link>
        <a href="http://localhost:8001/api/oauth/toRegister" class="top-item">免费注册</a>
      </li>
      <li v-if="username">
        <router-link :to="{name:'userCenter'}">欢迎:{{username}}</router-link>
      </li>
      <li class="spacer"></li>
      <li>
        <router-link :to="{name:'wishList'}">我的心愿单</router-link>
      </li>
    </ul>
  </el-header>
</template>

<script>
import {getCookie} from '../utils/index'
import axios from 'axios'

export default {
  name:"PageHeader",
  data(){
    return {
      username:"",
      location:"",
    }
  },
  mounted(){
    let uid = getCookie("uid")
    if(uid){
      console.log(uid);
      axios.get("http://localhost:8001/api/user/getUsername").then(res=>{
        console.log(res.data);
        this.username = res.data.data
      })
    }else{
      this.username ='';
    }
    // 获取位置
    this.getLocaltion()
  },
  methods:{
    getLocaltion(){
      fetch('https://restapi.amap.com/v3/ip?key=0e9a34009d1a70bd97993c42be0e05b9')
      .then(res=>{
        return res.json();
      }).then(res=>{
        this.location = res.city
      })
    },
  }
}
</script>

<style scoped>
  .el-header {
    background-color: #fff4e7;
    color: #333;
    line-height: 30px;
    height: 30px;
    display: flex;
    flex-direction: row;
  }
  
  .el-aside {
    color: #333;
  }

  .img{
    width: 100px;
    height: 100px;
  }

  
  .el-container{
      height: 800px;
  }

  .top-item{
    margin-left: 10px;
    list-style: none;
    width: 40px;
  }
  li{
    list-style: none;
  }
  .spacer{
    width: 1px;
    height: 12px;
    margin-top: 9px;
    padding: 0;
    background: #ccc;
    overflow: hidden;
    margin-left: 10px;
    margin-right: 10px;
  }
  .fr{
    flex: 1;
    display: flex;
    justify-content: right;
    margin: 0;

  }
  .fl{
    margin: 0;
  }

  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .input-with-select:focus{
    border: bisque;
  }
  

  

</style>