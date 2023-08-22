// store
// 引入Vue
import axios from 'axios'
import Vue from 'vue'
// 引入vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// 宠物查询系统数据
const PetsOption={
  namespaced:true,
    // 响应组建中的动作
  actions: {
    search(context,value){
      if(value){
        if(value[0] != "current"){
          // 给state添加数据
          Vue.set(context.state.selectedCondtionList, value[0],value[1])
        }else{
          context.state.current = value[1]
        }
      }
      let requestParam = context.state.selectedCondtionList
      this.state.globalOptions.isLoading = true
      axios.get("http://43.143.254.110:8001/api/search",{ params:{...requestParam,'current':context.state.current}}).then(res=>{
        context.commit("updateData",res.data.data);
        this.state.globalOptions.isLoading = false
      }).catch(err=>{
        this.state.globalOptions.isLoading = false
        context.commit("updateData",[]);
        console.log(err);
      })
    },
    removeSearchCondition(context,value){
      console.log("removeSearchCondition");
      // delete state.selectedCondtionList[value]
      delete context.state.selectedCondtionList[value]
      let requestParam = context.state.selectedCondtionList
      this.state.globalOptions.isLoading = true
      axios.get("http://43.143.254.110:8001/api/search",{ params:requestParam}).then(res=>{
        context.commit("updateData",res.data.data);
        this.state.globalOptions.isLoading = false
      }).catch(()=>{
        this.state.globalOptions.isLoading = false
      })
      console.log(this);
    },
    setLoadingStatus(value){
      this.state.globalOptions.isLoading = value
    }
  },

  // 用于操作数据（state）
  mutations: {
    updateData(state,value){
      // 详细信息，如果对象值的长度小于等于1就不要了
      // map不为空
      if(Object.keys(value.detailMap).length){
        for(let key in value.detailMap){
          if(value.detailMap[key].length <= 1){
            // 如果只有一条就不要了
            delete state.searchConditionList.detailInfo[key]
            continue
          }
          state.searchConditionList.detailInfo[key] = value.detailMap[key]
        }
      }else{
        // map为空
        state.searchConditionList.detailInfo = {}
      }
      state.searchConditionList.category = value.categoryCollect
      state.petsData = value.dataList
      state.total = value.total
      state.current = value.current
    }
  },

  // 用于存储数据
  state: {
    // 展示搜索的条件
    searchConditionList:{
      category: ['0-5','5-10','10-15'],
      weight:['0-5kg','5-10kg','10-15kg','15-20kg','20kg以上'],
      height:['0-5cm','5-10cm','10-15cm','15-20cm','20cm以上'],
      detailInfo:{},
    },
    // 选中的条件
    selectedCondtionList:{
      kinds:'猫猫',
    },
    // 猫的数据
    petsData:[],
    // 总数据条数
    total:0,
    //当前页
    current:1,
  },

  // 用于加工state的数据
  getters: {
    bigA(state){
      return state.a*19;  // 
    }
  },
}

// 用户系统数据
const PersonOptions = {
  namespaced:true,

  actions: {
    // 更改form表单数据
    updateRuleForm(context,value){
      context.commit("updateRuleForm",value)
    },
    //
    finshUpload(context){
      context.commit('finshUpload')
    },
    updateAddress(context,value){
      context.subbmit('updateAddress',value)
    }
  },
  
  mutations: {
    updateRuleForm(state,value){
      // value为用户编写的表单数据
      Object.assign(state.PetsForm,value)
    },
    finshUpload(state){
      state.finished = true
      state.PetsForm = {}
    },
    updateAddress(state,value){
      state.userInfoForm['userAddress'] = value
    }
  },
  
  state: {
    // 用户的宠物信息表单所有数据
    PetsForm:{},
    userInfoForm:{},
    // 所在的步骤
    active:0,
    finished:false
  }
}


// 发布宠物数据
const PostPetsOptions = {
  namespaced:true,
  actions: {
    // 更改form表单数据
    updateRuleForm(context,value){
      context.commit("updateRuleForm",value)
    },
    //
    finshUpload(context){
      context.commit('finshUpload')
    }
  },
  
  mutations: {
    updateRuleForm(state,value){
      // value为用户编写的表单数据
      Object.assign(state.PetsForm,value)
    },
    finshUpload(state){
      state.finished = true
      state.PetsForm = {}
    }
  },
  
  state: {
    // 宠物信息表单所有数据
    PetsForm:{},
    // 所在的步骤
    active:0,
    finished:false
  }  
}

// 全局
const globalOptions = {
  namespaced: true,
  actions:{
    loadingStatus(context,value){
      context.commit("LOADING_STATUS",value);
    }
  },
  mutations:{
    LOADING_STATUS(state,value){
      state.isLoading = value;
    }
  },
  state:{
    isLoading:false
  },

}


// 创建store
const store = new Vuex.Store({
  modules:{
    PetsOption,
    PersonOptions,
    PostPetsOptions,
    globalOptions
  }
})

export default store;