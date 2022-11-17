<template>
  <div class="index-contain">
    <PageHeader/>
    <el-scrollbar 
      style="height:100vh;" 
      :wrapStyle="[{'overflow-x':'hidden'}]"
      >
      <div class="header">
        <el-row :gutter="5">
          <el-col :span="4">
            <img :src="imgSrc" alt="" class='logo'>
          </el-col>
          <el-col :span="16" class="input-margin">
            <el-input 
              placeholder="请输入内容" 
              v-model="searchKeyword" 
              class="input-with-select" 
              @keyup.native.enter='gotoSearchPage'
            >
              <el-button slot="append" icon="el-icon-search" v-on:click="search(['keyword',searchKeyword])" ></el-button>
            </el-input>
            <div class="hotwords">
              
            </div>
          </el-col>
          <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
      </div>


      <div class="choice">
        <el-row :gutter="20">
          <!-- 种类菜单 -->
          <el-col class="choice-item-list-container" :span="3" ref='cascaderRef'>
            <el-cascader-panel
              id="cascader-paner-my"
              @change="changes"
              @expand-change="openPanel"
              :props="props"
              ></el-cascader-panel>
          </el-col>

          <el-col :span="18">
            <el-carousel :interval="3000" arrow="hover">
              <el-carousel-item v-for="item in ad_list" :key="item.id">
                <a :href="item.link" target="_blank">
                  <img :src="item.imgUrl" alt="出错了" style="height:300px">
                </a>
              </el-carousel-item>
            </el-carousel>
          </el-col>

        </el-row>          
      </div>

      <!-- 猜你喜欢标题 -->
      <div class="recommend_title">
        <span class="guess_like">
          <svg t="1666336327671" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1964" width="30" height="30">
            <path d="M512.003708 511.996332" p-id="1965"></path>
            <path d="M512.018459 0C229.227429 0 0 229.234805 0 512.011084c0 282.754151 229.227429 511.988956 512.018459 511.988956 282.768903 0 511.996332-229.227429 511.996332-511.988956C1024.014791 229.234805 794.787362 0 512.018459 0zM512.018459 999.025328c-268.990769 0-487.036372-218.052979-487.036372-487.021621s218.052979-487.028996 487.036372-487.028996c268.983393 0 487.028996 218.052979 487.028996 487.028996S781.001853 999.025328 512.018459 999.025328z" p-id="1966"></path>
            <path d="M751.645872 315.628424c-29.842788-29.547753-69.628256-44.439644-109.244078-44.439644-37.292422 0-74.385695 13.217567-102.782812 39.881354-11.941541 10.24509-20.600818 18.225786-27.652154 18.225786-7.523392 0-14.154303-7.50864-27.578395-18.225786-30.373851-26.811304-67.452373-40.036247-104.19898-40.036247-39.165894 0-77.93349 15.009905-107.805782 44.587162-60.076498 59.456925-60.076498 161.118604 0 220.575528l216.754825 209.519092c4.322262 4.322262 14.110048 7.235733 23.956841 7.235733 8.312611 0 16.654725-2.087372 21.773582-7.213605l216.776953-209.548596C811.685491 476.739651 811.685491 375.070597 751.645872 315.628424L751.645872 315.628424zM734.430581 518.413343 518.059301 727.563641c-0.730212 0.258156-2.397159 0.641701-4.993467 0.641701-3.496165 0-6.387507-0.730212-7.729917-1.224395l-215.559934-208.368456c-23.971592-23.720813-37.720222-57.502318-37.720222-92.699991 0-35.205049 13.74863-68.993931 37.734974-92.714743 24.362514-24.133862 56.454944-37.425187 90.376591-37.425187 31.915409 0 63.115359 12.0153 87.831914 33.833137l0.46468 0.420425 0.486808 0.390921c2.965102 2.36028 5.576161 4.573042 7.943817 6.549777 10.429487 8.769915 20.283655 17.060398 35.064908 17.060398 15.695861 0 27.475133-10.141828 41.105749-21.898972l2.655315-2.301273 0.420425-0.354042 0.413049-0.383545c22.776701-21.390036 53.275942-33.18406 85.847804-33.18406 34.423207 0 67.887549 13.586361 91.814886 37.285046 23.964216 23.713437 37.698095 57.502318 37.698095 92.699991S758.188273 494.891679 734.430581 518.413343L734.430581 518.413343zM382.453847 330.859605c-14.655863-1.681699-44.498651 3.739568-66.486133 25.734426-17.761106 17.702099-28.581514 43.377518-28.972435 68.69152-0.095886 6.83006 5.362261 12.457852 12.192321 12.553738l0.191773 0c6.741549 0 12.266079-5.421268 12.376717-12.184945 0.280283-19.015005 8.401121-38.288165 21.692447-51.564739 16.10891-16.116286 38.435682-19.538692 46.121344-18.653587 6.741549 0.833474 12.937284-4.071483 13.726503-10.857287C394.092977 337.807678 389.232276 331.656199 382.453847 330.859605L382.453847 330.859605zM382.453847 330.859605" p-id="1967"></path>
          </svg>
        </span>

        <h3>  <span>&nbsp;&nbsp;猜你喜欢&nbsp;&nbsp;</span>  </h3>
        <span class="guess_like">
          <svg t="1666336327671" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1964" width="30" height="30">
            <path d="M512.003708 511.996332" p-id="1965"></path>
            <path d="M512.018459 0C229.227429 0 0 229.234805 0 512.011084c0 282.754151 229.227429 511.988956 512.018459 511.988956 282.768903 0 511.996332-229.227429 511.996332-511.988956C1024.014791 229.234805 794.787362 0 512.018459 0zM512.018459 999.025328c-268.990769 0-487.036372-218.052979-487.036372-487.021621s218.052979-487.028996 487.036372-487.028996c268.983393 0 487.028996 218.052979 487.028996 487.028996S781.001853 999.025328 512.018459 999.025328z" p-id="1966"></path>
            <path d="M751.645872 315.628424c-29.842788-29.547753-69.628256-44.439644-109.244078-44.439644-37.292422 0-74.385695 13.217567-102.782812 39.881354-11.941541 10.24509-20.600818 18.225786-27.652154 18.225786-7.523392 0-14.154303-7.50864-27.578395-18.225786-30.373851-26.811304-67.452373-40.036247-104.19898-40.036247-39.165894 0-77.93349 15.009905-107.805782 44.587162-60.076498 59.456925-60.076498 161.118604 0 220.575528l216.754825 209.519092c4.322262 4.322262 14.110048 7.235733 23.956841 7.235733 8.312611 0 16.654725-2.087372 21.773582-7.213605l216.776953-209.548596C811.685491 476.739651 811.685491 375.070597 751.645872 315.628424L751.645872 315.628424zM734.430581 518.413343 518.059301 727.563641c-0.730212 0.258156-2.397159 0.641701-4.993467 0.641701-3.496165 0-6.387507-0.730212-7.729917-1.224395l-215.559934-208.368456c-23.971592-23.720813-37.720222-57.502318-37.720222-92.699991 0-35.205049 13.74863-68.993931 37.734974-92.714743 24.362514-24.133862 56.454944-37.425187 90.376591-37.425187 31.915409 0 63.115359 12.0153 87.831914 33.833137l0.46468 0.420425 0.486808 0.390921c2.965102 2.36028 5.576161 4.573042 7.943817 6.549777 10.429487 8.769915 20.283655 17.060398 35.064908 17.060398 15.695861 0 27.475133-10.141828 41.105749-21.898972l2.655315-2.301273 0.420425-0.354042 0.413049-0.383545c22.776701-21.390036 53.275942-33.18406 85.847804-33.18406 34.423207 0 67.887549 13.586361 91.814886 37.285046 23.964216 23.713437 37.698095 57.502318 37.698095 92.699991S758.188273 494.891679 734.430581 518.413343L734.430581 518.413343zM382.453847 330.859605c-14.655863-1.681699-44.498651 3.739568-66.486133 25.734426-17.761106 17.702099-28.581514 43.377518-28.972435 68.69152-0.095886 6.83006 5.362261 12.457852 12.192321 12.553738l0.191773 0c6.741549 0 12.266079-5.421268 12.376717-12.184945 0.280283-19.015005 8.401121-38.288165 21.692447-51.564739 16.10891-16.116286 38.435682-19.538692 46.121344-18.653587 6.741549 0.833474 12.937284-4.071483 13.726503-10.857287C394.092977 337.807678 389.232276 331.656199 382.453847 330.859605L382.453847 330.859605zM382.453847 330.859605" p-id="1967"></path>
          </svg>
        </span>
      </div>
      <div class="recommend">
        <PetsItem
          v-for="petsitem in recommendList"
          :key = 'petsitem.index'
          :img_url = 'petsitem.image'
          :title='petsitem.title'
          :variety='petsitem.category'
          :id='petsitem.id'
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapActions} from 'vuex'
import PageHeader from './PageHeader.vue'
import axios from 'axios'
import PetsItem from './search/PetsItem.vue'
export default {
  name:"PageIndex",
  components:{
    PageHeader,PetsItem
  },

  data(){
    return{
      imgSrc:require('../../public/img/wblogo.png'),
      searchKeyword:"",
      props:{
        expandTrigger: 'hover',
        lazy: true,
        async lazyLoad (node, resolve) {
          let leaf;
          let res; 
          if(!node.root){
            if(!node.data.leaf){
              res = await axios.get("http://localhost:8001/api/pets/getCategory?kind="+node.data.value);
              leaf = true
            }
          }else{
            res = await axios.get("http://localhost:8001/api/pets/getKinds");
            leaf = false
          }
          let nodes = new Array();
          if(res==null) {
            resolve(null)
            return 
          }
          let data = res.data.data
          for(let i = 0; i<data.length;i++){
            // 地点
            let node = {
                'value': data[i],
                'label': data[i],
                'leaf': leaf
            }
            nodes.push(node)
          }
          resolve(nodes);
        }
      },
      category_menu:[],
      recommendList:[],
      ad_list:[]
    }
  },
  methods:{
     ...mapActions("PetsOption",{'search':"search"}),
    gotoSearchPage(){
      this.$router.push({name:'search', params:{keyword: this.searchKeyword}}) 
      this.search(["keyword",this.searchKeyword])
    },
    // 点击时触发
    changes(n) {
      console.log("传入的参数：", n);
      this.search(["kinds",n[0]])
      this.search(["category",n[1]])
      let oP = document.querySelector("#cascader-paner-my");
      // console.log(oP);
      let oo = oP.querySelectorAll(".el-cascader-menu");
      oo[1].style.visibility = "hidden";
      this.$router.push({name:'search'})
    },
    // 鼠标离开时触发
    closePanel(){
      let oP = document.querySelector("#cascader-paner-my");
      let oo = oP.querySelectorAll(".el-cascader-menu");
      oo[1].style.visibility = "hidden";
    },
    // 鼠标进入时触发
    openPanel(){
      let oP = document.querySelector("#cascader-paner-my");
      let oo = oP.querySelectorAll(".el-cascader-menu");
      try{
        oo[1].style.visibility = "visible";
      }catch(e){
        console.log(e.message);
      }
    },
    getAdList(){
      axios.get("http://localhost:8001/api/ad/").then(res=>{
        this.ad_list = res.data.data
      })
    },
  },
  mounted(){
    // 绑定事件(级联面板离开时)
    let panel = document.getElementById('cascader-paner-my')
    panel.addEventListener('mouseleave',()=>{
      this.closePanel()
    })

    this.getAdList()
    axios.get("http://localhost:8001/api/search").then(res=>{
      this.recommendList = res.data.data.dataList;
      console.log(res.data);
    })
    // 
  }
}
</script>

<style scoped>

  .index-contain{
    height: 100vh;
    background-color: rgb(247 247 247);
  }
  .header{
    background-color: white;
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
  }
  .hotwords{
    display: flex;
  }
  .hotwords>a{
    margin-left: 15px;
  }
  .logo{
    width: 150px;
    height: 150px;
  }
  .input-margin{
    margin-top: 15px;
  }

  .cascader-style{
    height: 400px !important;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #fff4e7;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #fff4e7;
  }

  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .el-scrollbar__bar.is-horizontal {
    display: none;
  }
  
  .index-contain::-webkit-scrollbar{
    display:none
  }

  .el-cascader-menu__wrap{
    height: 450px !important;
  }
  li{
    list-style: none;
  }
  /* 选项栏 */
  .choice-item-list{
    background-color: white;
    margin: 0;
  }
  .choice-item-list{
    padding-left: 0px;
    height: 25px;
  }
  .choice-item-list:hover{
    background-color: violet;
  }
  /* 在一旁显示 */
  .choice-item-child-list{
    display: none;
    margin-left: 30px;
    background-color: white;

  }
  .choice-item-list-container{
    height: 300px;
  }

  .choice{
    margin-left: 20px;
  }


  .recommend_title>*{
    display: inline-block;
  }
  /* 猜你喜欢图标对其文字 */
  .guess_like{
    position: relative;
    top: 7px; 
  }

  /* 推荐列表 */
  .recommend{
    display: flex;
    flex-wrap: wrap;
  }

  .choice-item-list-container :deep().el-cascader-panel{
    background-color: #ffffff;
    height: 300px;
  }
  .choice-item-list-container :deep() .el-cascader-menu__wrap{
    height: 300px;
  }
  .choice-item-list-container :deep() .el-cascader-menu__list{
    z-index: 5;
    background-color: white;
  }
  .choice-item-list-container :deep() .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .el-carousel__container{
    margin-left: 50px;
  }

</style>

