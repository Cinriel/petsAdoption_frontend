<template>
  <div class="page-style">
    <el-row class="pet-rought-info">
      <el-col :span="6">
        <img :src="petInfo.image" alt="宠物图片" >
      </el-col>
      <el-col :span="16"><h3>{{petInfo.title}}</h3></el-col>
    </el-row>
    <div class="detail_info">
      <el-form label-width="80px" label-position='left' @submit.native.prevent class="order-creator-from">
        <el-form-item label="单价">
          <span>{{petInfo.money}} 元</span>
        </el-form-item>
        <el-form-item label="运费">
          <span>{{petInfo.freight}} 元</span>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="order.count" controls-position="right" :min="1" :max="petInfo.number"></el-input-number>
        </el-form-item>
        <el-form-item label="总价">
          <span>{{petInfo.freight+petInfo.money*order.count}} 元</span>
        </el-form-item>
        <el-form-item label="收货地址" class="receive-address-info">
          <input type="text" class="address-choice" @click="showAddressChoiceDialog=true" :value="receiveAddress.label">
          <el-link icon="el-icon-user" v-show="receiveAddress.username"> {{receiveAddress.username}}</el-link>
          <el-link icon="el-icon-phone" v-show="receiveAddress.phone"> {{receiveAddress.phone}}</el-link>
        </el-form-item>
        <el-button type="warning" plain @click="createOrder">确认</el-button>
        <el-button type="info" plain @click="$router.go(-1)">取消</el-button>
      </el-form>
    </div>


    <!-- dialog -> 收货地址 -->
    <el-dialog title="收货地址" :visible.sync="showAddressChoiceDialog">
      <el-table 
      :data="addressInfo"
      ref="singleTable"
      highlight-current-row
      @current-change="setReceiveAddress"
      style="width: 100%"
      >
        <el-table-column property="username" label="姓名" width="200"></el-table-column>
        <el-table-column property="phone" label="电话" width="200"></el-table-column>
        <el-table-column property="label" label="地址" width="400"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 支付dialog -->
    <el-dialog
      title="请支付"
      :visible.sync="showPayDialog"
      width="30%"
      :before-close="handleClose">
      <h4>支付金额:{{createdOrder.payMoney}} 元</h4>
      <span>请选择支付方式</span> <br>
      <el-link type="primary" @click="payWithBalance">余额支付</el-link> <br>
      <el-link type="success" @click="payWithWX">微信支付</el-link> <br>
      <el-link type="warning" @click="payWithZFB">支付宝支付</el-link> <br>
      <el-link type="danger" @click="payWithBankCard">网银支付</el-link> <br>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPayDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"CreateOrder",
  data(){
    return{
      // 订单相关
      order:{
        petId:'',     //领养的宠物id
        addressId:'', // 收货地址
        count:1,     // 领养数量
      },
      petInfo:{

      },
      addressInfo:[],
      receiveAddress:{},
      // 如果有的话要删除相应的wishlist
      wishListId:'',
      // 地址选择对话框
      showAddressChoiceDialog:false,
      // 打开支付dialog
      showPayDialog:false,
      // order id
      createdOrder:{
        orderId:'',
        payMoney:''
      }
    }
  },
  methods:{
    getPetInfo(id){
      this.$axios.get("/api/petDetail/getById?id="+id).then(res=>{
        let petsList = res.data.data
        if(res.data.flag){
          if(petsList.length){
            this.petInfo = petsList[0]
          }else{
            // 宠物不存在
            this.$message.error("改宠物不存在");
            this.$router.back()
          }
        }else{
          this.$message.error("系统错误，请稍后再试")
        }
      })
    },
    getShoppingAddress(){
      this.$axios.get("/api/shopping_address/getAllAddress").then(res=>{
        let addressDataist = res.data.data
        for(let i = 0;i<addressDataist.length;i++){
          let addressData = {}
          addressData['label'] = addressDataist[i].extendField.formattedAddress;
          addressData['id'] = addressDataist[i].id
          addressData['username'] = addressDataist[i].username
          addressData['phone'] = addressDataist[i].phone
          this.addressInfo.push(addressData)
        }
      })
    },
    openAddressChoiceDialog(){
      console.log('openAddressChoiceDialog');
    },
    setReceiveAddress(val) {
      this.showAddressChoiceDialog = false
      this.receiveAddress = val
      this.order.addressId=val.id
    },
    createOrder(){
      if(!this.order.addressId){
        this.$message.error("请选择地址")
        return
      }
      this.$axios.post("/api/order/create",this.order).then(res=>{
        if(res.data.flag){
          this.$message.success(res.data.message)
          this.createdOrder.orderId = res.data.data.id
          this.createdOrder.payMoney = res.data.data.payMoney
          this.showPayDialog = true
        }else{
          this.$message.error("订单创建失败")
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.$message.warning("请在个人中心中进行支付")
          done();
        })
        .catch(() => {});
    },
    payWithBalance(){
      this.$axios.post('/api/order/pay?orderId='+this.createdOrder.orderId).then(res=>{
        if(res.data.flag){
          this.$message.success(res.data.message)
          console.log(res.data);
          this.showPayDialog = false
          setTimeout(() => {
            this.$router.push({name:'myAdoptedPets'})
          }, 1000);
        }else{
          this.$message.error(res.data.message)
          this.showPayDialog = false
        }
        console.log(res.data);
      })
    },
    payWithWX(){
      this.$message.error("该功能暂时不可用，敬请等待")
    },
    payWithZFB(){
      this.$message.error("该功能暂时不可用，敬请等待")
    },
    payWithBankCard(){
      this.$message.error("该功能暂时不可用，敬请等待")
    },

  },
  mounted(){
    // 通过路由获取 wishListId(有的话创建成功就需要删除相应订单) or petId(必须要)
    let params = this.$route.params;
    this.order.petId = params.petId;
    this.getPetInfo(params.petId)
    this.getShoppingAddress()
    this.wishListId = params.wishListId;
  }
}
</script>

<style scoped>
  .page-style{
    padding: 50px;
  }

  .pet-rought-info{
    border-color: blanchedalmond;
    border-width: 2px;
    border-style: dashed;
  }
  
  .order-creator-from:hover{
    box-shadow: 2px 2px 5px 0px rgb(207, 207, 207);
  }
  .pet-rought-info img{
    border-radius: 5px;
    height: 200px;
  }
  .detail_info{
    margin-top: 10px;
  }
  .detail_info >>> .el-form{
    text-align: left;
    padding-bottom: 10px;
    
  }

  .address-choice{
    border-left: 0px;
    border-right: 0px;
    border-top: 0px;
    border-bottom: 1px solid;
  }

  .receive-address-info *{
    margin-left: 10px;
  }
  .receive-address-info input{
    width: 250px;
  }


</style>