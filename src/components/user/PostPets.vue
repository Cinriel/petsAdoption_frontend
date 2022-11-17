<template>
  <div>
    <!-- 步骤条进行 -->
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="步骤1" description="宠物基本信息" icon="el-icon-edit"></el-step>
      <el-step title="步骤2" description="详细特征" icon="el-icon-aim"></el-step>
      <el-step title="步骤3" description="确认表单" icon='el-icon-upload'></el-step>
    </el-steps>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
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
      return this.$store.state.active
    }
  },
  methods: {
   
  },

  
}
</script>

<style>

</style>