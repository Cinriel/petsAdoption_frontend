<template>
  <div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template slot="title">
          <el-badge :value="toPayList.length" class="item">
            <h3>待支付</h3>
          </el-badge>
        </template>
        <el-empty description="暂时没有内容哦" v-if="!toPayList.length"></el-empty>
        
        <el-row v-else>
          <el-col :span="8" v-for="toPayListItem in toPayList" :key="toPayListItem.id">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="toPayListItem.image" class="image">
              <div style="padding: 14px;">
                <span>{{toPayListItem.title}}</span>
                <div class="bottom clearfix">
                  <span>{{toPayListItem.payMoney}} 元 &nbsp;</span>

                  <el-button type="text" class="button" @click="pay(toPayListItem.id,toPayListItem.payMoney)">支付</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template slot="title">
          <el-badge :value="travelList.length" class="item">
            <h3>运送中</h3>
          </el-badge>

        </template>
        <el-empty description="暂时没有内容哦" v-if="!toPayList.length"></el-empty>
        
        <el-row v-else>
          <el-col :span="8" v-for="travelListItem in travelList" :key="travelListItem.id">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="travelListItem.image" class="image">
              <div style="padding: 14px;">
                <div class="bottom clearfix">
                  <span>下单日期:{{travelListItem.buildDate | formatDate}}</span>
                  <el-button type="text" class="button" @click="confirmReceipt(travelListItem.id)">确认收货</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

    </el-collapse>
 
    <!-- 支付dialog -->
    <el-dialog
      title="请支付"
      :visible.sync="showPayDialog"
      width="30%">
      <h4>支付金额:{{payMoney}} 元</h4>
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
import {mapActions} from 'vuex'
export default {
  name:"MyAdoptedPets",
  data(){
    return{
      activeNames: ['1'],
      toPayList:[],   // 待支付
      travelList:[],   // 已支付
      finishedList:[], // 待评价
      showPayDialog:false,
      payMoney:'',
      orderId:'',
    }
  },
  filters:{
    formatDate(value){
      value = new Date(value)
      return value.getFullYear()+ "-" + (value.getMonth()+1) + "-" + value.getDate()
    }
  },
  methods:{
    ...mapActions('globalOptions',['loadingStatus']),

    handleChange(val) {
      console.log(val);
    },
    getToPayList(){
      this.loadingStatus(true)
      this.$axios.get("/api/order/getToPayList").then(res=>{
        this.loadingStatus(false)
        if(res.data.flag){
          this.toPayList = res.data.data
        }else{
          this.$message.error("系统出错，请稍后再试")
        }
      }).catch(()=>{
        this.$message.error("系统出错，请稍后再试")
        this.loadingStatus(false)
      })
    },
    getTravelList(){
      this.$axios.get("/api/order/getTravelList").then(res=>{
        if(res.data.flag){
          this.travelList = res.data.data
        }else{
          this.$message.error("系统出错，请稍后再试")
        }
      })
    },
    pay(id,money){
      this.payMoney = money;
      this.orderId = id;
      this.showPayDialog = true
      
    },
    // 确认收货
    confirmReceipt(id){
      this.$axios.post("/api/order/confirmReceipt?orderId="+id).then(res=>{
        if(res.data.flag){
          this.$message.success("确认成功");
          this.getTravelList();
        }else{
          this.$message.error("确认收货失败，请稍后再试");
        }
      })
    },
    // 评论
    comment(id){
      console.log(id);
    },
    payWithBalance(){
      this.$axios.post('/api/order/pay?orderId='+this.orderId).then(res=>{
        if(res.data.flag){
          this.$message.success(res.data.message)
          console.log(res.data);
          this.showPayDialog = false
          this.getToPayList()
        }else{
          this.$message.error(res.data.message)
        }
        console.log(res.data);
      }).catch(()=>{
        this.$message.error("系统错误，请稍后再试")
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
    this.getToPayList();
    this.getTravelList();
  }
}
</script>

<style scoped>
  .image{
    width: 100%;
    height: 400px;
  }
</style>