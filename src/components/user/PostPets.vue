<template>
  <div>
    <el-container style="height: 94vh; border: 1px solid #eee">
      <el-main>
        <!-- 步骤条进行 -->
        <el-steps :active="active" align-center finish-status="success">
          <el-step title="步骤1" description="宠物基本信息" icon="el-icon-edit"></el-step>
          <el-step title="步骤2" description="详细特征" icon="el-icon-aim"></el-step>
          <el-step title="步骤3" description="确认表单" icon='el-icon-upload'></el-step>
        </el-steps>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
    
  </div>
</template>

<script>

export default {
  name:"PostPets",
  data() {
    return{

    }
  },
  computed:{
    active(){
      console.log(this.$store);  //this.$store
      return this.$store.state.PostPetsOptions.active
    }
  },
  methods: {
   
  },

  
}
</script>

<style>

</style>