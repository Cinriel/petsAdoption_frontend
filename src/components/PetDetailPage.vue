<template>
<div>
  <PageHeader/>
  <div class="detail-page-background">
    <!-- 
      宠物详情页

      需要的内容 
      id:宠物id路由传参

      img->封面图片
      title->标题
      owner->主人
      kind->种类
      number->剩余数量
      category->品种
      desc->详细介绍
      price->领养费用
      images->套图
      post_time->上传时间
      freight->运费
      height->高
      weight->低
      detail_info->详细信息
      address->发布地址
    -->
    <div class="detail-page ">
      <el-row class="page-title">
        <span class="page-title-text">宠物详情</span>
      </el-row>
      <!-- 面包屑 -->
      <el-row style="margin-bottom:20px">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{pet_detail.kinds}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{pet_detail.category}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{pet_detail.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 封面图片 -->
          <img :src="pet_detail.image" alt="" class="cover-img">
        </el-col>

        <el-col :span="16" class="base-info">
          <!-- 标题 -->
          <span class="title">{{pet_detail.title}}</span>
          <el-form label-width="80px" label-position='left' size='mini'>
            <el-form-item label="发布时间" >
              {{pet_detail.postTime | formatDate}}
            </el-form-item>
            <el-form-item label="剩余数量">
              {{pet_detail.number}}只
            </el-form-item>
            <el-form-item label="身高">
              {{pet_detail.height}}cm
            </el-form-item>
            <el-form-item label="体重">
              {{pet_detail.weight}}kg
            </el-form-item>
            <el-form-item label="领养费">
              ￥{{pet_detail.money}}元
            </el-form-item>
            <el-form-item label="运费">
              ￥{{pet_detail.freight}}元
            </el-form-item>
            <el-button @click="order" icon="el-icon-receiving" type="success" plain> 领养</el-button>
            <el-button @click="addWishList" icon="el-icon-shopping-cart-2" type="warning" plain> 加入心愿单</el-button>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="border">
        <el-descriptions class="descriptions" title="详细列表" :column="3" size="medium" border>
          <!-- 种类 -->
          <el-descriptions-item label-class-name="my-label">
            <template slot="label">
              <i class="el-icon-place"></i>
              <strong>种类</strong>
            </template>
            {{pet_detail['kinds']}}
          </el-descriptions-item >
          <!-- 品种 -->
          <el-descriptions-item label-class-name="my-label">
              <template slot="label">
                <i class="el-icon-place"></i>
                <strong>品种</strong>
              </template>
              {{pet_detail['category']}}
          </el-descriptions-item>
          <el-descriptions-item 
            v-for="(value,key) in pet_detail['detailInfo']" 
            :key="key" 
            label-class-name="my-label"
            >
             <template slot="label">
              <i class="el-icon-place"></i>
              <strong>{{key}}</strong>
            </template>
            {{value}}
          </el-descriptions-item>
        </el-descriptions>
      </el-row>
      <!-- <el-row class="border">
        <img src="" alt="" v-for="image in pet_detail['images']" :key="image.index">
      </el-row> -->
      <el-row class="align-left padding">
        <strong>详细介绍</strong>
        <p class="desc">
          {{pet_detail['catDesc']}}
        </p>
      </el-row>
    </div>
  </div>
</div>  
</template>

<script>
import axios from 'axios'
import PageHeader from './PageHeader.vue'
import {mapActions} from 'vuex'

export default {
  name:"PetDetailPage",
  components:{
    PageHeader
  },
  data(){
    return{
      id:'id',
      logo_url: require('../../public/img/wblogo.png'),
      pet_detail:{},
    }
  },
  methods:{
    ...mapActions('globalOptions',['loadingStatus']),

    async getPetsInfo(){
      this.loadingStatus(true)
      let res = await axios.get("/api/petDetail/getById?id="+this.id)
      this.loadingStatus(false)
      this.pet_detail = res.data.data[0]
      this.pet_detail['detailInfo'] = JSON.parse(this.pet_detail['detailInfo']) 
      let pets_category_id = this.pet_detail['petsId']
      let cate_res = await axios.get("/api/pets/getPetsById?id="+pets_category_id)
      this.$set(this.pet_detail,'category',cate_res.data.data['category'])
      this.$set(this.pet_detail,'kinds',cate_res.data.data['kinds'])
      console.log(this.pet_detail);
      // this.pet_detail['category'] = cate_res.data
    },
    // 添加心愿单
    addWishList(){
      this.loadingStatus(true)
      this.$axios.get(`/api/wishList/add?petId=${this.id}&selectNumber=1`).then(res=>{
        this.loadingStatus(false)
        if(res.data.flag){
          this.$message.success(res.data.message);
        }else{
          this.$message.error(res.data.message)
        }
      }).catch(()=>{
        this.$message.error("系统出错，请稍后再试")
        this.loadingStatus(true)
      })
    },
    // 领养
    order(){
      this.$router.push({name:'createOrder',params:{petId:this.id}})
    }
  },
  filters:{
    formatDate(value){
      value = new Date(value)
      return value.getFullYear()+ "-" + (value.getMonth()+1) + "-" + value.getDate()
    }
  },
  mounted(){
    let id = this.$route.params.id
    if(id){
      this.id=id;
      document.title = "详情页面"
      // 后端获取
      this.getPetsInfo()
    }else{
      // 没有id表示在发布宠物时 `实时预览`，vuex获取

    }
  }
}
</script>

<style scoped>
.detail-page-background{
  background-color: rgb(253 250 250);
  min-height: 100vh;
}

.page-title{
  height: 70px;
  background-color: rgb(255 219 88);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.cover-img{
  width: 300px;
  border-radius: 30px;
}

.detail-page{
  background-color: white;
  margin-left: 100px;
  margin-right: 100px;
  box-shadow: 0px 1px 5px 0px rgb(0 0 0 / 50%);
  /* height: 100vh; */
}
.base-info{
  text-align: left;
}
.title{
  font-size: 25px;
  max-width: 800px;
  width: fit-content;
}
.el-form :deep() .el-form-item{
  margin-bottom: 0px;
  height: 40px;
  margin-left: 0px;
  text-align: left;
}
.descriptions :deep() .my-label{
  background-color: rgb(226 242 255);;
  font-size: 300;
  width: 100px;
}
.border{
  padding: 20px;
}

.el-form >>> .el-button--primary{
  background-color: #ffc800;
  color: white;
  border-color: #ffc800;
}
.align-left{
  text-align: left;
}

.padding{
  padding: 20px;
}

.logo{
  height: 80px;
  margin-top: -5px;
}
.page-title-text{
  font-size: 30px;
  line-height: 70px;
}
</style>