<template>
  <div>
    <el-form  label-width="100px">
      <PreviewPage
        :title="petsForm.title"
        :catDesc='petsForm.catDesc'
        :number='petsForm.number'
        :height='petsForm.height'
        :weight="petsForm.weight"
        :money="petsForm.money"
        :freight="petsForm.freight"
        :detailInfo="petsForm.detailInfo"
        :kinds="petsForm.kinds"
        :category="petsForm.category"
        :image='petsForm.images[0]'
      />
      <el-form-item>
        <el-button style="margin-top: 12px;" @click="prev">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="next('detailPetsForm')">下一步</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import {mapState,} from 'vuex'
import PreviewPage from './PreviewPage.vue'
export default {
  name:'AllInfo',
  components:{PreviewPage},
  data(){
    return {
      petsForm:[],
    }
  },
  activated(){
    this.petsForm = this.$store.state.PostPetsOptions.PetsForm
  },

  computed:{
    ...mapState('PostPetsOptions',['PetsForm'])
  },
  methods:{
    next() {
      // 所有信息填完确认提交
      this.$confirm('确定上传后数据将不再改变，确定上传吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.uploadFormData(this.PetsForm)

      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消上传'
        });        
        console.log(err);  
      });
    },
    prev(){
      this.$store.state.PostPetsOptions.active--;
      this.$router.push({name:'detailInfo'})
    },
    uploadFormData(PetsForm){
      // let statePetsForm_back = PetsForm
      // 整合ruleForm与detailPetsForm后上传
      PetsForm['detailInfo'] = JSON.stringify(PetsForm.detailInfo)
      PetsForm['image'] = PetsForm.images[0] // 第一张图片作为封面
      PetsForm['images'] = PetsForm.images.join()
      console.log("上传表单进入服务端",PetsForm);

      this.$axios.post('./api/petDetail/postPets',PetsForm).then(res=>{
        this.$store.state.PostPetsOptions.active = 0
        // this.$store.dispatch("PostPetsOptions/clearPetsForm")  清数据
        console.log(res);
        this.$message({
          type: 'success',
          message: '上传成功!'
        });
        // 跳转第一页
        this.$router.push({name:'baseInfo',params:true})
      }).catch(err=>{
        console.log(err);
        // this.$store.state.PostPetsOptions.PetsForm = statePetsForm_back
      })
    },
  }
}
</script>

<style>

</style>