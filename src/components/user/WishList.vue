<template>
  <div>
    <el-container>
      <el-header>
        <h2 style="color: #ffbd59">我的心愿单</h2>
      </el-header>
      <el-main>
        <el-empty description="暂时还没有内容╥﹏╥..." v-if='!wishList.length' ></el-empty>
        <!-- 具体内容 -->
        <div v-if='wishList.length'>
          <el-row>
            <el-col :span="8" v-for="wishItem in wishList" :key="wishItem.id">
              <el-card :body-style="{ padding: '0px' }">
                <img :src="wishItem.extendField.petsDetail.image" class="image" @click="gotoDetailPage(wishItem.petId)">
                <div style="padding: 14px;">
                  <span @click="gotoDetailPage(wishItem.petId)">{{wishItem.extendField.petsDetail.title}}</span>
                  <div class="bottom clearfix">
                    <time class="time">{{ wishItem.selectDate }}</time>
                    <el-button type="text" class="button" @click="adoptPet({wishListId:wishItem.id,petId:wishItem.petId})">领养</el-button>
                    <el-button type="text" class="button" @click="deleteWishListItem(wishItem.id)">删除</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

      </el-main>
      <el-pagination
        v-if="wishList.length"
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        :page-size='10'
        layout="prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </el-container>


    
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name:"WishList",
  data(){
    return{
      wishList:[],
      page:{
        currentPage:1,
        total:0,
      },
    }
  },
  methods:{
    ...mapActions('globalOptions',['loadingStatus']),
    handleCurrentChange(){
      this.search()
    },
    search(){
      this.loadingStatus(true)
      this.$axios.get(`/api/wishList/query/${this.page.currentPage}/9`).then(res=>{
        this.loadingStatus(false)
        let wishListData = res.data.data.records
        console.log(res);
        if(wishListData.length != 0){
          this.wishList = wishListData
          this.page.total = res.data.data.total
          this.page.currentPage = res.data.data.current
        }
      }).catch(err=>{
        this.loadingStatus(false)
        this.$message.error("服务器出错，请稍后再试",err);
      })
    },
    gotoDetailPage(petId){
      this.$router.push("/detail/"+petId);
    },
    adoptPet(data){
      console.log(data);
      this.$router.push({name:"createOrder",params:data})
    },
    deleteWishListItem(wishListId){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingStatus(true)
        this.$axios.delete("/api/wishList/delete/"+wishListId).then(res=>{
          this.loadingStatus(false)
          if(res.data.flag){
            this.$message.success(res.data.message)
            this.search()
          }else{
            this.$message.error("删除失败，请稍后再试")
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
  },
  mounted(){
    this.search()
  }
}
</script>

<style >
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    height: 380px;
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>