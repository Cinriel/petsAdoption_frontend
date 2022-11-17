<template>
  <div>
    <h2 style="color: #ffbd59">我的宠物</h2>
    <el-empty description="暂时还没有内容╥﹏╥..." v-if='!userPets.length' ></el-empty>
    <div v-if="userPets.length">
      <ListCard 
        v-for="pets in userPets" 
        :key="pets.index"
        :id="pets.id"
        :number='pets.number'
        :imgUrl="pets.image"
        :title='pets.title'
        :variety='pets.variety'
        :operateDate='pets.postTime'
        @click.native="openDialog(pets)"
      />
    </div>
    
<!-- 内容框 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model.number="form.number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        
        <el-popconfirm
          title="确定删除吗？"
          @confirm='deletePet'
        >
          <el-button slot="reference">删除</el-button>
        </el-popconfirm>

        <!-- 下架按钮 todo -->

        <el-button type="primary" @click="updatePet">确 定</el-button>
      </div>
    </el-dialog>

    <el-pagination
      v-if="userPets.length"
      @current-change="handleCurrentChange"
      :current-page.sync="page.currentPage"
      :page-size='10'
      layout="prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
import ListCard from '../user/ListCard.vue'
import {mapActions} from 'vuex'

export default {
  name:"ManagePets",
  components:{
    ListCard
  },
  data(){
    return{
      page:{
        total: 0,
        currentPage:0
      },
      userPets:[],
      dialogFormVisible: false,
      form:{
        id:'',
        title: '12312',
        number: 123
      },
      formLabelWidth: '120px'
    }
  },

  mounted(){
    this.loadPage(1)
  },
  methods:{
    ...mapActions('globalOptions',['loadingStatus']),
    loadPage(currentPage){
      this.processUserPets(currentPage)
    },
    processUserPets(currentPage){
      this.loadingStatus(true)
      // 多接口完成一个功能
      this.$axios.get(`/api/petDetail/getUserPets/${currentPage}/10`).then(res=>{
        console.log(res);
        this.userPets = res.data.data.records
        this.page.total = res.data.data.total
        this.page.currentPage = res.data.data.current
        this.loadingStatus(false)
        
      }).catch(()=>{
        this.loadingStatus(false)
      })
    },
    handleCurrentChange(current){
      this.loadPage(current);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    deletePet(){
      this.$message.success("删除成功")
      this.dialogFormVisible = false
    },
    openDialog(pets){
      this.dialogFormVisible = true
      this.form.title = pets.title
      this.form.number = pets.number
      this.form.id = pets.id

    },
    updatePet(){
      this.$message.success(this.form.id)
      this.dialogFormVisible = false
    }
  },
  activated(){
    this.loadPage(this.page.currentPage)
  }

}
</script>

<style scoped>
.dialog-footer button{
  margin-left: 10px;
}
</style>