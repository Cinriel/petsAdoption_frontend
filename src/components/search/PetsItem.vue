<template>
  <div class="column">

    <el-row>
      <router-link :to="'/detail/'+id">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img :src="img_url" class="image" style="height:30rem">
          <div style="padding: 14px;">
            <div class='desc'>
              <el-tag type="danger" class="left_display">{{variety}}</el-tag>
            </div>
            <span class="title" v-html="title"></span>
            <div class="bottom clearfix">
              <el-button type="text" class="button" v-on:click.stop="addOrders(id, $event)">添加宠物单</el-button>
            </div>
          </div>
        </el-card>
      </router-link>
    </el-row>
  </div>

</template>

<script>
export default {
  props:['img_url','title','owner','variety','id'],
  data(){
    return{
      value:4,
    }
  },
  computed:{
    titleDisp(){
      return this.title.replace("<span style='color:red'>",'').replace('</span>','')
    }
  },
  methods:{
    addOrders(id, event){
      event.preventDefault()
      this.$axios.get(`/api/wishList/add?petId=${id}&selectNumber=1`).then(res=>{
        if(res.data.flag){
          this.$message.success("添加成功")
        }
      })
      event.stopPropagation();
    }
  },
  
}
</script>

<style>

.left_display{
  text-align:left
}

desc{
  flex-direction: row;
}

.cat_desc{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-align: left;
}

.title{
  width: 22rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #606B7C;
  display: inline-block;
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