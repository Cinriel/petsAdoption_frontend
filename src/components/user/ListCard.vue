<template>
  <el-row>
    <el-col :span='4' class="imgDisp">
      <el-image
        style="width: 150px; height: 150px;margin-top:3px"
        :src="imgUrl"
        fit="cover">
      </el-image>
    </el-col>
    <el-col :span='20' class="introduce">
      <p>id:{{id}}</p>
      <p>{{title}}</p>
      <p>操作时间：{{operateDateFormatted}}</p>
      <el-input-number 
        size="mini" 
        v-model="petsNumber" 
        @change='checkValidate'
      ></el-input-number>
    </el-col>
    <el-backtop>
    </el-backtop>
  </el-row>
</template>

<script>
export default {
  name:"ListCard",
  props:['imgUrl',"title","variety","operateDate","number","id"],
  data(){
    return {
      petsNumber:this.number,
      previewSrcList:[this.imgUrl],
      operateDateFormatted: ''
    }
  },
  methods:{
    checkValidate(newValue, oldValue){
      if(newValue<0) {
        this.$message.error("数值不允许小于 0")
        this.selectNum = oldValue
        return
      }else{
        this.selectNum = newValue;

      }
      console.log(this.selectNum);
      this.$axios.post("/api/wishList/update",{
        'id': this.orderId,
        "selectNumber": this.selectNum
      }).then(res=>{
        if(res.data.flag){
          this.$message.success("修改成功")
        }
        else{
          this.$message.error("服务器繁忙，请稍后再试")
        }
        console.log(res.data);
      }).catch(error=>{
        this.$message.error("出错了",error)
      })
      // 发请求给后端
    },
    formatDate(dateOutside){
      let date = new Date(dateOutside)
       this.operateDateFormatted = date.toLocaleDateString()+' '+date.toLocaleTimeString()
      // return date.getFullYear() + "-"+ date.getMonth()+'-'+date.getDay() +' ' +date.getHours()+':'+date.getMinutes()+":"+date.getSeconds()
    },
  },
  mounted(){
    this.formatDate(this.operateDate)   
  },
  watch:{
    operateDate(){
      this.formatDate(this.operateDate)   
    }
  }
}

</script>

<style scoped>
.el-row{
  margin-bottom: 15px;
  border-style: solid;
  border-radius: 10px;
  border-width: 2px;
  border-color: #ffeb3b;
}

.imgDisp{
  text-align: center;
}
.introduce{
  text-align: left;
}
.el-backtop{
 box-shadow: 0 0 3px rgb(0 0 0 / 12%);
}


</style>