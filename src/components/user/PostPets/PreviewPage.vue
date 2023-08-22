<template>
  <div class="detail-page-background">
    <div class="detail-page ">
      <el-row class="page-title">
        <span class="page-title-text">宠物详情</span>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 封面图片 -->
          <img :src="image" alt="" class="cover-img">
        </el-col>

        <el-col :span="16" class="base-info">
          <!-- 标题 -->
          <span class="title">{{title}}</span>
          <el-form label-width="80px" label-position='left' size='mini'>
            <el-form-item label="发布时间" >
              {{postTime | formatDate}}
            </el-form-item>
            <el-form-item label="剩余数量">
              {{number}}只
            </el-form-item>
            <el-form-item label="身高">
              {{height}}cm
            </el-form-item>
            <el-form-item label="体重">
              {{weight}}kg
            </el-form-item>
            <el-form-item label="领养费">
              ￥{{money}}元
            </el-form-item>
            <el-form-item label="运费">
              ￥{{freight}}元
            </el-form-item>
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
            {{kinds}}
          </el-descriptions-item >
          <!-- 品种 -->
          <el-descriptions-item label-class-name="my-label">
              <template slot="label">
                <i class="el-icon-place"></i>
                <strong>品种</strong>
              </template>
              {{category}}
          </el-descriptions-item>
          
          <el-descriptions-item 
            v-for="(value,key) in detailInfo" 
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
          {{catDesc}}
        </p>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props:["title",'catDesc','number','height','weight','money','freight','kinds','category','detailInfo','image'],
  name:"PreviewPage",
  data(){
    return{
      id:'id',
      logo_url: require('../../../../public/img/wblogo.png'),
      pet_detail:{},
      postTime: new Date
    }
  },
  filters:{
    formatDate(value){
      value = new Date(value)
      return value.getFullYear()+ "-" + (value.getMonth()+1) + "-" + value.getDate()
    }
  },
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