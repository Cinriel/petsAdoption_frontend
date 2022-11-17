<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="handleChangeRouter('userCenter')">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span >个人中心</span>
            </template>
          </el-menu-item>

          <el-menu-item index="2" @click="handleChangeRouter('wishList')">
            <i class="el-icon-shopping-cart-full"></i>
            <span slot="title">心愿单</span>
          </el-menu-item>

          <el-menu-item index="3" @click="handleChangeRouter('myAdoptedPets')">
            <i class="el-icon-house"></i>
            <span slot="title">已领养宠物</span>
          </el-menu-item>

          <el-menu-item index="4" @click="handleChangeRouter('baseInfo')">
            <i class="el-icon-document"></i>
            <span slot="title">发布宠物</span>
          </el-menu-item>

          <el-menu-item index="5" @click="handleChangeRouter('managePets')">
            <i class="el-icon-edit"></i>
            <span slot="title">宠物管理</span>
          </el-menu-item>
          <el-menu-item index="6" @click="handleChangeRouter('index')">
            <i class="el-icon-bicycle"></i>
            <span slot="title">继续浏览</span>
          </el-menu-item>
        </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
  </div>
</template>

<script>
export default {
  name:"IndexInterface",
  data() {
      return {
        isCollapse: true
      };
    },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleChangeRouter(path){
        this.$router.push({name: path, query:{a:123}})
      }
  },
  mounted(){
    // this.$router.push({path: "userCenter", query:{a:123}})
  }
}
</script>

<style>
  /* .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  } */
  .el-aside {
    color: #333;
  }
</style>