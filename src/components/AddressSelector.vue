<template>
<!-- 可以传入一个回调函数获取用户选择的地址 -->
<div>
    <el-cascader 
      ref="cascaderAddr"
      :props="props"
      separator='/'
      @blur="saveAddress"
      >   
    </el-cascader>
    <el-input v-model="addressDetail" placeholder="请输入详细地址" @blur="saveAddress"></el-input>
</div>

</template>

<script>
import axios from 'axios'
export default {
  /// 回调函数，接受选择的地址
  props:['getAddress'],
  name:"AddressSelector",
  data(){
    return {
      addressId:'',
      addressDetail:'',
      formattedAddress:"",
      props:  {
        lazy: true,
        async lazyLoad (node, resolve) {
          console.log(node);
          let res;
          if(!node.root){
            // 不为根节点
            let id = node.data.id
            res = await axios.get("http://43.143.254.110:8001/api/region/getSubregion?pid="+id);
            // 地点集合
          }else{
            res = await axios.get("http://43.143.254.110:8001/api/region/getSubregion?pid=100000");
          }
          let nodes = new Array();
          let data = res.data.data
          for(let i = 0; i<data.length;i++){
            // 地点
            let node = {
                value: data[i].id,
                id:data[i].id,
                label: data[i].name,
                leaf: data[i].level >= 3
            }
            nodes.push(node)
          }
          resolve(nodes);
        }
      },
      dialogAddAddress:false,   // 添加地址的dialog

    };
  },
  methods:{
    saveAddress(){
      let node = this.$refs['cascaderAddr'].getCheckedNodes()[0]
      if(node){
        this.addressId = node.data.value
      }
      let formattedAddressTemp = this.$refs['cascaderAddr'].inputValue+this.addressDetail;
      this.formattedAddress = formattedAddressTemp
      try{
        // 返回地址
        let addressInfo = {id:this.addressId,detailAddress:this.addressDetail,formattedAddress: formattedAddressTemp}
        this.getAddress(addressInfo)
      }catch(e){
        console.warn("需要回调函数");
        // do nothing
      }
    }
  }
}
</script>

<style>

</style>