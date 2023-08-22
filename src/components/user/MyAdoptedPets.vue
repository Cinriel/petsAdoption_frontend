<template>
  <div>
    <el-container style="height: 95vh; border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">
          <el-badge :value="toPayList.length" :max="99" class="item">
            待支付
          </el-badge>
        </el-menu-item>
        <el-menu-item index="2">
          <el-badge :value="toReceiveList.length" :max="99" class="item">
            待收货
          </el-badge>
        </el-menu-item>
        <el-menu-item index="3">
          <el-badge :value="finishedList.length" :max="99" class="item">
            待评价
          </el-badge>
        </el-menu-item>
        <el-menu-item index="4">
          <el-badge :value="200" :max="99" class="item">
            全部
          </el-badge>
        </el-menu-item>
      </el-menu>
      </el-header>

      <div v-show="activeIndex==1">
        <el-main>
          <el-empty description="暂时没有内容哦" v-if="!toPayList.length"></el-empty>
          <el-row v-else class='pet-card-list'>
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
        </el-main>
      </div>

      <div v-show="activeIndex==2">
        <el-main>
          <el-empty description="暂时没有内容哦" v-if="!toReceiveList.length"></el-empty>
          <el-row v-else class='pet-card-list'>
            <el-col :span="8" v-for="toReceiveListItem in toReceiveList" :key="toReceiveListItem.id">
              <el-card :body-style="{ padding: '0px' }">
                <img :src="toReceiveListItem.image" class="image">
                <div style="padding: 14px;">
                  <div class="bottom clearfix">
                    <span>下单日期:{{toReceiveListItem.buildDate | formatDate}}</span>
                    <el-button type="text" class="button" @click="confirmReceipt(toReceiveListItem.id)">确认收货</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </div>

      <div v-show="activeIndex==3">
        <el-main>
        待评价
        </el-main>
      </div>

      <div v-show="activeIndex==4">
        <el-main>
        全部
        </el-main>
      </div>
    </el-container>
 
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
      activeIndex: '1',  // 默认打开
      toPayList:[],   // 待支付
      toReceiveList:[],   // 待收货
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
    // 页面跳转
    handleSelect(key, keyPath) {
      this.activeIndex = key
      console.log(key, keyPath);
    },
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
    getToReceiveList(){
      this.$axios.get("/api/order/getToReceiveList").then(res=>{
        if(res.data.flag){
          this.toReceiveList = res.data.data
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
    this.getToReceiveList();
  }
}
</script>

<style scoped>
  .image{
    width: 100%;
    height: 400px;
  }
  .pet-card-lists{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .pet-card-list>div{
    margin: 10px;
    width: 30%;
  }
</style>