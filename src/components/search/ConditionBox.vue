<template>
  <div>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input 
        placeholder="请输入内容" 
        v-model="searchKeyword" 
        class="input-with-select" 
        style="width:40%"
        @keyup.native.enter='search(["keyword",searchKeyword])'
      >
        <el-button slot="append" icon="el-icon-search" v-on:click="search(['keyword',searchKeyword])" ></el-button>
      </el-input>
    </div>

    <!-- 已选的条件 -->
    <div class="selected_condition">
      <span> <router-link to="/">首页</router-link> >{{selectedCondtionList.kinds || '猫猫'}}></span>
      <el-tag
        size="mini"
        v-for="(value,key) in selectedCondtionList"
        :key="key"
        @close="removeSearchCondition(key)"
        closable
        type="warning">
        {{value}}
      </el-tag>
    </div>
    
    <div class="selected_condition">
      <!-- 品种  -->
      <el-row style="margin:0" v-show="searchConditionList.category.length>0 && !selectedCondtionList.category">  <!-- 没有种类时展示 -->
        <el-col :span="2"  style="background-color: aliceblue;" >
          <p class="selected-condition-key">品种</p>
        </el-col>
        <el-col :span="20" >
          <p v-for="value in searchConditionList.category" :key="value.index" class="selected-condition-value">
            <a 
              href="javascript:void(0)" 
              @click="search(['category',value])"
            > {{value}} </a>
          </p>
        </el-col>  
      </el-row>
    
      <!-- 体重 -->
      
      <el-row style="margin:0" v-show="searchConditionList.weight && !selectedCondtionList.weight">  <!-- 没有体重时展示 -->
        <el-col :span="2"  style="background-color: aliceblue;">
          <p class="selected-condition-key">体重</p>
        </el-col>
        <el-col :span="20" >
          <p v-for="value in searchConditionList.weight" :key="value.index" class="selected-condition-value">
            <a 
              href="javascript:void(0)" 
              @click="search(['weight',value])"
            > {{value}} </a>
          </p>
        </el-col>  
      </el-row>

      <!-- 身高 -->
      <el-row style="margin:0" v-show="searchConditionList.height && !selectedCondtionList.height">
        <el-col :span="2"  style="background-color: aliceblue;">
          <p class="selected-condition-key">身高</p>
        </el-col>
        <el-col :span="20">
          <p v-for="value in searchConditionList.height" :key="value.index" class="selected-condition-value">
            <a href="javascript:void(0)" @click="search(['height',value])"> {{value}} </a>
          </p>
        </el-col>  
      </el-row>
      <!-- detailInfo -->
      <el-row style="margin:0" v-for='(val,key) in searchConditionList.detailInfo' :key="key">
        <el-col :span="2"  style="background-color: aliceblue;">
          <p class="selected-condition-key">{{key}}</p>
        </el-col>
        <el-col :span="20">
          <p v-for="value in val" :key="value.index" class="selected-condition-value">
            <a href="javascript:void(0)" @click="search([`condition_${key}`,value])"> {{value}} </a>
          </p>
        </el-col>  
      </el-row>
    </div>
    
  </div>
</template>

<script>
import {mapState, mapActions} from "vuex"
export default {
  name:"ConditionBox",
  data(){
    return{
      searchKeyword:''
    }
  },
  computed:{
    ...mapState('PetsOption',['searchConditionList','selectedCondtionList','petsData']),
    detailInfo(){
      // 判断符合条件的增加进数组
      return 0;
    }
  },
  methods:{
    ...mapActions('PetsOption',['search','removeSearchCondition']),
  },
  mounted(){
    
  }
}
</script>

<style scoped>
.selected-condition-value{
  display: inline-block;

  margin: 1rem 2rem 0 1rem;
}


.selected_condition{
  text-align: left;
}

.el-row>div{
  height: 4rem;
  overflow: hidden;
  flex-wrap: nowrap;
}
.selected_condition>.el-row{
  border: 1px solid rgb(255, 211, -67);
  border-bottom-width: 0px;
}
.selected_condition .el-row a{
  text-decoration: none;
  color: #005aa0;
}

.selected_condition>.el-row:nth-child(n+2){
  border-bottom-width: 0px;
  /* border-button-width: 0px; */
}
.selected_condition>.el-row:last-child{
  border-bottom-width: 1px;
}

.selected-condition-key{
  font-weight: bold;
  margin-left: 1rem;
  color: #474747;
  margin-top: 1rem;
}

.el-tag{
  margin-left: 5px;
  margin-bottom: 5px;
}

.search_table{
  display: flex;
  flex-direction: column;

}

.search_content>ul>li{
  padding-right: 10rem;
  display: inline-block;
}


.search_item{
  border-style:solid;
  border-color:bisque;
  border-width:1px;
  text-align: left;
  
}
.search_item>div{
  padding: 1rem 1rem 0rem 1rem;
  display: inline-block;
  text-align: left;
}
.search_index{
  width: 10rem;
  height: 40px;
  float: left;
  margin:0 0 -1 -1;
  padding-bottom: 10px;
  border-right-color: bisque;
  border-right-width: 2px;
  border-right-style: solid;
}
</style>