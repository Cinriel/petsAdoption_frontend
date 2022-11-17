<template>
  <div class='view' v-loading="isLoading">
    <el-container >
      <PageHeader/>
      <el-main>
        
        <br>
        <!-- 搜索条件 -->
        <ConditionBox/>
        <br>
        <!-- 浏览界面 -->
        <PetsView/>
      </el-main>

      <el-footer>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="current"
            :hide-on-single-page="true"
            :page-size="20"
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
    <el-backtop target=".view" :visibility-height='100'></el-backtop>
  </div>
</template>

<script>
import PageHeader from '../PageHeader.vue'
import PetsView from './PetsView.vue'
import ConditionBox from './ConditionBox.vue'
import {mapState, mapActions} from 'vuex'
export default {
  name: "PetIndex",
  components:{
    PetsView,
    ConditionBox,
    PageHeader
  },
  data() {
    return{

    }
  },
  computed:{
    ...mapState('PetsOption',['total','isLoading']),
    current:{
      get(){
        return this.$store.state.PetsOption.current
      },
      set(){
        // 不需要
      }
    }
  },

  methods:{
    ...mapActions("PetsOption",{'search':"search"}),
    handleSizeChange(){
    },
    handleCurrentChange(current){
      this.search(["current",current])
    },
  },
  mounted(){
    let keyword = this.$route.params.keyword
    // 发请求获取数据
    if(!keyword) this.search() // 携带参数（keyword）时说明从其他地方来到
  },
}
</script>

<style scoped>
  .el-header {
    background-color: #fff4e7;
    color: #333;
    line-height: 30px;
    height: 30px;
    display: flex;
    flex-direction: row;
  }
  
  .el-aside {
    color: #333;
  }

  .img{
    width: 100px;
    height: 100px;
  }

  
  .el-container{
      height: 800px;
  }

  .top-item{
    margin-left: 10px;
    list-style: none;
    width: 40px;
  }
  li{
    list-style: none;
  }
  .spacer{
    width: 1px;
    height: 12px;
    margin-top: 9px;
    padding: 0;
    background: #ccc;
    overflow: hidden;
    margin-left: 10px;
    margin-right: 10px;
  }
  .fr{
    flex: 1;
    display: flex;
    justify-content: right;
    margin: 0;

  }
  .fl{
    margin: 0;
  }

  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .input-with-select:focus{
    border: bisque;
  }
  

  
</style>